import Agent from '@entities/Agent';
import User from '@entities/User';
import { BadGateway, BadRequest, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { findSubscriptionService } from '../../stripe/subscriptions/find-subscription';
import { listInvoices } from '../../stripe/invoices/list-invoices';

export default async function findByIdService(id: string): Promise<any> {
  try {
    if (!id) {
      throw new BadRequest('Dados incompletos!');
    }

    const agent = await Agent.findOne(id);

    if (!agent) {
      throw new NotFound('Usuário não encontrado.');
    }

    const plan = await findSubscriptionService(agent.id);

    if(!plan){
      throw new BadGateway('Não foi possível buscar os dados do plano')
    }

    const invoices = await listInvoices(agent.subscription_id);

    if(!invoices){
      throw new BadGateway('Não foi possível buscar cobranças')
    }

    return { ...agent, plan, invoices: invoices.data };
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao buscar conta.');
  }
}
