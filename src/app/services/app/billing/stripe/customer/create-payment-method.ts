import Stripe from 'stripe';
import dotenv from 'dotenv';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { BadGateway } from '@utils/http/errors/controlled-errors';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

interface CustomerStripe {
  name: string;
  email: string;
  description?: string;
}

export const setPaymentMethodAsDefault = async (
  customerId: string,
  paymentMethodId: string,
) => {
  console.log(customerId, paymentMethodId);
  try {
    const method = await stripe.customers.update(customerId, {
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

export const createPaymentIntent = async (customerId: string) => {
  try {
    const intent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    return intent;
  } catch (error) {
    console.error(error);
    return;
  }
};
