import Stripe from 'stripe';
import dotenv from 'dotenv';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { BadGateway } from '@utils/http/errors/controlled-errors';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

export const createSubscription = async (
  customerId: string,
  priceId: string,
  paymentMethodId: string,
) => {
  try {
    const price = await stripe.prices.retrieve(priceId);

    if (!price) {
      throw new BadGateway('Erro ao buscar o price');
    }
    const product = await stripe.products.retrieve(price.product as string);

    if (!product) {
      throw new BadGateway('Erro ao buscar o produto');
    }
    const invoices = await stripe.subscriptions.create({
      customer: customerId,
      default_payment_method: paymentMethodId,
      items: [
        {
          price: priceId,
        },
      ],
      metadata: product.metadata,
      // trial_period_days: 7
    });

    if (!invoices) {
      throw new BadGateway('Erro ao buscar as faturas');
    }
    // console.log(invoices);

    return invoices;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new InternalServerError();
  }
};
