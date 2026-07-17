import { Router } from 'express';
import { prisma } from '../prisma.js'; 
import { rifasRouter } from './rifas.routes.js'; 
import { usersRouter } from './users.routes.js';
import { compraRouter } from './compra.routes.js';

const router = Router();

// Rota de teste do banco de dados
router.get('/testar-banco', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; 
    return res.json({ message: "Conexão com o banco de dados realizada com sucesso!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao conectar no banco", details: error });
  }
});

// Suas rotas principais sendo distribuídas
router.use('/rifas', rifasRouter);
router.use('/usuarios', usersRouter);
router.use('/compras', compraRouter);

export { router };