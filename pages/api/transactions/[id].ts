// API: Editar y eliminar movimientos por ID
import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Editar un movimiento
 *     description: Actualiza los datos de un movimiento existente. Solo administradores.
 *     tags: [Movimientos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del movimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       200:
 *         description: Movimiento actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Movimiento no encontrado
 *   delete:
 *     summary: Eliminar un movimiento
 *     description: Elimina un movimiento existente. Solo administradores.
 *     tags: [Movimientos]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del movimiento
 *     responses:
 *       200:
 *         description: Movimiento eliminado exitosamente
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Movimiento no encontrado
 */
const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'ID de movimiento inválido.' });
    }

    // Solo administradores pueden editar o eliminar
    if (req.user.role !== 'ADMIN') {
        return res
            .status(403)
            .json({ error: 'Solo los administradores pueden modificar movimientos.' });
    }

    if (req.method === 'PUT') {
        const { concept, amount, date, type } = req.body;

        if (!concept && !amount && !date && !type) {
            return res.status(400).json({
                error: 'Debe proporcionar al menos un campo para actualizar.',
            });
        }

        if (type && !['INGRESO', 'EGRESO'].includes(type)) {
            return res.status(400).json({
                error: 'El tipo debe ser "INGRESO" o "EGRESO".',
            });
        }

        if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
            return res.status(400).json({
                error: 'El monto debe ser un número positivo.',
            });
        }

        // Verificar que el movimiento existe
        const existing = await prisma.transaction.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Movimiento no encontrado.' });
        }

        const updatedTransaction = await prisma.transaction.update({
            where: { id },
            data: {
                ...(concept && { concept }),
                ...(amount && { amount }),
                ...(date && { date: new Date(date) }),
                ...(type && { type }),
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        return res.status(200).json(updatedTransaction);
    }

    if (req.method === 'DELETE') {
        // Verificar que el movimiento existe
        const existing = await prisma.transaction.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Movimiento no encontrado.' });
        }

        await prisma.transaction.delete({ where: { id } });

        return res.status(200).json({ message: 'Movimiento eliminado exitosamente.' });
    }

    return res.status(405).json({ error: 'Método no permitido.' });
};

export default withAuth(handler);
