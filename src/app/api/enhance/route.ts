import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { text, context } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are an expert writing assistant that enhances and improves text.
Your task is to take the user's rough, unpolished text and transform it into clear, professional, well-organized content.

Context for this text: ${context}

Guidelines:
- Maintain the original intent and key points
- Improve clarity, grammar, and flow
- Make it more professional and polished
- Keep approximately the same length (don't make it much longer)
- Return ONLY the enhanced text, no explanations or preamble`,
    prompt: `Please enhance and improve this text:\n\n${text}`,
  });

  return result.toTextStreamResponse();
}
