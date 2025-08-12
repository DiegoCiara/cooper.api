import { Request, Response } from 'express';
import { HttpError } from '../../utils/http/errors/http-errors';
import { listPlans } from '../services/app/billing/stripe/products/list-plans';
import { findProduct } from '../services/app/billing/findProduct';
import { findSubscriptionService } from '../services/app/billing/stripe/subscriptions/find-subscription';
import { listPaymentMethods } from '../services/app/billing/stripe/customer/list-payment-methods';
import {
  createPaymentIntent,
  setPaymentMethodAsDefault,
} from '../services/app/billing/stripe/customer/create-payment-method';
import { updateSubscription } from '../services/app/billing/stripe/subscriptions/update-subscription';

class BillingController {
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
      console.log(data)
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

      const subscription = await findSubscriptionService(agent_id);

      res.status(200).json(subscription);
    } catch (error) {
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }
  public async listPaymentsMethods(req: Request, res: Response): Promise<void> {
    try {

      const subscription = await listPaymentMethods(req.userId);

      res.status(200).json(subscription);
    } catch (error) {
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async createPaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      const customer = await listPaymentMethods(userId);

      const { data }: any = customer;

      res.status(200).json(data);
    } catch (error) {
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async setPaymentAsDefault(req: Request, res: Response): Promise<void> {
    try {
      const { payment_method } = req.body;

      const userId = req.userId;

      const customer = await setPaymentMethodAsDefault(userId, payment_method);

      const { data }: any = customer;

      res.status(200).json(data);
    } catch (error) {
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async createPaymentIntent(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      const intent = await createPaymentIntent(userId);

      res.status(200).json(intent);
    } catch (error) {
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async upgradePlan(req: Request, res: Response): Promise<void> {
    try {
      const { agent_id } = req.params;
      const { planId, paymentMethodId } = req.body;

      const customer = await updateSubscription(
        agent_id,
        planId,
        paymentMethodId,
      );

      res.status(200).json(customer);
    } catch (error) {
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }
}

export default new BillingController();
