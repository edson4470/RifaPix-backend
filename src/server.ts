import express from 'express';
import cors from 'cors'; // 1. Importe o cors
import { router } from './routes/index.js';

const app = express();

app.use(cors()); // 2. Ative o cors aqui
app.use(express.json());
app.use(router); 

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ativo em http://localhost:${PORT}`);
});