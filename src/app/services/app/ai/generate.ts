import { BadGateway, BadRequest, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';


import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export default async function generateAIService(
  prompt: string,
): Promise<string> {
  try {
    if (!prompt) {
      throw new BadRequest()
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      temperature: 1,
      messages: [{ role: 'user', content: prompt }],
    });

    if(!response){
      throw new BadGateway()
    }

    const ai = response.choices[0].message.content;

    if(!ai){
      throw new InternalServerError()
    }
    return ai;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Falha interna ao verificar se a conta existe!',
    );
  }
}
