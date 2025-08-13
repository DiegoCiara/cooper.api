import Agent from '@entities/Agent';
import { BadRequest, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';

export default async function updateAgentService(id: string, body: any) {
  const { instructions, name }: Agent = body;

  try {

    const agent = await Agent.findOne(id);

    if (!agent) {
      throw new NotFound('Agente não encontrado.');
    }

    const valuesToUpdate = {
      name: name || agent.name,
      instructions: instructions || agent.instructions,
    };

    await Agent.update(agent.id, { ...valuesToUpdate });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao buscar atualizar o usuário.');
  }
}
