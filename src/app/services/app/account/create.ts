import User from '@entities/User';
import sendMail from '../../mail/sendEmail';
import bcryptjs from 'bcryptjs';
import { firstName } from '@utils/formats';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import {
  BadGateway,
  BadRequest,
  Conflict,
} from '@utils/http/errors/controlled-errors';
import emailValidator from '@utils/emailValidator';
import { createCustomer } from '../../stripe/customer/create-customer';
import { generateToken } from '@utils/auth/generateToken';

interface CreateAccountProps {
  workspace_type: 'PERSONAL' | 'BUSINESS';
  email: string;
  password: string;
  name: string;
  cpf: string;
  crm_number?: string;
  workspace_name?: string;
  cnpj?: string;
}

export default async function createAccountService({
  email,
  password,
  name,
}: CreateAccountProps): Promise<{
  id: string;
}> {
  try {
    if (!email || !password || !name || !emailValidator(email)) {
      throw new BadRequest('Dados incompletos!');
    }

    const find_user = await User.findOne({
      where: [{ email }],
    });

    if (find_user) {
      throw new Conflict('Já existe um usuário com esse e-mail!');
    }

    const password_hash = await bcryptjs.hash(password, 10);

    const customer = await createCustomer({
      name,
      email,
    });

    if (!customer) {
      throw new BadGateway('Erro ao criar usuário');
    }

    const user = await User.create({
      name: name,
      email: email,
      password_hash,
      customer_id: customer.id,
    }).save();

    if (!user) {
      throw new InternalServerError('Erro ao criar o usuário');
    }

    const userName = firstName(name);
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

    return {
      id: user.id,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      throw error;
    }

    throw new InternalServerError('Erro ao criar o usuário!');
  }
}
