// Página de inicio de sesión
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import Head from 'next/head';

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <>
      <Head>
        <title>Iniciar Sesión - FinanceApp</title>
        <meta
          name='description'
          content='Inicie sesión en el sistema de gestión financiera'
        />
      </Head>
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950'>
        {/* Efecto de fondo */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl' />
          <div className='absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl' />
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl' />
        </div>

        <Card className='relative w-full max-w-md border-slate-700/50 bg-slate-800/80 backdrop-blur-xl shadow-2xl'>
          <CardHeader className='text-center pb-2'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/30'>
              <BarChart3 className='h-8 w-8 text-white' />
            </div>
            <CardTitle className='text-2xl font-bold text-white'>
              FinanceApp
            </CardTitle>
            <CardDescription className='text-slate-400'>
              Sistema de Gestión de Ingresos y Egresos
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-4'>
            <div className='space-y-4'>
              <p className='text-center text-sm text-slate-400'>
                Inicie sesión con su cuenta de GitHub para acceder al sistema.
              </p>
              <Button
                onClick={login}
                className='w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-[1.02]'
                size='lg'
              >
                <svg
                  className='mr-2 h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
                Iniciar sesión con GitHub
              </Button>
            </div>
            <p className='mt-6 text-center text-xs text-slate-500'>
              PrevalentWare · Prueba Técnica Fullstack
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
