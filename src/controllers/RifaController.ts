import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

export class RifaController {
    // 1. Listar todas as rifas (Aprimorado para listar apenas as ativas)
    async index(req: Request, res: Response) {
        try {
            const rifas = await prisma.rifas.findMany({
                where: { status: 'ativa' }
            });
            return res.status(200).json(rifas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao listar as rifas", details: error });
        }
    }

    // 2. Criar nova rifa 
    async criar(req: Request, res: Response) {
        const { titulo, descricao, preco_bilhete, quantidade_numeros } = req.body;
        
        try {
            const novaRifa = await prisma.rifas.create({
                data: {
                    titulo,
                    descricao,
                    preco_bilhete: Number(preco_bilhete),
                    quantidade_numeros: Number(quantidade_numeros),
                    status: 'ativa'
                }
            });
            return res.status(201).json(novaRifa);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao criar rifa", details: error });
        }
    }

    // 3. Comprar bilhete
    async comprar(req: Request, res: Response) {
        const { rifa_id, comprador_id, numero } = req.body;
        try {
            const bilhete = await prisma.bilhetes.create({
                data: { 
                    rifa_id, 
                    comprador_id, 
                    numero, 
                    status_pagamento: 'pendente' 
                }
            });
            return res.status(201).json(bilhete);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao comprar bilhete", details: error });
        }
    }

    // 4. Status do bilhete
    async status(req: Request, res: Response) {
        const { id } = req.params;
        const bilhete = await prisma.bilhetes.findUnique({ where: { id: String(id) } });
        return res.json(bilhete);
    }
}