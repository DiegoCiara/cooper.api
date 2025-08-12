import Stripe from 'stripe';
import dotenv from 'dotenv';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { BadGateway, NotFound } from '@utils/http/errors/controlled-errors';
import User from '@entities/User';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

export const listPaymentMethods = async (user_id: string) => {
  try {
    const user = await User.findOne(user_id);

    if (!user) {
      throw new NotFound('Usuário não encontrado');
    }
    const methods = await stripe.paymentMethods.list({ customer: user.customer_id });

    if (!methods) {
      throw new BadGateway();
    }
    return methods.data;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Falha interna ao verificar se a conta existe!',
    );
  }
};
