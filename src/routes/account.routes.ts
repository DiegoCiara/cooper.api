import Router from 'express';
import AccountController from '@controllers/AccountController';

const AccountRoutes = Router();
AccountRoutes.post('/', AccountController.create);
AccountRoutes.put('/', AccountController.update);
AccountRoutes.get('/', AccountController.find);
AccountRoutes.get('/validate/', AccountController.validateAccount);

export default AccountRoutes;
