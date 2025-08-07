import Agent from '@entities/Agent';
import User from '@entities/User';
import { generateToken } from '@utils/auth/generateToken';
import {
  BadRequest,
  NotFound,
  Unauthorized,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


interface Authentication {
  user: { id: string; name: string; email: string; };
  agents: Agent[];
  token: string;
}

export default async function validateEmailAndAuthenticate(
  email: string,
  token: string,
): Promise<Authentication> {
  try {
    if (!email || !token) {
      throw new BadRequest('Dados inválidos.');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, `${process.env.SECRET}`);
    } catch (err) {
      throw new Unauthorized('Token de verificação inválido');
    }

    if (!decoded.id || !decoded.email || decoded.email !== email) {
      throw new Unauthorized();
    }

    console.log('DECODED JWT =====>', decoded);

    const user = await User.findOne(decoded.id, {
      where: { email: decoded.email },
      relations: ['accesses', 'accesses.workspace'],
    });

    if (!user) {
      throw new NotFound('Usuário não encontrado.');
    }

    const agents = user.agents;

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      agents,
      token: generateToken({ id: user.id }),
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao validar o e-mail.');
  }
}
