import User from '@entities/User';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import {
  BadGateway,
  BadRequest,
  Conflict,
  PaymentRequired,
} from '@utils/http/errors/controlled-errors';
import Agent from '@entities/Agent';
import { createSubscription } from '../../stripe/subscriptions/create-subscription';
import OpenAI from 'openai';

interface CreateAgentProps {
  user_id: string;
  agent: Agent;
  price_id: string;
  payment_method_id: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export default async function createAgentService({
  user_id,
  agent,
  price_id,
  payment_method_id,
}: CreateAgentProps): Promise<{
  id: string;
}> {
  try {
    // console.log(user_id, agent, price_id, payment_method_id)
    if (!user_id || !agent || !price_id || !payment_method_id) {
      throw new BadRequest('Dados incompletos!');
    }

    const user = await User.findOne(user_id);

    if (!user) {
      throw new Conflict('Usuário não encontrado!');
    }

    const subscription = await createSubscription(
      user.customer_id,
      price_id,
      payment_method_id,
    );

    if (!subscription || !subscription.id) {
      throw new PaymentRequired(
        'Pagamento não processado, altere o método de pagamento e tente novamente',
      );
    }


    const openai_assistant = await openai.beta.assistants.create({
      name: agent.name,
      instructions: agent.instructions || '',
      model: agent.model,
    });


    if (!openai_assistant) {
      throw new BadGateway('Erro ao criar o usuário');
    }

    const ia = await Agent.create({
      ...agent,
      model: 'gpt-40-nano',
      subscription_id: subscription.id,
      user,
      openai_assistant_id: openai_assistant.id || '',
    }).save();

    if (!ia) {
      throw new InternalServerError('Erro ao criar o usuário');
    }

    return {
      id: ia.id,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }

    throw new InternalServerError('Erro ao criar o usuário!');
  }
}
