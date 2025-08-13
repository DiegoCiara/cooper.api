import Stripe from 'stripe';
import dotenv from 'dotenv';
import { BadGateway } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

export const findPlanToUpgrade = async () => {
  try {
    const products: any = await stripe.products.list({ active: true });

    if (!products) {
      throw new BadGateway();
    }
    const plans: any = await Promise.all(
      products.data.map(async (e: any) => {
        if (e.default_price) {
          const price = await stripe.prices.retrieve(e?.default_price);
          return {
            ...e,
            price,
          };
        }
      }),
    );

    if (!plans) {
      throw new BadGateway();
    }
    return plans;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
