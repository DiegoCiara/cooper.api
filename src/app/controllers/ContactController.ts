import { Request, Response } from 'express';
import { HttpError } from '../../utils/http/errors/http-errors';
import findAgents from '../services/app/contact/find';
import findByIdService from '../services/app/contact/find-by-id';
import updateAgentService from '../services/app/contact/update';
import createWorkspaceService from '../services/app/contact/create';
import Contact from '@entities/Contact';
import createContactService from '../services/app/contact/create';

class AgentController {
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
      console.log('CHAMOU O FIND BY ID')
      const agent = await findByIdService(req.workspaceId);

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

      console.log(body);

      const access = await createContactService(req.workspaceId, body);

      res.status(201).json({
        message: 'Agente criado com sucesso!',
        access,
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
      await updateAgentService(req.workspaceId, req.body);
      res.status(200).send({ message: 'Agente atualizado com sucesso' });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }
}

export default new AgentController();
