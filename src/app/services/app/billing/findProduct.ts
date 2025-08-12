import Stripe from 'stripe';
import dotenv from 'dotenv';
import { BadGateway } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

export const findProduct = async (id: string) => {
  try {
    // const product: any = await stripe.products.retrieve(id);

    // if (!product) {
    //   throw new BadGateway();
    // }
    const price = await stripe.prices.retrieve(id);

    if (!price) {
      throw new BadGateway();
    }

    const product: any = await stripe.products.retrieve(price.product.toString());

    if (!product) {
      throw new BadGateway();
    }
    return { ...product, price };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
