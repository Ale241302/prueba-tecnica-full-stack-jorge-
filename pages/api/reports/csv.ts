// API: Descargar reporte en formato CSV
import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';

/**
 * @swagger
 * /api/reports/csv:
 *   get:
 *     summary: Descargar reporte en CSV
 *     description: Genera y descarga un archivo CSV con todos los movimientos financieros. Solo administradores.
 *     tags: [Reportes]
 *     security:
 *       - sessionAuth: []
 *     produces:
 *       - text/csv
 *     responses:
 *       200:
 *         description: Archivo CSV con movimientos
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
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
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { date: 'desc' },
  });

  // Construir CSV
  const headers = [
    'ID',
    'Concepto',
    'Monto',
    'Tipo',
    'Fecha',
    'Usuario',
    'Email',
  ];
  const rows = transactions.map((t) => [
    t.id,
    `"${t.concept.replace(/"/g, '""')}"`,
    t.amount.toString(),
    t.type,
    t.date.toISOString().split('T')[0],
    `"${t.user.name.replace(/"/g, '""')}"`,
    t.user.email,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=reporte_movimientos_${new Date().toISOString().split('T')[0]}.csv`
  );
  return res.status(200).send(csv);
};

export default withAuth(handler, 'ADMIN');
