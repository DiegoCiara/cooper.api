import Agent from '@entities/Agent';
import User from '@entities/User';
import {
  BadGateway,
  BadRequest,
  Conflict,
  NotFound,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { getConnection } from '../../whatsapp/whatsapp';
import { v4 as uuid } from 'uuid';

export default async function findConnection(id: string) {
  try {
    if (!id) {
      throw new BadRequest('Dados incompletos!');
    }

    const agent = await Agent.findOne(id);

    if (!agent) {
      throw new NotFound('Usuário não encontrado.');
    }

    const status = await getConnection(agent.session_id, agent.session_token);

    return status;
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao conectar agente.');
  }
}
