import Stripe from 'stripe';
import dotenv from 'dotenv';
import { BadGateway, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import Agent from '@entities/Agent';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

export const findSubscriptionService = async (agent_id: string) => {
  try {
    const agent = await Agent.findOne(agent_id);

    if (!agent) {
      throw new NotFound('Erro ao buscar subscriprion');
    }
    const subcription: any = await stripe.subscriptions.retrieve(
      agent.subscription_id,
    );

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
