/** Copia texto com fallback para navegadores sem Clipboard API (ou fora de HTTPS) */
export function copyText(text: string) {
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(ta);
    }
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(fallback);
  } else {
    fallback();
  }
}
