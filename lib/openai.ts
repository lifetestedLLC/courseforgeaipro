import OpenAI from 'openai';

// Check if API key is configured
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Initialize OpenAI client only if configured
let openai: OpenAI | null = null;

if (isOpenAIConfigured()) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export default openai;
