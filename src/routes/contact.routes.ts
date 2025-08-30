import Router from 'express';
import ContactController from '@controllers/ContactController';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';

const ContactRoutes = Router();
ContactRoutes.post('/', ContactController.create);
ContactRoutes.put('/', ensureAuthenticated, ContactController.update);
ContactRoutes.get('/', ensureAuthenticated, ContactController.find);

export default ContactRoutes;
