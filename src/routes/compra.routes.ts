import { Router } from 'express';
import { CompraController } from '../controllers/CompraController.js';

const compraRouter = Router();
const compraController = new CompraController();

compraRouter.post('/', compraController.comprarBilhete);

export { compraRouter };