// Lógica compartilhada entre a função serverless (api/og-image.ts)
// e o middleware de dev do Vite (vite.config.ts).

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /\.local$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./,
  /^0\./,
  /^\[?::1\]?$/,
  /^\[?f[cd][0-9a-f]{2}:/i,
];

/** Aceita apenas http(s) público — bloqueia localhost/IPs privados (SSRF). */
export function isSafePublicUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  return !PRIVATE_HOST_PATTERNS.some((re) => re.test(url.hostname));
}

export function extractBestImage(html: string): string | null {
  const jsonLdMatches = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  for (const match of jsonLdMatches) {
    try {
      const data = JSON.parse(match[1]);
      const imgs: unknown = data.image ?? data.images;
      if (Array.isArray(imgs) && imgs.length > 0) {
        const candidate = (imgs[1] ?? imgs[0]) as string;
        if (typeof candidate === 'string' && candidate.startsWith('http')) return candidate;
      }
      if (typeof imgs === 'string' && imgs.startsWith('http')) return imgs;
    } catch {
      // JSON-LD inválido — tenta o próximo bloco
    }
  }

  const ogMatch =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch?.[1]) return ogMatch[1];

  return null;
}

export async function fetchOgImage(url: string): Promise<string | null> {
  if (!isSafePublicUrl(url)) return null;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
    signal: AbortSignal.timeout(5000),
  });
  const html = await response.text();
  return extractBestImage(html);
}
