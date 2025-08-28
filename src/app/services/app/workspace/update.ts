import Workspace from '@entities/Workspace';
import { NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';

export default async function updateWorkspaceService(id: string, body: any) {
  const { agent, name, configurations }: Workspace = body;

  try {
    const workspace = await Workspace.findOne(id);

    if (!workspace) {
      throw new NotFound('Agente não encontrado.');
    }

    const valuesToUpdate = {
      agent: {
        name: agent.name || workspace.agent.name,
        model: agent.model || workspace.agent.model,
        instructions: agent.instructions || workspace.agent.instructions,
      },
      name: name || workspace.name,
      configurations:{
        waiting_time: configurations.waiting_time || workspace.configurations.waiting_time,
      }
    };

    await Workspace.update(workspace.id, { ...valuesToUpdate });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao buscar atualizar o usuário.');
  }
}
