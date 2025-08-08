import Stripe from 'stripe';
import dotenv from 'dotenv';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { BadGateway } from '@utils/http/errors/controlled-errors';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

export const listPaymentMethods = async (customerId: string) => {
  try {
    const methods = await stripe.paymentMethods.list({ customer: customerId });

    if (!methods) {
      throw new BadGateway();
    }
    return methods;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Falha interna ao verificar se a conta existe!',
    );
  }
};
