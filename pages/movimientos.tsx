// Página de gestión de movimientos (ingresos y egresos)
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from 'lucide-react';
import Head from 'next/head';

interface Transaction {
  id: string;
  concept: string;
  amount: number;
  date: string;
  type: 'INGRESO' | 'EGRESO';
  user: { id: string; name: string; email: string };
}

export default function TransactionsPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    concept: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'INGRESO',
  });

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch('/api/transactions');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los movimientos.',
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
    if (user) fetchTransactions();
  }, [user, loading, router, fetchTransactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: formData.concept,
          amount: parseFloat(formData.amount),
          date: formData.date,
          type: formData.type,
        }),
      });

      if (res.ok) {
        toast({
          title: '¡Éxito!',
          description: 'Movimiento registrado correctamente.',
        });
        setDialogOpen(false);
        setFormData({
          concept: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          type: 'INGRESO',
        });
        fetchTransactions();
      } else {
        const error = await res.json();
        toast({
          title: 'Error',
          description: error.error,
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Error al crear el movimiento.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  // Calcular totales
  const totalIncome = transactions
    .filter((t) => t.type === 'INGRESO')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'EGRESO')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <>
      <Head>
        <title>Movimientos - FinanceApp</title>
        <meta
          name='description'
          content='Gestión de ingresos y egresos financieros'
        />
      </Head>
      <div className='mx-auto max-w-6xl'>
        {/* Encabezado */}
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-800'>Movimientos</h1>
            <p className='text-sm text-slate-500'>
              Gestiona los ingresos y egresos del sistema
            </p>
          </div>
          {isAdmin && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25'>
                  <Plus className='mr-2 h-4 w-4' /> Nuevo Movimiento
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Nuevo Movimiento</DialogTitle>
                  <DialogDescription>
                    Registra un nuevo ingreso o egreso en el sistema.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} id='transaction-form'>
                  <div className='grid gap-4 py-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='concept'>Concepto</Label>
                      <Input
                        id='concept'
                        placeholder='Ej: Pago de nómina'
                        value={formData.concept}
                        onChange={(e) =>
                          setFormData({ ...formData, concept: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='amount'>Monto</Label>
                      <Input
                        id='amount'
                        type='number'
                        placeholder='0.00'
                        min='0.01'
                        step='0.01'
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='date'>Fecha</Label>
                      <Input
                        id='date'
                        type='date'
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='type'>Tipo</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(val) =>
                          setFormData({ ...formData, type: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccionar tipo' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='INGRESO'>
                            <span className='flex items-center gap-2'>
                              <ArrowUpCircle className='h-4 w-4 text-emerald-500' />
                              Ingreso
                            </span>
                          </SelectItem>
                          <SelectItem value='EGRESO'>
                            <span className='flex items-center gap-2'>
                              <ArrowDownCircle className='h-4 w-4 text-red-500' />
                              Egreso
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type='submit' disabled={submitting}>
                      {submitting ? 'Guardando...' : 'Guardar Movimiento'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Resumen rápido */}
        <div className='mb-6 grid gap-4 md:grid-cols-3'>
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
                {totalIncome.toLocaleString('es-CO', {
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
                {totalExpense.toLocaleString('es-CO', {
                  minimumFractionDigits: 2,
                })}
              </p>
            </CardContent>
          </Card>
          <Card
            className={`border-blue-200/50 ${balance >= 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-orange-50 to-amber-50'}`}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-blue-700'>
                Saldo
              </CardTitle>
              <DollarSign className='h-5 w-5 text-blue-600' />
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}
              >
                ${balance.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de movimientos */}
        <Card>
          <CardContent className='p-0'>
            {loadingData ? (
              <div className='flex items-center justify-center py-12'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
              </div>
            ) : transactions.length === 0 ? (
              <div className='py-12 text-center'>
                <ArrowLeftRight className='mx-auto h-12 w-12 text-slate-300' />
                <p className='mt-4 text-slate-500'>
                  No hay movimientos registrados aún.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className='bg-slate-50/80'>
                    <TableHead className='font-semibold'>Concepto</TableHead>
                    <TableHead className='font-semibold'>Monto</TableHead>
                    <TableHead className='font-semibold'>Tipo</TableHead>
                    <TableHead className='font-semibold'>Fecha</TableHead>
                    <TableHead className='font-semibold'>Usuario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id} className='hover:bg-slate-50/50'>
                      <TableCell className='font-medium'>{t.concept}</TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            t.type === 'INGRESO'
                              ? 'text-emerald-600'
                              : 'text-red-600'
                          }`}
                        >
                          {t.type === 'INGRESO' ? '+' : '-'}$
                          {t.amount.toLocaleString('es-CO', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            t.type === 'INGRESO' ? 'default' : 'destructive'
                          }
                          className={
                            t.type === 'INGRESO'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }
                        >
                          {t.type === 'INGRESO' ? (
                            <ArrowUpCircle className='mr-1 h-3 w-3' />
                          ) : (
                            <ArrowDownCircle className='mr-1 h-3 w-3' />
                          )}
                          {t.type}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-slate-600'>
                        {new Date(t.date).toLocaleDateString('es-CO')}
                      </TableCell>
                      <TableCell className='text-slate-600'>
                        {t.user.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
