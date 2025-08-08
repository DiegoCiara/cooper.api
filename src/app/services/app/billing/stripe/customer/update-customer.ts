import Stripe from 'stripe';
import dotenv from 'dotenv';
import { BadGateway } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

interface CustomerStripe {
  name: string;
  email: string;
  description?: string;
}

export const updateCustomer = async (
  customerId: string,
  data: CustomerStripe,
): Promise<Stripe.Customer | undefined> => {
  try {
    const { name, email } = data;

    const customer: Stripe.Customer = await stripe.customers.update(
      customerId,
      { name, email },
    );

    if (!customer.id) {
      throw new BadGateway();
    }
    console.log(customer);

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
