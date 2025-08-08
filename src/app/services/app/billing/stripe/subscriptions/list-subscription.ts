import Stripe from 'stripe';
import dotenv from 'dotenv';
import { BadGateway } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

export const listSubscription = async (subsctiptionId: string) => {
  try {
    const subcription: any =
      await stripe.subscriptions.retrieve(subsctiptionId);

    if (!subcription) {
      throw new BadGateway('Erro ao buscar subscriprion');
    }
    const product = await stripe.products.retrieve(subcription?.plan?.product);

    if (!product) {
      throw new BadGateway('Erro ao buscar o produto');
    }
    return { ...product, plan: subcription.plan };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
