import { BiasDirection } from '../lib/generated/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface BiasAnalysisResult {
  biasDirection: BiasDirection;
  biasStrength: number; // 1-5
  confidence: number; // 0.0-1.0
  reasoning: string;
}

export async function analyzeArticleBias(article: any): Promise<BiasAnalysisResult> {
  try {
    const prompt = `
Analyze the following news article for political bias. Consider:
- Language used (loaded words, emotional language, sensationalism)
- Source selection and framing of the story
- Omission of opposing viewpoints or context
- Headline vs content alignment
- Use of quotes and attribution
- Overall tone and presentation

Article Title: ${article.title}
Article Content: ${article.content.substring(0, 2000)}...
Source: ${article.source}

Return ONLY a valid JSON response with this exact structure:
{
  "biasDirection": "FAR_LEFT" | "LEFT" | "CENTER_LEFT" | "CENTER" | "CENTER_RIGHT" | "RIGHT" | "FAR_RIGHT" | "UNKNOWN",
  "biasStrength": 1-5,
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of the bias assessment"
}

Be objective and analytical. If the article appears balanced, use CENTER. If uncertain, use UNKNOWN.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert media bias analyst. Analyze articles objectively and return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const analysis = JSON.parse(response.trim());
    
    // Validate the response
    if (!Object.values(BiasDirection).includes(analysis.biasDirection)) {
      analysis.biasDirection = 'UNKNOWN';
    }
    
    if (analysis.biasStrength < 1 || analysis.biasStrength > 5) {
      analysis.biasStrength = 3;
    }
    
    if (analysis.confidence < 0 || analysis.confidence > 1) {
      analysis.confidence = 0.5;
    }

    return analysis as BiasAnalysisResult;
  } catch (error) {
    console.error('Bias analysis failed:', error);
    
    // Return fallback analysis
    return {
      biasDirection: 'UNKNOWN',
      biasStrength: 3,
      confidence: 0.0,
      reasoning: 'Analysis failed - insufficient data or processing error'
    };
  }
}

// Quick bias estimation based on known sources
export function getQuickBiasEstimate(source: string): Partial<BiasAnalysisResult> {
  const domain = source.toLowerCase();
  
  // Known source biases (you can expand this)
  const knownBiases: Record<string, BiasDirection> = {
    'fox news': 'RIGHT',
    'cnn': 'LEFT',
    'bbc': 'CENTER',
    'reuters': 'CENTER',
    'associated press': 'CENTER',
    'npr': 'CENTER_LEFT',
    'msnbc': 'LEFT',
    'new york times': 'CENTER_LEFT',
    'wall street journal': 'CENTER_RIGHT',
    'washington post': 'CENTER_LEFT',
    'usa today': 'CENTER',
    'abc news': 'CENTER',
    'cbs news': 'CENTER',
    'nbc news': 'CENTER',
  };
  
  for (const [knownSource, bias] of Object.entries(knownBiases)) {
    if (domain.includes(knownSource)) {
      return {
        biasDirection: bias,
        biasStrength: 3,
        confidence: 0.7,
        reasoning: `Based on known source classification: ${knownSource}`
      };
    }
  }
  
  return {
    biasDirection: 'UNKNOWN',
    biasStrength: 3,
    confidence: 0.3,
    reasoning: 'Source not in known bias database'
  };
}
