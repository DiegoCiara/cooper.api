import User from '@entities/User';
import sendMail from '../../mail/sendEmail';
import bcryptjs from 'bcryptjs';
import { firstName } from '@utils/formats';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import {
  BadRequest,
  Conflict,
  PaymentRequired,
} from '@utils/http/errors/controlled-errors';
import emailValidator from '@utils/emailValidator';
import Agent from '@entities/Agent';
import { createSubscription } from '../billing/stripe/subscriptions/create-subscription';

interface CreateAgentProps {
  user_id: string;
  agent: Agent;
  price_id: string;
  payment_method_id: string;
}

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

    const ia = await Agent.create({
      ...agent,
      model: 'gpt-40-nano',
      user
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
