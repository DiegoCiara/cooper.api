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

// Função para deletar o método de pagamento
export const deleteMethod = async (paymentMethodId: string) => {
  try {
    // Detach (remover) o método de pagamento
    const detachedMethod = await stripe.paymentMethods.detach(paymentMethodId);

    // Caso o cliente tenha o método de pagamento como o método de pagamento padrão, remova-o
    if (detachedMethod.card) {
      // console.log('Método de pagamento removido com sucesso:', detachedMethod);
      return detachedMethod;
    }

    throw new BadGateway();
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Falha interna ao verificar se a conta existe!',
    );
  }
};
