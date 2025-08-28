import Agent from '@entities/Workspace';
import User from '@entities/User';
import {
  BadGateway,
  BadRequest,
  NotFound,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { findSubscriptionService } from '../../stripe/subscriptions/find-subscription';
import { listInvoices } from '../../stripe/invoices/list-invoices';
import Workspace from '@entities/Workspace';
import Access from '@entities/Access';
import { isAdmin } from '@utils/auth/isAdmin';

export default async function findByIdService(id: string): Promise<any> {
  try {
    if (!id) {
      throw new BadRequest('Dados incompletos!');
    }

    const access = await Access.findOne(id, { relations: ['workspace'] });

    if (!access) {
      throw new NotFound('Acesso não encontrado.');
    }

    if (!isAdmin(access.role)) {
      throw new NotFound('Acesso não encontrado.');
    }

    const workspace = await Workspace.findOne(access.workspace.id);

    if (!workspace) {
      throw new NotFound('Workspace não encontrado.');
    }

    const plan = await findSubscriptionService(workspace.id);

    if (!plan) {
      throw new BadGateway('Não foi possível buscar os dados do plano');
    }

    const invoices = await listInvoices(workspace.subscription_id);

    if (!invoices) {
      throw new BadGateway('Não foi possível buscar cobranças');
    }

    return { ...workspace, plan, invoices: invoices.data };
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao buscar conta.');
  }
}
