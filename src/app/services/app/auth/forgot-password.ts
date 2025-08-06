import User from '@entities/User';
import crypto from 'crypto';
import {
  BadRequest,
  NotFound,
} from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import sendMail from '../../mail/sendEmail';


export default async function forgotPasswordService(
  email: string,
): Promise<{ message: string }> {
  try {
    if (!email) {
      throw new BadRequest('Dados inválidos.');
    }

    const user = await User.findOne({ email });

    if (!user) {

      throw new NotFound('Usuário não encontrado');
    }

    const token = crypto.randomBytes(20).toString('hex'); // token que será enviado via email.

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.update(user.id, {
      token_reset_password: token,
      reset_password_expires: now,
    });

    const client = process.env.CLIENT_CONNECTION;

    // Envie o email e aguarde a conclusão antes de enviar a resposta
    const mail = await sendMail(
      'forgotPassword',
      'no-reply',
      'Recuperação de Senha',
      {
        client,
        name: user.name,
        token,
        email: user.email,
      },
    );

    if(!mail.data?.id){
      throw new InternalServerError();
    }

    return {
      message: 'Link de recuperação enviado para o e-mail.'
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao autenticar com a plataforma');
  }
}
