import Workspace from '@entities/Workspace';
import {

  BadRequest,
  NotFound,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { startSession } from '../../whatsapp/whatsapp';
import { v4 as uuid } from 'uuid';
import { isAdmin } from '@utils/auth/isAdmin';
import Access from '@entities/Access';

export default async function connectAgent(id: string) {
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
