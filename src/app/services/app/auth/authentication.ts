import Access from '@entities/Access';
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

interface WorkspaceAccesses {
  picture: string;
  workspace_id: string;
  type: string;
  name: string;
  role: string;
}

interface Authentication {
  user: User;
  accesses: WorkspaceAccesses[];
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
      relations: ['accesses', 'accesses.workspace'],
    });

    if (!user) {
      throw new NotFound('Usuário não encontrado.');
    }

    if (!(await bcrypt.compare(password, user.password_hash))) {
      throw new Unauthorized('Senha inválida');
    }

    const accesses = user.accesses.map((access) => ({
      picture: access.workspace.picture,
      workspace_id: access.workspace.id,
      type: access.workspace.type,
      name: access.workspace.name,
      role: access.role,
    }));

    return {
      user,
      accesses,
      token: generateToken(user),
    };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new InternalServerError('Erro ao autenticar com a plataforma');
  }
}
