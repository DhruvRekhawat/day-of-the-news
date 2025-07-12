import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(content: string): Promise<string> {
  if (!content) {
    return '';
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes news articles in a neutral tone."
        },
        {
          role: "user",
          content: `Please provide a concise, neutral summary of the following news article:\n\n${content}`
        }
      ],
      max_tokens: 150,
    });
    return response.choices[0].message.content?.trim() || '';
  } catch (error) {
    console.error("Error generating summary:", error);
    return '';
  }
}

export async function analyzeBias(content: string): Promise<'left' | 'center' | 'right'> {
  if (!content) {
    return 'center';
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a political bias analyst. Your task is to analyze the following news article and classify its bias as 'left', 'center', or 'right'. Respond with only one of these three words."
        },
        {
          role: "user",
          content: `Analyze the political bias of this article:\n\n${content}`
        }
      ],
      max_tokens: 5,
    });

    const bias = response.choices[0].message.content?.trim().toLowerCase();
    if (bias === 'left' || bias === 'right') {
      return bias;
    }
    return 'center';
  } catch (error) {
    console.error("Error analyzing bias:", error);
    return 'center';
  }
}