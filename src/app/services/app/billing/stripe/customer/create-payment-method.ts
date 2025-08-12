import Stripe from 'stripe';
import dotenv from 'dotenv';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { BadGateway, NotFound } from '@utils/http/errors/controlled-errors';
import User from '@entities/User';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

interface CustomerStripe {
  name: string;
  email: string;
  description?: string;
}

export const setPaymentMethodAsDefault = async (
  user_id: string,
  paymentMethodId: string,
) => {
  console.log(user_id, paymentMethodId);
  try {
    const user = await User.findOne(user_id);

    if (!user) {
      throw new NotFound('Usuário não encontrado');
    }
    const method = await stripe.customers.update(user.customer_id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    if (!method.id) {
      throw new BadGateway();
    }

    return method;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Falha interna ao verificar se a conta existe!',
    );
  }
};

export const createPaymentIntent = async (user_id: string) => {
  try {
    const user = await User.findOne(user_id);

    if (!user) {
      throw new NotFound();
    }
    const intent = await stripe.setupIntents.create({
      customer: user.customer_id,
      payment_method_types: ['card'],
    });

    return intent;
  } catch (error) {
    console.error(error);
    return;
  }
};
