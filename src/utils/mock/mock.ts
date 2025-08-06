import User from '@entities/User';
import bcrypt from 'bcryptjs';
import { users } from './dataMock';
import Workspace from '@entities/Workspace';
import Access from '@entities/Access';

const mocks = async (): Promise<void> => {
  try {
    const [hasUsers] = await Promise.all([User.count()]);

    if (hasUsers > 0) {
      console.log('Mocks ok');
      return;
    }


    for (const user of users) {
      const password_hash = await bcrypt.hash(user.password_hash, 10);
      const createdUser = await User.create({
        name: user.name,
        cpf: user.cpf,
        email: user.email,
        password_hash,
      }).save();
      console.log(`👤 Usuário "${createdUser.name}" criado com sucesso`);

      const workspace = await Workspace.create({
        name: user.workspaceName || "VALOR PADRÃO",
        type: user.workspaceType,
        cnpj: user.cnpj,
      }).save();
      console.log(`👤 Workspace "${workspace.name}" criado com sucesso`);

      const access = await Access.create({
        user: createdUser,
        workspace: workspace
      }).save()
      console.log(`👤 Access "${access.role}" criado com sucesso`);
    }

  } catch (error) {
    console.log('Erro ao rodar mocks!', error);
  }
};

export default mocks;
