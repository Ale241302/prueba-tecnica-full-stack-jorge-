// API: Datos para reportes financieros
import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Obtener datos de reportes
 *     description: Retorna el resumen financiero incluyendo saldo actual, total de ingresos, total de egresos y movimientos agrupados por mes. Solo administradores.
 *     tags: [Reportes]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Datos del reporte financiero
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   example: 15000.00
 *                 totalIncome:
 *                   type: number
 *                   example: 25000.00
 *                 totalExpense:
 *                   type: number
 *                   example: 10000.00
 *                 monthlyData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2024-01"
 *                       income:
 *                         type: number
 *                       expense:
 *                         type: number
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */
const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: { date: 'asc' },
  });

  let totalIncome = 0;
  let totalExpense = 0;
  const monthlyMap: Record<string, { income: number; expense: number }> = {};

  for (const t of transactions) {
    const monthKey = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { income: 0, expense: 0 };
    }

    if (t.type === 'INGRESO') {
      totalIncome += t.amount;
      monthlyMap[monthKey].income += t.amount;
    } else {
      totalExpense += t.amount;
      monthlyMap[monthKey].expense += t.amount;
    }
  }

  const monthlyData = Object.entries(monthlyMap)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return res.status(200).json({
    balance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
    monthlyData,
    totalTransactions: transactions.length,
  });
};

export default withAuth(handler, 'ADMIN');
