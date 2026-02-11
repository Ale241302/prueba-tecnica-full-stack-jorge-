// Página de reportes financieros (solo administradores)
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
} from 'lucide-react';
import Head from 'next/head';

interface ReportData {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  totalTransactions: number;
  monthlyData: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
}

export default function ReportsPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<ReportData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const fetchReport = useCallback(async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const reportData = await res.json();
        setData(reportData);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos del reporte.',
        variant: 'destructive',
      });
    } finally {
      setLoadingData(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (!loading && !isAdmin) {
      router.push('/');
      return;
    }
    if (user && isAdmin) fetchReport();
  }, [user, loading, isAdmin, router, fetchReport]);

  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/reports/csv');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `reporte_movimientos_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast({
          title: '¡Éxito!',
          description: 'Reporte descargado correctamente.',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Error al descargar el reporte.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading || !user || !isAdmin) return null;

  // Formatear datos del gráfico con nombres de meses en español
  const monthNames: Record<string, string> = {
    '01': 'Ene',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Abr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Ago',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dic',
  };

  const chartData =
    data?.monthlyData.map((d) => {
      const [year, month] = d.month.split('-');
      return {
        name: `${monthNames[month]} ${year}`,
        Ingresos: d.income,
        Egresos: d.expense,
      };
    }) || [];

  return (
    <>
      <Head>
        <title>Reportes - FinanceApp</title>
        <meta name='description' content='Reportes financieros y analíticas' />
      </Head>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>Reportes</h1>
            <p className='text-sm text-slate-500 dark:text-slate-400'>
              Visualiza las estadísticas financieras del sistema
            </p>
          </div>
          <Button
            onClick={handleDownloadCSV}
            disabled={downloading}
            className='bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25'
          >
            <Download className='mr-2 h-4 w-4' />
            {downloading ? 'Descargando...' : 'Descargar CSV'}
          </Button>
        </div>

        {loadingData ? (
          <div className='flex items-center justify-center py-20'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
          </div>
        ) : data ? (
          <>
            {/* Tarjetas de resumen */}
            <div className='mb-6 grid gap-4 md:grid-cols-4'>
              <Card className='border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-teal-50'>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium text-emerald-700'>
                    Total Ingresos
                  </CardTitle>
                  <TrendingUp className='h-5 w-5 text-emerald-600' />
                </CardHeader>
                <CardContent>
                  <p className='text-2xl font-bold text-emerald-800'>
                    $
                    {data.totalIncome.toLocaleString('es-CO', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className='border-red-200/50 bg-gradient-to-br from-red-50 to-rose-50'>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium text-red-700'>
                    Total Egresos
                  </CardTitle>
                  <TrendingDown className='h-5 w-5 text-red-600' />
                </CardHeader>
                <CardContent>
                  <p className='text-2xl font-bold text-red-800'>
                    $
                    {data.totalExpense.toLocaleString('es-CO', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`border-blue-200/50 ${data.balance >= 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-orange-50 to-amber-50'}`}
              >
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium text-blue-700'>
                    Saldo Actual
                  </CardTitle>
                  <DollarSign className='h-5 w-5 text-blue-600' />
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-2xl font-bold ${data.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}
                  >
                    $
                    {data.balance.toLocaleString('es-CO', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card className='border-violet-200/50 bg-gradient-to-br from-violet-50 to-purple-50'>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium text-violet-700'>
                    Total Movimientos
                  </CardTitle>
                  <Activity className='h-5 w-5 text-violet-600' />
                </CardHeader>
                <CardContent>
                  <p className='text-2xl font-bold text-violet-800'>
                    {data.totalTransactions}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de barras */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg text-slate-800 dark:text-white'>
                  Movimientos por Mes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className='py-12 text-center'>
                    <Activity className='mx-auto h-12 w-12 text-slate-300' />
                    <p className='mt-4 text-slate-500'>
                      No hay datos suficientes para mostrar el gráfico.
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width='100%' height={400}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
                      <XAxis
                        dataKey='name'
                        tick={{ fontSize: 12, fill: '#64748b' }}
                      />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any) => [
                          `$${value.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey='Ingresos'
                        fill='#10b981'
                        radius={[6, 6, 0, 0]}
                        maxBarSize={50}
                      />
                      <Bar
                        dataKey='Egresos'
                        fill='#ef4444'
                        radius={[6, 6, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </>
  );
}
