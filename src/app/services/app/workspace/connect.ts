import Workspace from '@entities/Workspace';
import {

  BadRequest,
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

    const workspace = await Workspace.findOne(id);

    if (!workspace) {
      throw new NotFound('Usuário não encontrado.');
    }

    const session_id = uuid();

    if (!session_id) {
      throw new InternalServerError('Erro ao gerar id da sessão');
    }

    const { qr_code, token, session } = await startSession(session_id);

    await Workspace.update(workspace.id, {
      session: { session_id: session, session_token: token },
    });

    return qr_code;
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao conectar agente.');
  }
}
