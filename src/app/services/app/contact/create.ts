import User from '@entities/User';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import {
  BadGateway,
  BadRequest,
  Conflict,
  NotFound,
  PaymentRequired,
} from '@utils/http/errors/controlled-errors';
import { createSubscription } from '../../stripe/subscriptions/create-subscription';
import OpenAI from 'openai';
import Workspace from '@entities/Workspace';
import Access from '@entities/Access';
import Contact from '@entities/Contact';

interface CreateAgentProps {
  user_id: string;
  workspace: {
    workspace: Workspace;
    agent: {
      name: string;
      instructions?: string;
    };
  };
  price_id: string;
  payment_method_id: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export default async function createContactService(id: string, body: Contact): Promise<{
  id: string;
}> {
  try {
    const workspace = await Workspace.findOne(id);

    if (!workspace) {
      throw new NotFound(
        'Workspace não encontrado',
      );
    }
    const contact = await Contact.create({
      name: body.name,
      phone: body.phone,
      workspace,
    }).save();

    if (!contact) {
      throw new InternalServerError(
        'Erro ao criar workspace, entre em contato com nosso suporte!',
      );
    }

    return {
      id: contact.id,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }

    throw new InternalServerError('Erro ao criar o usuário!');
  }
}
