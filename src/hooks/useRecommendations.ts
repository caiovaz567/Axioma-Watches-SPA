import { useMemo } from 'react';
import { useSheetData } from './useSheetData';

export interface Watch {
  brand: string;
  model: string;
  description: string;
  descriptionEn?: string;
  storeUrl: string;
  gradient: string;
  imageUrl?: string;
  coupon?: string;
}

const GRADIENTS = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #203040 100%)',
  'linear-gradient(135deg, #1c0a00 0%, #3b1500 50%, #6b2d0a 100%)',
  'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)',
  'linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #1a2540 100%)',
  'linear-gradient(135deg, #0d1f1f 0%, #0a2e2e 50%, #0f3d3d 100%)',
  'linear-gradient(135deg, #1a0a2e 0%, #2d1060 50%, #1a0a2e 100%)',
  'linear-gradient(135deg, #1a1000 0%, #3d2800 50%, #5a3a00 100%)',
  'linear-gradient(135deg, #0a1a0a 0%, #102e10 50%, #1a3d1a 100%)',
  'linear-gradient(135deg, #1a0a0a 0%, #3d1010 50%, #5a1a1a 100%)',
];

export function useRecommendations() {
  const { data, loading } = useSheetData('recomendacoes');

  // Sem lista reserva: se a planilha falhar, watches fica vazio e a seção
  // mostra uma mensagem de indisponibilidade (nunca conteúdo desatualizado).
  const watches = useMemo<Watch[]>(() => {
    const rows = data.slice(1);
    return rows
      .filter((r) => r[0] && r[1])
      .map((r, i) => ({
        brand: r[0] ?? '',
        model: r[1] ?? '',
        description: r[2] ?? '',
        storeUrl: r[3] ?? '',
        gradient: GRADIENTS[i % GRADIENTS.length],
        imageUrl: r[4] || undefined,
        coupon: r[5] || undefined,
        descriptionEn: r[6] || undefined,
      }));
  }, [data]);

  return { watches, loading };
}
