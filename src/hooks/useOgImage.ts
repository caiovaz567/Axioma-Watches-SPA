import { useEffect, useState } from 'react';

export function useOgImage(storeUrl: string | undefined, overrideUrl?: string) {
  const [fetched, setFetched] = useState<string | null>(() => {
    if (overrideUrl || !storeUrl) return null;
    return sessionStorage.getItem(`og_${storeUrl}`) || null;
  });

  useEffect(() => {
    if (overrideUrl || !storeUrl) return;

    const key = `og_${storeUrl}`;
    if (sessionStorage.getItem(key) !== null) return;

    fetch(`/api/og-image?url=${encodeURIComponent(storeUrl)}`)
      .then((r) => r.json())
      .then(({ imageUrl: url }: { imageUrl: string | null }) => {
        sessionStorage.setItem(key, url ?? '');
        setFetched(url ?? null);
      })
      .catch(() => sessionStorage.setItem(key, ''));
  }, [storeUrl, overrideUrl]);

  return overrideUrl ?? fetched;
}
