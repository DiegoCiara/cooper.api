import { getManager } from 'typeorm';
import User from '@entities/User';
import sendMail from '../../mail/sendEmail';
import { firstName } from '@utils/formats';
import { HttpError } from '@utils/http/errors/http-errors';
import { BadRequest, Conflict,  NotFound } from '@utils/http/errors/controlled-errors';
import emailValidator from '@utils/emailValidator';
import { generateToken } from '@utils/auth/generateToken';
import { InternalServerError } from '@utils/http/errors/internal-errors';


export default async function resendValidateEmailService({
  email
}: { email: string}): Promise<{
  id: string;
}> {
  try {

    console.log(email)
    if (
      !email
    ) {
      throw new BadRequest('Dados incompletos!');
    }

    const user = await User.findOne({
      // where: [{ email }],
      where: { email },
    });

    if (!user) {
      throw new NotFound('Usuário não encontrado');
    }

    const userName = firstName(user.name);

    const client = process.env.CLIENT_URL;

    const token = generateToken({ id: user.id, email: user.email })

    await sendMail(
      'validateEmail',
      'no-reply',
      `Valide sua conta, ${userName}!`,
      {
        client,
        name: userName,
        token,
        email
      },
    );

    return {
      id: user.id,
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new InternalServerError('Erro ao criar o usuário!');
  }
}
