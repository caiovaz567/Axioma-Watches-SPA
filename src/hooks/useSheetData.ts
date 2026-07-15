import { useEffect, useState } from 'react';

const inFlight = new Map<string, Promise<string[][]>>();

export type SheetType = 'video' | 'recomendacoes';

export function useSheetData(type: SheetType) {
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `/api/sheet?type=${type}`;

    let promise = inFlight.get(type);
    if (!promise) {
      promise = fetch(url)
        .then((r) => {
          if (!r.ok || !r.headers.get('content-type')?.includes('text/csv')) {
            throw new Error(`Not a CSV response (${r.status})`);
          }
          return r.text();
        })
        .then((csv) => parseCSV(csv))
        .finally(() => inFlight.delete(type));
      inFlight.set(type, promise);
    }

    promise
      .then((rows) => setData(rows))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [type]);

  return { data, loading };
}

function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  const lines = csv.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    rows.push(parseCSVLine(trimmed));
  }
  return rows;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}
