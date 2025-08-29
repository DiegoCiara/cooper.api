import Access from '@entities/Access';
import Workspace from '@entities/Workspace';
import { isAdmin } from '@utils/auth/isAdmin';
import { NotFound, Unauthorized } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';

export default async function updateWorkspaceService(id: string, body: any) {
  const { agent, name, configurations }: Workspace = body;

  try {
    const access = await Access.findOne(id, { relations: ['workspace'] });

    if (!access) {
      throw new NotFound('Acesso não encontrado.');
    }

    if (!isAdmin(access.role)) {
      throw new Unauthorized('Não autorizado.');
    }

    const workspace = await Workspace.findOne(access.workspace.id);

    if (!workspace) {
      throw new NotFound('Workspace não encontrado.');
    }

    const valuesToUpdate = {
      agent: {
        name: agent.name || workspace.agent.name,
        model: agent.model || workspace.agent.model,
        instructions: agent.instructions || workspace.agent.instructions,
      },
      name: name || workspace.name,
      configurations: {
        waiting_time:
          configurations.waiting_time || workspace.configurations.waiting_time,
      },
    };

    await Workspace.update(workspace.id, { ...valuesToUpdate });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao buscar atualizar o usuário.');
  }
}
