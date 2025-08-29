import Stripe from 'stripe';
import dotenv from 'dotenv';
import { BadGateway, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import Workspace from '@entities/Workspace';

dotenv.config();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

export const findSubscriptionService = async (workspace_id: string) => {
  try {
    const workspace = await Workspace.findOne(workspace_id);

    if (!workspace) {
      throw new NotFound('Erro ao buscar subscriprion');
    }
    const subcription: any = await stripe.subscriptions.retrieve(
      workspace.subscription_id,
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
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao buscar planos');
  }
};
