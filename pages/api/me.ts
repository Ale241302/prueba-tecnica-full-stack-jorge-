// API: Obtener sesión del usuario actual
import type { NextApiResponse } from 'next';
import { withAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Obtener usuario actual
 *     description: Retorna los datos de la sesión del usuario autenticado.
 *     tags: [Autenticación]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: No autenticado
 */
const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  return res.status(200).json(req.user);
};

export default withAuth(handler);
