import { getManager } from 'typeorm';
import User from '@entities/User';
import sendMail from '../../mail/sendEmail';
import bcryptjs from 'bcryptjs';
import Workspace from '@entities/Workspace';
import Access from '@entities/Access';
import { firstName } from '@utils/formats';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { BadRequest, Conflict } from '@utils/http/errors/controlled-errors';
import emailValidator from '@utils/emailValidator';

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
  workspace_type,
  email,
  password,
  name,
  cpf,
  crm_number,
  workspace_name,
  cnpj,
}: CreateAccountProps): Promise<{
  id: string;
}> {
  try {
    if (
      !workspace_type ||
      !email ||
      !password ||
      !name ||
      !cpf ||
      !emailValidator(email)
    ) {
      throw new BadRequest('Dados incompletos!');
    }

    if (workspace_type === 'PERSONAL') {
      if (!crm_number) throw new BadRequest('Número do CRM não foi informado!');
    }

    if (workspace_type === 'BUSINESS') {
      if (!workspace_name)
        throw new BadRequest('Nome do Workspace não foi informado!');
      if (!cnpj) throw new BadRequest('O CNPJ não foi informado!');
    }

    const find_user = await User.findOne({
      where: [{ email }, { cpf }],
    });

    if (find_user) {
      throw new Conflict('Falha interna!');
    }

    const password_hash = await bcryptjs.hash(password, 10);

    const user = await User.create({
      name: name,
      cpf: cpf,
      email: email,
      password_hash,
      regional_council_number: crm_number,
    }).save();

    if (!user) {
      throw new InternalServerError('Erro ao criar o usuário');
    }

    const workspace = await Workspace.create({
      name: workspace_name,
      type: workspace_type,
      cnpj: cnpj,
    }).save();

    if (!workspace) {
      throw new InternalServerError('Erro ao criar o workspace');
    }

    const access = await Access.create({
      user,
      workspace,
    }).save();

    if (!access) {
      throw new InternalServerError('Erro ao criar o acesso ao workspace');
    }

    const userName = firstName(name);
    const client = process.env.CLIENT_URL;

    const mail = await sendMail(
      'newUser',
      'no-reply',
      `Bem vindo ao ClinicHUB, ${userName}!`,
      {
        client,
        name,
        email,
        password,
      },
    );

    if (!mail.data?.id) {
      throw new InternalServerError('Erro ao enviar e-mail de boas vindas');
    }

    return {
      id: user.id,
    };
  } catch (error) {
    console.log('create');
    if (error instanceof HttpError) {
      throw error;
    }

    throw new InternalServerError('Erro ao criar o usuário!');
  }
}
