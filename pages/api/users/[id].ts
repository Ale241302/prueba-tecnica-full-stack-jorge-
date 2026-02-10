// API: Editar usuario por ID
import type { NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { withAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Editar un usuario
 *     description: Actualiza el nombre y/o rol de un usuario. Solo administradores.
 *     tags: [Usuarios]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *                 example: "ADMIN"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Usuario no encontrado
 */
const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID de usuario inválido.' });
  }

  const { name, role } = req.body;

  if (!name && !role) {
    return res.status(400).json({
      error:
        'Debe proporcionar al menos un campo para actualizar (name, role).',
    });
  }

  if (role && !['ADMIN', 'USER'].includes(role)) {
    return res.status(400).json({
      error: 'El rol debe ser "ADMIN" o "USER".',
    });
  }

  // Verificar que el usuario existe
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(role && { role }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      image: true,
    },
  });

  return res.status(200).json(updatedUser);
};

export default withAuth(handler, 'ADMIN');
