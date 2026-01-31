import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  console.log('[API /enhance] Received request');

  const body = await req.json();
  console.log('[API /enhance] Request body:', body);

  const { text, context } = body;

  console.log('[API /enhance] Calling streamText with model gpt-4o-mini');

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
    onFinish: ({ text: generatedText, usage }) => {
      console.log('[API /enhance] streamText onFinish - generated text:', generatedText);
      console.log('[API /enhance] streamText onFinish - usage:', usage);
    },
  });

  console.log('[API /enhance] Returning toTextStreamResponse()');
  return result.toTextStreamResponse();
}
