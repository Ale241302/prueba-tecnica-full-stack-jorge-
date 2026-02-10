// Middleware de autenticación para API routes
// Valida la sesión y retorna el usuario autenticado
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

type ApiHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void>;

/**
 * Middleware que protege las rutas de API verificando la sesión del usuario.
 * Rechaza conexiones no autenticadas con un 401.
 * Opcionalmente verifica el rol del usuario.
 */
export const withAuth =
  (handler: ApiHandler, requiredRole?: string) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        return res
          .status(401)
          .json({ error: 'No autenticado. Inicie sesión para continuar.' });
      }

      if (
        requiredRole &&
        (session.user as Record<string, unknown>).role !== requiredRole
      ) {
        return res.status(403).json({
          error: 'No tiene permisos suficientes para realizar esta acción.',
        });
      }

      (req as AuthenticatedRequest).user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as Record<string, unknown>).role as string,
      };

      return handler(req as AuthenticatedRequest, res);
    } catch {
      return res.status(401).json({ error: 'Error de autenticación.' });
    }
  };
