import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const usersRouter = Router();
const userController = new UserController();

usersRouter.get('/', userController.index);
usersRouter.post('/', userController.criar);

export { usersRouter };