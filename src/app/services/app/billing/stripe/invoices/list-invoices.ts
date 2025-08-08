import Stripe from 'stripe';
import dotenv from 'dotenv';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { BadGateway } from '@utils/http/errors/controlled-errors';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

export const listInvoices = async (subscriptionId: string) => {
  try {
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
    });
    if (!invoices) {
      throw new BadGateway();
    }

    return invoices;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Falha interna ao verificar se a conta existe!',
    );
  }
};
