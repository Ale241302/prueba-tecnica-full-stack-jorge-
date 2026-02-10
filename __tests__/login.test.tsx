/**
 * Pruebas unitarias para la página de login
 * Verifica el renderizado correcto del componente de inicio de sesión
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock de useRouter
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/login',
  }),
}));

// Mock de next/head
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

// Mock del contexto de autenticación
jest.mock('@/lib/auth/context', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAdmin: false,
    login: jest.fn(),
    logout: jest.fn(),
    refreshUser: jest.fn(),
  }),
}));

import LoginPage from '@/pages/login';

describe('Página de Login', () => {
  test('debe mostrar el nombre de la aplicación', () => {
    render(<LoginPage />);
    expect(screen.getByText('FinanceApp')).toBeInTheDocument();
  });

  test('debe mostrar el botón de GitHub', () => {
    render(<LoginPage />);
    expect(screen.getByText('Iniciar sesión con GitHub')).toBeInTheDocument();
  });

  test('debe mostrar la descripción del sistema', () => {
    render(<LoginPage />);
    expect(
      screen.getByText('Sistema de Gestión de Ingresos y Egresos')
    ).toBeInTheDocument();
  });
});
