/**
 * Pruebas unitarias para la utilidad cn (className merger)
 * Verifica la correcta fusión de clases de Tailwind CSS
 */
import { cn } from '@/lib/utils';

describe('cn - utilidad de clases CSS', () => {
  test('debe combinar múltiples clases correctamente', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  test('debe resolver conflictos de clases Tailwind', () => {
    // tailwind-merge debe resolver conflictos, la última clase toma precedencia
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  test('debe manejar valores condicionales (clsx)', () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class'
    );
    expect(result).toBe('base-class active-class');
  });

  test('debe manejar strings vacíos y undefined', () => {
    const result = cn('clase1', '', undefined, null, 'clase2');
    expect(result).toBe('clase1 clase2');
  });
});
