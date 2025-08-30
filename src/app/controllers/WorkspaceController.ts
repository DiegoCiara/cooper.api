import { Request, Response } from 'express';
import { HttpError } from '../../utils/http/errors/http-errors';
import findAgents from '../services/app/workspace/find';
import findByIdService from '../services/app/workspace/find-by-id';
import updateAgentService from '../services/app/workspace/update';
import connectAgent from '../services/app/workspace/connect';
import findConnection from '../services/app/workspace/find-connection';
import createWorkspaceService from '../services/app/workspace/create';
import { access } from 'fs';
import signWorkspaceService from '../services/app/workspace/sign';

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
  public async signWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const credentials = await signWorkspaceService(req.body.id);
      res.status(200).json(credentials);
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

      const { workspace, price_id, payment_method_id } = body;
      const access = await createWorkspaceService({
        user_id: req.userId,
        workspace,
        price_id,
        payment_method_id,
      });

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

  public async connect(req: Request, res: Response): Promise<void> {
    try {
      const qr_code = await connectAgent(req.workspaceId);
      res.status(200).send({ qr_code });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async connectionStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = await findConnection(req.workspaceId);
      res.status(200).send({ status });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }
}

export default new AgentController();
