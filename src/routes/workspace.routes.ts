import Router from 'express';
import WorkspaceController from '@controllers/WorkspaceController';

const WorkspaceRoutes = Router();
WorkspaceRoutes.post('/', WorkspaceController.create);
WorkspaceRoutes.put('/:id', WorkspaceController.update);
WorkspaceRoutes.get('/', WorkspaceController.find);
WorkspaceRoutes.get('/:id', WorkspaceController.findById);
WorkspaceRoutes.get('/connect/:id', WorkspaceController.connect);
WorkspaceRoutes.get('/check-connection/:id', WorkspaceController.connectionStatus);

export default WorkspaceRoutes;
