import { useMemo } from 'react';
import { useSheetData } from './useSheetData';

const FALLBACK_ID = 'cSwWaiP2ReQ';

function extractVideoId(input: string): string {
  const m = input.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : input.trim();
}

export function useVideoConfig() {
  const { data, loading } = useSheetData('video');

  const videoId = useMemo<string>(() => {
    if (data.length === 0) return FALLBACK_ID;
    const cell = data[0]?.[0];
    if (!cell) return FALLBACK_ID;
    return extractVideoId(cell) || FALLBACK_ID;
  }, [data]);

  return { videoId, loading };
}
