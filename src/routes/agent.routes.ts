import Router from 'express';
import AgentController from '@controllers/AgentController';

const AgentRoutes = Router();
AgentRoutes.post('/', AgentController.create);
AgentRoutes.put('/:id', AgentController.update);
AgentRoutes.get('/', AgentController.find);
AgentRoutes.get('/:id', AgentController.findById);

export default AgentRoutes;
