import type { VercelRequest, VercelResponse } from '@vercel/node';

const URLS: Record<string, string | undefined> = {
  video: process.env.VIDEO_SHEET_URL,
  recomendacoes: process.env.RECOMMENDATIONS_SHEET_URL,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const type = req.query.type as string;
  const url = URLS[type];

  if (!url) {
    return res.status(400).json({ error: 'invalid type' });
  }

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const csv = await response.text();
    // Cache curto na CDN: o site abre rápido e edições na planilha aparecem em até 1 min.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch {
    res.status(500).json({ error: 'failed to fetch sheet' });
  }
}
