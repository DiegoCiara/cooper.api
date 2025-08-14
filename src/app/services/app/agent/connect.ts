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
import { startSession } from '../../whatsapp/whatsapp';
import { v4 as uuid } from 'uuid';

export default async function connectAgent(id: string) {
  try {
    if (!id) {
      throw new BadRequest('Dados incompletos!');
    }

    const agent = await Agent.findOne(id);

    if (!agent) {
      throw new NotFound('Usuário não encontrado.');
    }

    const session_id = uuid();

    if (!session_id) {
      throw new InternalServerError('Erro ao gerar id da sessão');
    }

    const { qr_code, token, session } = await startSession(session_id);

    await Agent.update(agent.id, { session_id: session, session_token: token });

    return qr_code;
    
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao conectar agente.');
  }
}
