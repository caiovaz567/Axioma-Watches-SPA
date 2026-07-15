import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchOgImage } from './_lib/og';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.query.url as string;
  if (!url) return res.status(400).json({ imageUrl: null });

  try {
    const imageUrl = await fetchOgImage(url);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.json({ imageUrl });
  } catch {
    res.json({ imageUrl: null });
  }
}
