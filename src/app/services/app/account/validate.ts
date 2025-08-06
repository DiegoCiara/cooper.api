import User from '@entities/User';
import { BadRequest, Conflict } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';

interface FindAccountProps {
  field: 'id' | 'email' | 'name' | 'cpf';
  value: string;
}

export default async function validateAccountService({
  field,
  value,
}: FindAccountProps): Promise<boolean> {
  try {
    if (!field || !value) {
      throw new BadRequest('Dados incompletos!');
    }

    const user_exists = await User.findOne({
      where: {
        [field]: value,
      },
    });

    return !!user_exists
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError(
      'Erro ao validar conta do usuário.',
    );
  }
}
