import { Request, Response } from 'express';
import Users from '@entities/User';
import emailValidator from '@utils/emailValidator';
import createAccountService from '../services/app/account/create';
import validateAccountService from '../services/app/account/validate';
import { HttpError } from '../../utils/http/errors/http-errors';
import updateUserService from '../services/app/account/update';
import findAccount from '../services/app/account/find';

interface AccountInterface {
  id?: string;
  name: string;
  cpf: string;
  email: string;
  regional_council_number?: string;
  picture?: string;
  token: string;
  password: string;
  secret?: string;
}

interface CreateAccountBody {
  workspace_type: 'PERSONAL' | 'BUSINESS';
  email: string;
  password: string;
  name: string;
  cpf: string;
  crm_number?: string;
  workspace_name?: string;
  cnpj?: string;
}

class AccountController {
  public async find(req: Request, res: Response): Promise<void> {
    try {
      const user = await findAccount(req.userId);

      res.status(200).json({
        message: 'Success!',
        user });
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async validateAccount(req: Request, res: Response): Promise<void> {
    try {
      const field = req.query.field as 'id' | 'email' | 'cpf';
      const value = req.query.value as string;

      const has_user = await validateAccountService({
        field,
        value,
      });

      res.status(200).json({
        message: 'Success!',
        has_user,
      });
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as CreateAccountBody;

      const user = await createAccountService(body);

      res.status(201).json({
        message: 'Conta criada com sucesso!',
        id: user.id,
      });
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      await updateUserService(req.userId, req.body);
      res.status(204).send({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }
}

export default new AccountController();
