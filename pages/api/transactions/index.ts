// API: Listar y crear movimientos (ingresos/egresos)
import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Obtener lista de movimientos
 *     description: Retorna todos los movimientos financieros ordenados por fecha descendente.
 *     tags: [Movimientos]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: No autenticado
 *   post:
 *     summary: Crear un nuevo movimiento
 *     description: Crea un nuevo ingreso o egreso. Solo administradores.
 *     tags: [Movimientos]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [concept, amount, date, type]
 *             properties:
 *               concept:
 *                 type: string
 *                 example: "Pago de nómina"
 *               amount:
 *                 type: number
 *                 example: 5000.00
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               type:
 *                 type: string
 *                 enum: [INGRESO, EGRESO]
 *                 example: "INGRESO"
 *     responses:
 *       201:
 *         description: Movimiento creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Sin permisos
 */
const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { date: 'desc' },
    });
    return res.status(200).json(transactions);
  }

  if (req.method === 'POST') {
    // Solo administradores pueden crear movimientos
    if (req.user.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ error: 'Solo los administradores pueden crear movimientos.' });
    }

    const { concept, amount, date, type } = req.body;

    if (!concept || !amount || !date || !type) {
      return res.status(400).json({
        error: 'Todos los campos son requeridos: concept, amount, date, type.',
      });
    }

    if (!['INGRESO', 'EGRESO'].includes(type)) {
      return res.status(400).json({
        error: 'El tipo debe ser "INGRESO" o "EGRESO".',
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'El monto debe ser un número positivo.',
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        concept,
        amount,
        date: new Date(date),
        type,
        userId: req.user.id,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(201).json(transaction);
  }

  return res.status(405).json({ error: 'Método no permitido.' });
};

export default withAuth(handler);
