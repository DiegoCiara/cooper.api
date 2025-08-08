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
import sendMail from '../../mail/sendEmail';
import { firstName } from '@utils/formats';

interface Authentication {
  user: {
    id: string;
    name: string;
    email: string;
    has_validate_email: boolean;
  };
  token: string;
}

export default async function authentication(
  email: string,
  password: string,
): Promise<Authentication> {
  try {
    if (!email || !password) {
      throw new BadRequest('Dados inválidos.');
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFound('Usuário não encontrado.');
    }

    if (!(await bcrypt.compare(password, user.password_hash))) {
      throw new Unauthorized('Senha inválida');
    }

    if (!user.has_validate_email) {
      const userName = firstName(user.name);
      const client = process.env.CLIENT_URL;

      const token = generateToken({ id: user.id, email: user.email });

      const mail = await sendMail(
        'validateEmail',
        'no-reply',
        `Valide sua conta, ${userName}!`,
        {
          client,
          name: userName,
          token,
          email,
        },
      );

      console.log(mail);
      if (!mail.data?.id) {
        throw new InternalServerError('Erro ao enviar e-mail de boas vindas');
      }
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        has_validate_email: user.has_validate_email,
      },
      token: generateToken({ id: user.id }),
    };
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao autenticar com a plataforma');
  }
}
