/**
 * Pruebas unitarias para el API de transacciones
 * Verifica validaciones de datos y métodos HTTP
 */
import type { NextApiRequest, NextApiResponse } from 'next';

// Mock de Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    transaction: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock del middleware de autenticación
jest.mock('@/lib/auth/middleware', () => ({
  withAuth: (handler: Function) => handler,
}));

import { prisma } from '@/lib/prisma';

describe('API de Transacciones - validaciones', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      method: 'POST',
      body: {},
      user: {
        id: 'user-1',
        name: 'Test',
        email: 'test@test.com',
        role: 'ADMIN',
      },
    } as any;

    mockRes = {
      status: statusMock,
    };
  });

  test('debe rechazar POST sin campos requeridos', async () => {
    // Importar handler dinámicamente para que los mocks ya estén activos
    const handler = require('@/pages/api/transactions/index').default;

    mockReq.body = { concept: 'Test' }; // falta amount, date, type

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  test('debe rechazar tipo de movimiento inválido', async () => {
    const handler = require('@/pages/api/transactions/index').default;

    mockReq.body = {
      concept: 'Test',
      amount: 100,
      date: '2024-01-01',
      type: 'INVALIDO',
    };

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(400);
  });

  test('debe retornar 405 para métodos no permitidos', async () => {
    const handler = require('@/pages/api/transactions/index').default;

    mockReq.method = 'DELETE';

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(405);
  });

  test('GET debe retornar lista de transacciones', async () => {
    const handler = require('@/pages/api/transactions/index').default;

    const mockTransactions = [
      {
        id: '1',
        concept: 'Ingreso test',
        amount: 1000,
        date: new Date(),
        type: 'INGRESO',
        user: { id: 'u1', name: 'Test', email: 'test@test.com' },
      },
    ];

    (prisma.transaction.findMany as jest.Mock).mockResolvedValue(
      mockTransactions
    );
    mockReq.method = 'GET';

    await handler(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockTransactions);
  });
});
