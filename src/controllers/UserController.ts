import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

export class UserController {
    // Listar todos os usuários
    async index(req: Request, res: Response) {
        try {
            // Alterado de .users para .usuarios
            const usuarios = await prisma.usuarios.findMany();
            return res.json(usuarios);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
    }

    // Criar um novo usuário
    async criar(req: Request, res: Response) {
        const { nome, email, telefone, senha } = req.body;
        
        try {
            const usuarioExiste = await prisma.usuarios.findUnique({
                where: { email }
            });

            if (usuarioExiste) {
                return res.status(400).json({ error: "Este email já está em uso." });
            }

            // Criando com os campos corretos da sua tabela
            const novoUsuario = await prisma.usuarios.create({
                data: {
                    nome,
                    email,
                    telefone,
                    senha_hash: senha || "123456" // Temporário, até fazermos a criptografia de senhas
                }
            });
            
            return res.status(201).json(novoUsuario);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao criar usuário", details: error });
        }
    }
}