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

export const createCustomer = async (
  data: CustomerStripe,
): Promise<Stripe.Customer | undefined> => {
  try {
    const params: Stripe.CustomerCreateParams = {
      ...data,
    };

    const customer: Stripe.Customer = await stripe.customers.create(params);

    if (!customer.id) {
      throw new BadGateway();
    }

    return customer;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Falha interna ao verificar se a conta existe!',
    );
  }
};
