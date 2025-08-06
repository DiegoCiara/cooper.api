import User from '@entities/User';
import crypto from 'crypto';
import {
  BadRequest,
  NotFound,
  Unauthorized,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import bcrypt from 'bcryptjs';

export default async function resetPasswordService(
  email: string,
  password: string,
  token: string,
): Promise<{ message: string }> {
  try {
    if (!email || !password || !token) {
      throw new BadRequest('Dados inválidos.');
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequest('Usuário não encontrado.');
    }
    if (token !== user.token_reset_password) {
      throw new Unauthorized('Token Inválido');
    }
    const now = new Date();

    if (now > user.reset_password_expires) {
      throw new Unauthorized('Token Expirado');
    }
    const password_hash = await bcrypt.hash(password, 10);

    await User.update(user.id, {
      password_hash,
      reset_password_expires: undefined,
      token_reset_password: undefined,
    });
    return {
      message: 'Senha alterada com sucesso!',
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao autenticar com a plataforma');
  }
}
