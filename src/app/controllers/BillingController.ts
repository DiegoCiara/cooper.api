import { Request, Response } from 'express';
import { HttpError } from '../../utils/http/errors/http-errors';
import { listPlans } from '../services/app/billing/stripe/products/list-plans';
import { findProduct } from '../services/app/billing/findProduct';
import Agent from '@entities/Agent';
import { listSubscription } from '../services/app/billing/stripe/subscriptions/list-subscription';

class AIController {
  public async findPlans(req: Request, res: Response): Promise<void> {
    try {
      const data = await listPlans();

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async findPlan(req: Request, res: Response): Promise<void> {
    try {
      const { price_id } = req.params;
      const data = await findProduct(price_id);
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async findSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { agent_id } = req.params;

      const agent = await Agent.findOne(agent_id);

      if (!agent) {
        res.status(404).json({ message: 'Workspace não encontrado' });
        return;
      }
      const subscription = await listSubscription(agent.subscription_id);

      res.status(200).json(subscription);
    } catch (error) {
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }
}

export default new AIController();
