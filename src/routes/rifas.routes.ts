import { Router } from 'express';
// O prisma não precisa ser importado aqui, pois o controlador já cuida dele!
import { RifaController } from '../controllers/RifaController.js';

const rifasRouter = Router();
const rifaController = new RifaController();

// 1. Listar todas as rifas ativas (Passo 1)
rifasRouter.get('/', rifaController.index);

// 2. Rota para criar uma rifa
rifasRouter.post('/', rifaController.criar);

// 3. Comprar um bilhete
rifasRouter.post('/comprar', rifaController.comprar);

// 4. Verificar status do pagamento (via ID do bilhete)
rifasRouter.get('/status/:id', rifaController.status);

export { rifasRouter };