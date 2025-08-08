import Router from 'express';
import AccountController from '@controllers/AccountController';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';

const AccountRoutes = Router();
AccountRoutes.post('/', AccountController.create);
AccountRoutes.put('/', ensureAuthenticated, AccountController.update);
AccountRoutes.get('/', ensureAuthenticated, AccountController.find);

export default AccountRoutes;
