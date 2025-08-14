import Router from 'express';
import AgentController from '@controllers/AgentController';

const AgentRoutes = Router();
AgentRoutes.post('/', AgentController.create);
AgentRoutes.put('/:id', AgentController.update);
AgentRoutes.get('/', AgentController.find);
AgentRoutes.get('/:id', AgentController.findById);
AgentRoutes.get('/connect/:id', AgentController.connect);
AgentRoutes.get('/check-connection/:id', AgentController.connectionStatus);

export default AgentRoutes;
