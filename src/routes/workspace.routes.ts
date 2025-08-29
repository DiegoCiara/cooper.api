import Router from 'express';
import WorkspaceController from '@controllers/WorkspaceController';
import { ensureWorkspace } from '@middlewares/ensureWorkspace';

const WorkspaceRoutes = Router();
WorkspaceRoutes.post('/', WorkspaceController.create);
WorkspaceRoutes.post('/sign', WorkspaceController.signWorkspace);
WorkspaceRoutes.get('/accesses', WorkspaceController.find);
WorkspaceRoutes.put('/:id', ensureWorkspace, WorkspaceController.update);
WorkspaceRoutes.get('/', ensureWorkspace, WorkspaceController.findById);
WorkspaceRoutes.get('/connect/:id', ensureWorkspace, WorkspaceController.connect);
WorkspaceRoutes.get('/check-connection/:id', ensureWorkspace, WorkspaceController.connectionStatus);

export default WorkspaceRoutes;
