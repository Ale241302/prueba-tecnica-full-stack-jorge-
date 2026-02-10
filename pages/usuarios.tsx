// Página de gestión de usuarios (solo administradores)
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Users, Shield, ShieldCheck } from 'lucide-react';
import Head from 'next/head';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  image: string | null;
  createdAt: string;
}

export default function UsersPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', role: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios.',
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
    if (user && isAdmin) fetchUsers();
  }, [user, loading, isAdmin, router, fetchUsers]);

  const handleEdit = (u: User) => {
    setEditUser(u);
    setEditForm({ name: u.name, role: u.role });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        toast({
          title: '¡Éxito!',
          description: 'Usuario actualizado correctamente.',
        });
        setEditUser(null);
        fetchUsers();
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
        description: 'Error al actualizar el usuario.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user || !isAdmin) return null;

  return (
    <>
      <Head>
        <title>Usuarios - FinanceApp</title>
        <meta name='description' content='Gestión de usuarios del sistema' />
      </Head>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-slate-800'>Usuarios</h1>
          <p className='text-sm text-slate-500'>
            Gestiona los usuarios del sistema y sus roles
          </p>
        </div>

        <Card>
          <CardContent className='p-0'>
            {loadingData ? (
              <div className='flex items-center justify-center py-12'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
              </div>
            ) : users.length === 0 ? (
              <div className='py-12 text-center'>
                <Users className='mx-auto h-12 w-12 text-slate-300' />
                <p className='mt-4 text-slate-500'>
                  No hay usuarios registrados.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className='bg-slate-50/80'>
                    <TableHead className='font-semibold'>Usuario</TableHead>
                    <TableHead className='font-semibold'>Correo</TableHead>
                    <TableHead className='font-semibold'>Teléfono</TableHead>
                    <TableHead className='font-semibold'>Rol</TableHead>
                    <TableHead className='font-semibold text-right'>
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} className='hover:bg-slate-50/50'>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-9 w-9 border border-slate-200'>
                            <AvatarImage src={u.image || ''} alt={u.name} />
                            <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold'>
                              {u.name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className='font-medium text-slate-800'>
                            {u.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='text-slate-600'>
                        {u.email}
                      </TableCell>
                      <TableCell className='text-slate-600'>
                        {u.phone || <span className='text-slate-400'>—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={u.role === 'ADMIN' ? 'default' : 'secondary'}
                          className={
                            u.role === 'ADMIN'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                              : ''
                          }
                        >
                          {u.role === 'ADMIN' ? (
                            <ShieldCheck className='mr-1 h-3 w-3' />
                          ) : (
                            <Shield className='mr-1 h-3 w-3' />
                          )}
                          {u.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleEdit(u)}
                          className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        >
                          <Pencil className='mr-1.5 h-4 w-4' />
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Diálogo de edición */}
        <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifica el nombre y rol del usuario.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} id='edit-user-form'>
              <div className='grid gap-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='edit-name'>Nombre</Label>
                  <Input
                    id='edit-name'
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='edit-role'>Rol</Label>
                  <Select
                    value={editForm.role}
                    onValueChange={(val) =>
                      setEditForm({ ...editForm, role: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar rol' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='ADMIN'>
                        <span className='flex items-center gap-2'>
                          <ShieldCheck className='h-4 w-4 text-blue-600' />
                          Administrador
                        </span>
                      </SelectItem>
                      <SelectItem value='USER'>
                        <span className='flex items-center gap-2'>
                          <Shield className='h-4 w-4 text-slate-600' />
                          Usuario
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type='submit' disabled={submitting}>
                  {submitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
