import AIController from '@controllers/AiController';
import Router from 'express';

const AiRoutes = Router();
AiRoutes.post('/generate', AIController.generate);

export default AiRoutes;
