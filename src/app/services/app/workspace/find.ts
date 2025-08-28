import Agent from '@entities/Workspace';
import User from '@entities/User';
import {
  BadRequest,
  Conflict,
  NotFound,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { getConnection } from '../../whatsapp/whatsapp';

export default async function findAgents(id: string): Promise<any[]> {
  try {
    if (!id) {
      throw new BadRequest('Dados incompletos!');
    }

    const user = await User.findOne(id, {
      relations: ['accesses', 'accesses.workspace'],
    });

    if (!user) {
      throw new NotFound('Usuário não encontrado.');
    }

    const workspaces = await Promise.all(
      user.accesses.map(async (e) => {
        let status = 'CLOSED';
        if (e.workspace.session) {
          const { session_id, session_token } = e.workspace.session;
          if (session_token) {
            status = await getConnection(session_id, session_token);
          }
        }
        return { name: e.workspace.name, id: e.id, whatsapp: { status } };
      }),
    );

    return workspaces;
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao buscar conta.');
  }
}
