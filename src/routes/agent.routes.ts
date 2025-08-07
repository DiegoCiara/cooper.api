import Router from 'express';
import AgentController from '@controllers/AgentController';

const AgentRoutes = Router();
AgentRoutes.post('/', AgentController.create);
AgentRoutes.put('/', AgentController.update);
AgentRoutes.get('/', AgentController.find);

export default AgentRoutes;
