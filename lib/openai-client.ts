import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface BiasAnalysis {
  bias: "left" | "center" | "right";
  biasScores: {
    left: number;
    center: number;
    right: number;
  };
}

export async function generateSummary(content: string): Promise<string> {
  if (!content) {
    return "";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes news articles in a neutral tone.",
        },
        {
          role: "user",
          content: `Please provide a concise, neutral summary of the following news article:\n\n${content}`,
        },
      ],
      max_tokens: 150,
    });
    return response.choices[0].message.content?.trim() || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "";
  }
}

export async function analyzeBias(content: string): Promise<BiasAnalysis> {
  if (!content) {
    return {
      bias: "center",
      biasScores: { left: 0, center: 1, right: 0 },
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a political bias analyst. Analyze the political bias of news articles and provide:
1. Overall bias classification: 'left', 'center', or 'right'
2. Bias scores as percentages (0-1) that sum to 1.0

Respond in this exact JSON format:
{
  "bias": "left|center|right",
  "biasScores": {
    "left": 0.0,
    "center": 0.0,
    "right": 0.0
  }
}`,
        },
        {
          role: "user",
          content: `Analyze the political bias of this article:\n\n${content}`,
        },
      ],
      max_tokens: 100,
      temperature: 0.1,
    });

    const responseText = response.choices[0].message.content?.trim();

    try {
      const parsed = JSON.parse(responseText || "{}");

      // Validate and normalize the response
      const bias = ["left", "center", "right"].includes(parsed.bias)
        ? parsed.bias
        : "center";

      let { left = 0, center = 0, right = 0 } = parsed.biasScores || {};

      // Ensure scores are numbers and sum to 1
      left = Math.max(0, Math.min(1, Number(left) || 0));
      center = Math.max(0, Math.min(1, Number(center) || 0));
      right = Math.max(0, Math.min(1, Number(right) || 0));

      const total = left + center + right;
      if (total === 0) {
        // Default to center if no valid scores
        return {
          bias: "center",
          biasScores: { left: 0, center: 1, right: 0 },
        };
      }

      // Normalize scores to sum to 1
      const normalizedScores = {
        left: left / total,
        center: center / total,
        right: right / total,
      };

      return {
        bias,
        biasScores: normalizedScores,
      };
    } catch (parseError) {
      console.error("Error parsing bias analysis response:", parseError);
      return {
        bias: "center",
        biasScores: { left: 0, center: 1, right: 0 },
      };
    }
  } catch (error) {
    console.error("Error analyzing bias:", error);
    return {
      bias: "center",
      biasScores: { left: 0, center: 1, right: 0 },
    };
  }
}
