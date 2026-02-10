// Página de inicio - Dashboard principal
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeftRight,
  Users,
  BarChart3,
  ArrowRight,
  Shield,
} from 'lucide-react';
import Head from 'next/head';

const sections = [
  {
    title: 'Gestión de Movimientos',
    description:
      'Administra tus ingresos y egresos. Registra nuevos movimientos y consulta el historial completo.',
    href: '/movimientos',
    icon: ArrowLeftRight,
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/20',
    roles: ['ADMIN', 'USER'],
  },
  {
    title: 'Gestión de Usuarios',
    description:
      'Visualiza y edita la información de los usuarios del sistema. Modifica roles y permisos.',
    href: '/usuarios',
    icon: Users,
    gradient: 'from-violet-500 to-purple-600',
    shadow: 'shadow-violet-500/20',
    roles: ['ADMIN'],
  },
  {
    title: 'Reportes Financieros',
    description:
      'Consulta gráficos de movimientos, saldo actual y descarga reportes en formato CSV.',
    href: '/reportes',
    icon: BarChart3,
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/20',
    roles: ['ADMIN'],
  },
];

export default function HomePage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const visibleSections = sections.filter((s) =>
    s.roles.includes(isAdmin ? 'ADMIN' : 'USER')
  );

  return (
    <>
      <Head>
        <title>Inicio - FinanceApp</title>
        <meta
          name='description'
          content='Panel principal del sistema de gestión financiera'
        />
      </Head>
      <div className='mx-auto max-w-5xl'>
        {/* Encabezado */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-800'>
            ¡Bienvenido, {user.name}!
          </h1>
          <p className='mt-2 text-slate-500'>
            Selecciona una sección para comenzar a gestionar tus finanzas.
          </p>
          <div className='mt-3 flex items-center gap-2'>
            <Shield className='h-4 w-4 text-blue-600' />
            <span className='text-sm font-medium text-blue-600'>
              Rol: {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
            </span>
          </div>
        </div>

        {/* Tarjetas de secciones */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {visibleSections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card
                className={`group cursor-pointer border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-300 hover:shadow-xl ${section.shadow} hover:-translate-y-1`}
              >
                <CardHeader className='pb-3'>
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.gradient} shadow-lg ${section.shadow}`}
                  >
                    <section.icon className='h-6 w-6 text-white' />
                  </div>
                  <CardTitle className='text-lg text-slate-800 group-hover:text-slate-900'>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-sm text-slate-500 leading-relaxed'>
                    {section.description}
                  </CardDescription>
                  <div className='mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700'>
                    Ir a la sección
                    <ArrowRight className='ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1' />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
