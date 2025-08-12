
import BillingController from '@controllers/BillingController';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import Router from 'express';

const routes = Router();
routes.get('/plans', BillingController.findPlans);
routes.get('/plan/:price_id', BillingController.findPlan);
routes.put('/price/', BillingController.upgradePlan);
routes.get('/subscription/', BillingController.findSubscription);
// routes.get('/invoices/', BillingController.listInvoices);
// routes.delete('/payment-methods/:id', BillingController.deletePaymentMethod);
routes.get('/payment-methods/', BillingController.listPaymentsMethods);
routes.get('/payment-intent/', BillingController.createPaymentIntent);
routes.post('/payment-default/', BillingController.setPaymentAsDefault);

export default routes;
