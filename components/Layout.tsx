// Layout principal de la aplicación con sidebar de navegación
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  BarChart3,
  LogOut,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    label: 'Inicio',
    href: '/',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'USER'],
  },
  {
    label: 'Movimientos',
    href: '/movimientos',
    icon: ArrowLeftRight,
    roles: ['ADMIN', 'USER'],
  },
  {
    label: 'Usuarios',
    href: '/usuarios',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    label: 'Reportes',
    href: '/reportes',
    icon: BarChart3,
    roles: ['ADMIN'],
  },
  {
    label: 'API Docs',
    href: '/api/docs',
    icon: FileText,
    roles: ['ADMIN'],
  },
];

export const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { user, isAdmin, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <div className='flex flex-col items-center gap-4'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent' />
          <p className='text-lg text-slate-300'>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(isAdmin ? 'ADMIN' : 'USER')
  );

  return (
    <div className='flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50'>
      {/* Sidebar */}
      <aside className='flex w-72 flex-col border-r border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-xl'>
        {/* Logo */}
        <div className='flex items-center gap-3 px-6 py-6'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/30'>
            <BarChart3 className='h-5 w-5 text-white' />
          </div>
          <div>
            <h1 className='text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent'>
              FinanceApp
            </h1>
            <p className='text-xs text-slate-500'>Gestión Financiera</p>
          </div>
        </div>

        <Separator className='mx-4' />

        {/* Navegación */}
        <nav className='flex-1 px-3 py-4 space-y-1'>
          {filteredNavItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`}
                  />
                  {item.label}
                  {isActive && (
                    <ChevronRight className='ml-auto h-4 w-4 text-white/70' />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        <Separator className='mx-4' />

        {/* Usuario actual */}
        <div className='p-4'>
          <div className='flex items-center gap-3 rounded-xl bg-slate-50 p-3'>
            <Avatar className='h-10 w-10 border-2 border-white shadow-md'>
              <AvatarImage src={user.image || ''} alt={user.name} />
              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold'>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold text-slate-800 truncate'>
                {user.name}
              </p>
              <Badge
                variant={isAdmin ? 'default' : 'secondary'}
                className={`text-[10px] px-1.5 py-0 ${isAdmin ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''}`}
              >
                {user.role}
              </Badge>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={logout}
              className='h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50'
              title='Cerrar sesión'
            >
              <LogOut className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className='flex-1 overflow-auto'>
        <div className='p-8'>{children}</div>
      </main>
    </div>
  );
};
