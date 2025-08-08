import Stripe from 'stripe';
import dotenv from 'dotenv';
import { findProduct } from '../../findProduct';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { BadGateway, NotFound } from '@utils/http/errors/controlled-errors';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

export const findProductOfSubscription = async (id: string) => {
  try {
    const subscription: any = await stripe.subscriptions.retrieve(id);

    if (!subscription) {
      throw new NotFound();
    }

    const { plan } = subscription;

    const product = await findProduct(plan.product);

    console.log(product);
    return product;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new InternalServerError();
  }
};
