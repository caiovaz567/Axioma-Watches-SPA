import Lenis from 'lenis';

/**
 * Rolagem suave (Lenis) com fallback nativo.
 *
 * - Em telas de toque o Lenis deixa a rolagem nativa (que já é fluida e
 *   tem a inércia que o usuário espera); ele só suaviza mouse e trackpad.
 * - Com "reduzir movimento" ligado no sistema, nem é iniciado.
 */
let lenis: Lenis | null = null;

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Efeitos presos à rolagem (parallax, zoom conforme rola) só com mouse/trackpad.
 * No iPhone a rolagem roda fora do JavaScript: qualquer efeito que "segue" o
 * dedo chega um quadro atrasado e dá tranco. Lá usamos animações que tocam
 * uma vez ao aparecer na tela.
 */
export function scrollFxEnabled() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !prefersReducedMotion()
  );
}

/**
 * O navegador sabe animar presos à rolagem sozinho (CSS animation-timeline)?
 * Se sim, os componentes usam as classes .sd-* do index.css em vez do JS.
 * Ver o comentário no index.css para o porquê (tranco no Safari do iPhone).
 */
export const cssScrollFx =
  typeof window !== 'undefined' && typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

export function initSmoothScroll() {
  // Só com mouse/trackpad. No toque o Lenis não suaviza nada (a rolagem nativa
  // já é a certa), mas continuaria rodando um loop a cada quadro e recalculando
  // tudo quando a barra do Safari encolhe/cresce — isso dava engasgo no iPhone.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer || prefersReducedMotion() || lenis) return () => {};
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    anchors: false,
  });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

/**
 * Contorno dourado que acende e apaga quando a rolagem chega na seção.
 * - A seção cabe na tela (computador): o contorno envolve a seção inteira.
 * - Não cabe (celular, tela baixa): envolve o título da seção, que fica no
 *   topo da tela com os quatro lados visíveis. (Em volta da tela não dava:
 *   no iPhone a barra do Safari flutua por cima e cortava a borda de baixo.)
 * Anima só opacidade (leve até no Safari do iPhone).
 */
function flashSection(section: HTMLElement, fits: boolean) {
  if (prefersReducedMotion()) return;
  document.querySelectorAll('.section-flash').forEach((f) => f.remove());
  const heading = section.querySelector('h2')?.parentElement ?? null;
  const host = fits || !heading ? section : heading;
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  const flash = document.createElement('div');
  flash.className = host === section ? 'section-flash' : 'section-flash section-flash--heading';
  flash.setAttribute('aria-hidden', 'true');
  host.appendChild(flash);
  flash.addEventListener('animationend', () => flash.remove(), { once: true });
}

/** Espera a rolagem parar (evento scrollend quando existe; senão, um tempo fixo) */
function onScrollEnd(cb: () => void) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    window.removeEventListener('scrollend', finish);
    cb();
  };
  if ('onscrollend' in window) window.addEventListener('scrollend', finish, { once: true });
  window.setTimeout(finish, 1500);
}

/**
 * Rola até um seletor (#id), elemento ou posição.
 *
 * Para exatamente no começo da seção: o menu se esconde ao descer, e o antigo
 * desconto da altura dele deixava aparecer um pedaço da seção de cima. Toda
 * seção tem respiro no topo, então se o menu aparecer ele não cobre conteúdo.
 * Elementos que precisam de folga (ex.: o formulário) declaram scroll-margin-top.
 */
export function scrollToTarget(target: string | HTMLElement | number) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;

  const margin = typeof el === 'number' ? 0 : parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  // Destaque só nas seções do menu (não no topo nem em elementos soltos)
  const flashTarget = typeof target === 'string' && target !== '#hero' && el instanceof HTMLElement ? el : null;

  // Seção que cabe na tela: para exatamente nela (o contorno envolve a seção).
  // Seção maior que a tela: entra no respiro de cima e deixa ~72px livres
  // (lugar do menu, se ele reaparecer), para sobrar tela para o conteúdo.
  const fits = !!flashTarget && flashTarget.offsetHeight <= window.innerHeight + 1;
  const inset =
    flashTarget && !fits
      ? Math.max(0, (parseFloat(getComputedStyle(flashTarget).paddingTop) || 0) - 72)
      : 0;
  const flash = () => flashTarget && flashSection(flashTarget, fits);

  if (lenis) {
    lenis.scrollTo(el, { offset: inset, duration: 1.4, onComplete: flash });
    return;
  }
  const top = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY - margin + inset;
  if (flashTarget) onScrollEnd(flash);
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Trava/destrava a rolagem da página (menu mobile aberto) */
export function setScrollLocked(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
