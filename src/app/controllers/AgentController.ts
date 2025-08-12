import { Request, Response } from 'express';
import Users from '@entities/User';
import emailValidator from '@utils/emailValidator';
import createAccountService from '../services/app/account/create';
import { HttpError } from '../../utils/http/errors/http-errors';
import updateUserService from '../services/app/account/update';
import findAccount from '../services/app/account/find';
import createAgentService from '../services/app/agent/create';


class AccountController {
  public async find(req: Request, res: Response): Promise<void> {
    try {
      const user = await findAccount(req.userId);

      res.status(200).json({
        message: 'Success!',
        user,
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
      const body = req.body;

      const { agent, price_id, payment_method_id } = body;
      const user = await createAgentService({ user_id: req.userId, agent, price_id, payment_method_id});

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
