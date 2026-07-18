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

const FALLBACK: Watch[] = [
  {
    brand: 'Seiko',
    model: 'Turtle SRP777',
    description: 'Um ícone do mergulho com movimento automático 4R36, reserva de marcha de 41h e resistência a 200m.',
    storeUrl: 'https://www.relojoariaimpala.com.br',
    gradient: GRADIENTS[0],
  },
  {
    brand: 'Citizen',
    model: 'Promaster Diver NY0040',
    description: 'Tecnologia Eco-Drive, resistência a 200m e acabamento superlativo. Custo-benefício difícil de superar.',
    storeUrl: 'https://www.relojoariaimpala.com.br',
    gradient: GRADIENTS[1],
  },
  {
    brand: 'Spinnaker',
    model: 'Hull SP-5068-03',
    description: 'Design náutico britânico com movimento automático NH35. Uma das melhores opções na faixa de entrada premium.',
    storeUrl: 'https://www.relojoariaimpala.com.br',
    gradient: GRADIENTS[2],
  },
  {
    brand: 'Orient',
    model: 'Mako II FAA02001B',
    description: 'Automático com hacking e hand-winding, luneta interna e 200m de resistência. Clássico acessível.',
    storeUrl: 'https://www.relojoariaimpala.com.br',
    gradient: GRADIENTS[3],
  },
  {
    brand: 'Terranova',
    model: 'Modelo Exclusivo',
    description: 'Micro Brand nacional que despontou em 2024 com acabamentos de alto nível e identidade própria.',
    storeUrl: 'https://terranovawatches.com',
    gradient: GRADIENTS[4],
  },
];

export function useRecommendations() {
  const { data, loading } = useSheetData('recomendacoes');

  const watches = useMemo<Watch[]>(() => {
    if (data.length === 0) return FALLBACK;

    const rows = data.slice(1);
    const parsed = rows
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

    return parsed.length > 0 ? parsed : FALLBACK;
  }, [data]);

  return { watches, loading };
}
