import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

export class CompraController {
  async comprarBilhete(req: Request, res: Response) {
    try {
      const { rifaId, usuarioId, numero } = req.body;

      // 1. Busca a rifa pelo UUID verdadeiro
      const rifa = await prisma.rifas.findUnique({
        where: { id: String(rifaId) }
      });

      if (!rifa) {
        return res.status(404).json({ error: "Rifa não encontrada." });
      }

      let numeroParaComprar: number;

      // ============================================================
      // LÓGICA 1: MANUAL (Verifica se o número já foi criado/vendido)
      // ============================================================
      if (numero) {
        const bilheteJaExiste = await prisma.bilhetes.findFirst({
          where: {
            rifa_id: String(rifaId),
            numero: Number(numero)
          }
        });

        if (bilheteJaExiste) {
          return res.status(400).json({ error: "Este número já foi vendido ou reservado." });
        }
        
        // Se não existe, esse é o número que vamos registrar!
        numeroParaComprar = Number(numero);
      } 
      // ============================================================
      // LÓGICA 2: AUTOMÁTICA (Procura o primeiro número livre)
      // ============================================================
      else {
        // Pega todos os números que já foram vendidos dessa rifa
        const bilhetesVendidos = await prisma.bilhetes.findMany({
          where: { rifa_id: String(rifaId) },
          select: { numero: true }
        });

        const numerosOcupados = bilhetesVendidos.map(b => b.numero);
        let proximoLivre = null;

        // Roda de 1 até o total da rifa procurando um buraco livre
        for (let i = 1; i <= rifa.quantidade_numeros; i++) {
          if (!numerosOcupados.includes(i)) {
            proximoLivre = i;
            break;
          }
        }

        if (!proximoLivre) {
          return res.status(400).json({ error: "Não há mais bilhetes disponíveis nesta rifa!" });
        }
        numeroParaComprar = proximoLivre;
      }

      // 3. Cria o bilhete novo associado ao usuário
      const novoBilhete = await prisma.bilhetes.create({
        data: {
          rifa_id: String(rifaId),
          comprador_id: usuarioId ? String(usuarioId) : null,
          numero: numeroParaComprar,
          status_pagamento: "pendente" // Status original do seu banco
        }
      });

      return res.status(201).json({
        message: "Bilhete reservado com sucesso!",
        bilhete: novoBilhete
      });

    } catch (error) {
      console.error(error); // Mostra o erro no terminal para ajudar a debugar
      return res.status(500).json({ error: "Erro ao processar a compra.", details: error });
    }
  }
}