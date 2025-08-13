import { Request, Response } from 'express';
import { HttpError } from '../../utils/http/errors/http-errors';
import updateUserService from '../services/app/account/update';
import createAgentService from '../services/app/agent/create';
import findAgents from '../services/app/agent/find';
import findByIdService from '../services/app/agent/findById';
import updateAgentService from '../services/app/agent/update';


class AccountController {
  public async find(req: Request, res: Response): Promise<void> {
    try {
      const agents = await findAgents(req.userId);

      res.status(200).json(agents);
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const agent = await findByIdService(id);

      res.status(200).json(agent);
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
        message: 'Agente criado com sucesso!',
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
      const id = req.params.id
      await updateAgentService(id, req.body);
      res.status(200).send({ message: 'Agente atualizado com sucesso' });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }
}

export default new AccountController();
