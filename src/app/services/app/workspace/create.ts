import User from '@entities/User';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import {
  BadGateway,
  BadRequest,
  Conflict,
  PaymentRequired,
} from '@utils/http/errors/controlled-errors';
import { createSubscription } from '../../stripe/subscriptions/create-subscription';
import OpenAI from 'openai';
import Workspace from '@entities/Workspace';
import Access from '@entities/Access';

interface CreateAgentProps {
  user_id: string;
  workspace: {
    workspace: Workspace;
    agent: {
      name: string;
      instructions?: string;
    }
  };
  price_id: string;
  payment_method_id: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export default async function createWorkspaceService({
  user_id,
  workspace,
  price_id,
  payment_method_id,
}: CreateAgentProps): Promise<{
  id: string;
  name: string;
}> {
  try {
    console.log(user_id, workspace, price_id, payment_method_id)
    if (!user_id || !workspace || !price_id || !payment_method_id) {
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
      name: workspace.agent.name,
      instructions: workspace.agent.instructions || '',
      model: 'gpt-4.1-nano',
    });

    if (!openai_assistant) {
      throw new BadGateway('Erro ao criar o usuário');
    }

    const ia = await Workspace.create({
      name: workspace.workspace.name,
      type: workspace.workspace.type,
      agent:{
        name: workspace.agent.name,
        instructions: workspace.agent.instructions,
        model: 'gpt-4.1-nano',
      }
    }).save();

    if (!ia) {
      throw new InternalServerError('Erro ao criar workspace, entre em contato com nosso suporte!');
    }


    const access = await Access.create({
      workspace: ia,
      user: user,
      role: 'OWNER',
    }).save();

    if (!access) {
      throw new InternalServerError('Erro ao criar conta, entre em contato com nosso suporte!');
    }

    return {
      id: access.id,
      name: access.workspace.name,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }

    throw new InternalServerError('Erro ao criar o usuário!');
  }
}
