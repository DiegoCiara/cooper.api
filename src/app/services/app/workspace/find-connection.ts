import Workspace from '@entities/Workspace';
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
import Access from '@entities/Access';

export default async function findConnection(id: string) {
  try {
    if (!id) {
      throw new BadRequest('Dados incompletos!');
    }

    const workspace = await Workspace.findOne(id);

    if (!workspace) {
      throw new NotFound('Usuário não encontrado.');
    }

    const { session_id, session_token } = workspace.session;

    const status = await getConnection(session_id, session_token);

    return status;
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao conectar agente.');
  }
}
