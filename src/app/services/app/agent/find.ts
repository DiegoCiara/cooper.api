import Agent from '@entities/Agent';
import User from '@entities/User';
import { BadRequest, Conflict, NotFound } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';

export default async function findAgents(id: string): Promise<Agent[]>{
  try {
    if (!id) {
      throw new BadRequest('Dados incompletos!');
    }

    const user = await User.findOne(id, { relations: ['agents']});

    if (!user) {
      throw new NotFound('Usuário não encontrado.');
    }

    return user.agents
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Erro ao buscar conta.',
    );
  }
}
