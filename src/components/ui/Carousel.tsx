import { Children, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Box, ButtonBase } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useInView } from 'motion/react';
import { tokens, font, easeCss } from '../../theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { prefersReducedMotion, cssScrollFx } from '../../lib/scroll';
import Icon from './Icon';

/** Largura de cada slide por breakpoint (em CSS) */
type SlideWidth = Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>>;

interface CarouselProps {
  children: ReactNode;
  slideWidth: SlideWidth;
  /** Rótulo acessível do carrossel */
  label: string;
  /** Intervalo do autoplay em ms; desligado se omitido ou com "reduzir movimento" */
  autoplayMs?: number;
  options?: EmblaOptionsType;
  sx?: SxProps<Theme>;
}

const GAP = { xs: 14, md: 24 };
// No celular os slides vazam até a borda da tela — dá a pista de que dá para arrastar
const BLEED = { xs: 20, sm: 32, md: 0 };
const PARALLAX = 8; // % de deslocamento máximo da camada interna
const AHEAD = 2; // vizinhos preparados antes de entrarem na tela

type Ctrl = { index: number; count: number; prev: boolean; next: boolean };

/**
 * Dois motores, mesmo visual e mesmas animações:
 *
 * - Mouse/trackpad: Embla (arrastar com o mouse, física própria).
 * - Toque: rolagem horizontal NATIVA do navegador com encaixe (scroll-snap).
 *   Motivo: no Safari do iPhone o JavaScript fica limitado a 60 atualizações
 *   por segundo enquanto a tela roda a 120; o carrossel empurrado por JS
 *   parecia "30 fps" ao lado da página. A rolagem nativa roda no mesmo motor
 *   da página (120 Hz, inércia do iOS). O parallax das fotos vira CSS nativo
 *   (animation-timeline) quando suportado.
 */
export default function Carousel(props: CarouselProps) {
  const [finePointer] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  return finePointer ? <EmblaCarousel {...props} /> : <NativeCarousel {...props} />;
}

/* ───────────────────────── Toque: rolagem nativa ───────────────────────── */

/** Posições de encaixe reais (os últimos slides param no fim da rolagem) */
function snapPoints(scroller: HTMLElement) {
  const slides = [...scroller.querySelectorAll<HTMLElement>(':scope > .nc-slide')];
  const padL = parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
  const max = scroller.scrollWidth - scroller.clientWidth;
  const pts: number[] = [];
  for (const s of slides) {
    const p = Math.min(Math.max(0, s.offsetLeft - padL), max);
    if (!pts.length || p - pts[pts.length - 1] > 2) pts.push(p);
  }
  return { slides, pts, max };
}

function nearestIndex(pts: number[], x: number) {
  let best = 0;
  for (let i = 1; i < pts.length; i++) if (Math.abs(pts[i] - x) < Math.abs(pts[best] - x)) best = i;
  return best;
}

function goTo(scroller: HTMLElement, dir: 1 | -1 | 'start') {
  const { pts } = snapPoints(scroller);
  if (!pts.length) return;
  const i = dir === 'start' ? 0 : Math.max(0, Math.min(pts.length - 1, nearestIndex(pts, scroller.scrollLeft) + dir));
  scroller.scrollTo({ left: pts[i], behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

function NativeCarousel({ children, slideWidth, label, autoplayMs, sx }: CarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: '-20% 0px -20% 0px' });
  const lastTouch = useRef(0);
  // Contador/setas assinam este "canal": mudar de slide re-renderiza só os
  // controles, nunca os cards (re-render de 50 cards durante o deslize pesava).
  const [ctrlStore] = useState(createCtrlStore);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const reduced = prefersReducedMotion();
    let raf = 0;
    let lastNear = '';

    // Liga o parallax só nos slides perto da tela (cada foto animada vira uma
    // camada na memória de vídeo; 50 de uma vez pesaria no iPhone) e já deixa
    // as fotos desses vizinhos decodificadas.
    const prepareNearby = (slides: HTMLElement[], index: number) => {
      const lo = Math.max(0, index - AHEAD);
      const hi = Math.min(slides.length - 1, index + AHEAD + 2);
      const key = `${lo}-${hi}`;
      if (key === lastNear) return;
      lastNear = key;
      slides.forEach((s, i) => {
        const near = i >= lo && i <= hi;
        s.classList.toggle('nc-near', near && !reduced);
        if (near) {
          s.querySelectorAll('img').forEach((img) => {
            if (img.loading !== 'eager') img.loading = 'eager';
            if (img.src && !img.dataset.warm) {
              img.dataset.warm = '1';
              img.decode?.().catch(() => {});
            }
          });
        }
      });
    };

    // Parallax em JS só se o navegador não souber fazer em CSS
    const jsParallax = (slides: HTMLElement[]) => {
      if (cssScrollFx || reduced) return;
      const viewW = scroller.clientWidth || 1;
      const x = scroller.scrollLeft;
      for (const s of slides) {
        if (!s.classList.contains('nc-near')) continue;
        const layer = s.querySelector<HTMLElement>('[data-parallax]');
        if (!layer) continue;
        const offset = (s.offsetLeft + s.offsetWidth / 2 - x - viewW / 2) / viewW;
        layer.style.transform = `translate3d(${(Math.max(-1, Math.min(1, offset)) * -PARALLAX).toFixed(2)}%, 0, 0)`;
      }
    };

    const update = () => {
      raf = 0;
      const { slides, pts, max } = snapPoints(scroller);
      const x = scroller.scrollLeft;
      const index = nearestIndex(pts, x);
      if (progressRef.current) {
        const p = max > 0 ? x / max : 0;
        progressRef.current.style.transform = `scaleX(${0.08 + Math.max(0, Math.min(1, p)) * 0.92})`;
      }
      ctrlStore.set({ index, count: pts.length, prev: x > 2, next: x < max - 2 });
      // Índice do primeiro slide visível (pode ser diferente do índice de encaixe no fim)
      const first = slides.findIndex((s) => s.offsetLeft + s.offsetWidth > x);
      prepareNearby(slides, Math.max(0, first));
      jsParallax(slides);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(scroller);
    // Fotos que chegam depois (busca da imagem da loja) também entram no preparo
    const mo = new MutationObserver(() => {
      lastNear = '';
      onScroll();
    });
    mo.observe(scroller, { subtree: true, attributes: true, attributeFilter: ['src'], childList: true });
    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      ro.disconnect();
      mo.disconnect();
    };
  }, [ctrlStore]);

  // Troca automática: só visível, com a aba ativa e sem toque recente
  useEffect(() => {
    if (!autoplayMs || prefersReducedMotion() || !inView) return;
    const id = window.setInterval(() => {
      const scroller = scrollerRef.current;
      if (!scroller || document.hidden || Date.now() - lastTouch.current < autoplayMs) return;
      const { max } = snapPoints(scroller);
      if (scroller.scrollLeft >= max - 2) goTo(scroller, 'start');
      else goTo(scroller, 1);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, inView]);

  const count = Children.count(children);
  const touched = () => (lastTouch.current = Date.now());

  return (
    <Box
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
      onKeyDown={(e) => {
        if (!scrollerRef.current) return;
        if (e.key === 'ArrowRight') goTo(scrollerRef.current, 1);
        if (e.key === 'ArrowLeft') goTo(scrollerRef.current, -1);
      }}
    >
      <Box
        ref={scrollerRef}
        className="nc-scroller"
        onPointerDown={touched}
        onTouchStart={touched}
        sx={{
          position: 'relative',
          display: 'flex',
          gap: { xs: `${GAP.xs}px`, md: `${GAP.md}px` },
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          overscrollBehaviorX: 'contain',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          mx: { xs: `-${BLEED.xs}px`, sm: `-${BLEED.sm}px`, md: 0 },
          pl: { xs: `${BLEED.xs}px`, sm: `${BLEED.sm}px`, md: 0 },
          scrollPaddingLeft: { xs: `${BLEED.xs}px`, sm: `${BLEED.sm}px`, md: 0 },
          // Folga no fim igual à do começo (padding-right é ignorado em flex rolável no Safari)
          '&::after': { content: '""', flex: { xs: `0 0 ${BLEED.xs - GAP.xs}px`, sm: `0 0 ${BLEED.sm - GAP.xs}px`, md: '0 0 1px' } },
        }}
      >
        {Children.map(children, (child, i) => (
          <Box
            className="nc-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
            sx={{
              flex: '0 0 auto',
              minWidth: 0,
              width: slideWidth,
              display: 'flex',
              flexDirection: 'column',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'normal',
            }}
          >
            {child}
          </Box>
        ))}
      </Box>

      <StoreControls
        store={ctrlStore}
        progressRef={progressRef}
        onPrev={() => {
          touched();
          if (scrollerRef.current) goTo(scrollerRef.current, -1);
        }}
        onNext={() => {
          touched();
          if (scrollerRef.current) goTo(scrollerRef.current, 1);
        }}
      />
    </Box>
  );
}

type CtrlStore = ReturnType<typeof createCtrlStore>;

function createCtrlStore() {
  let value: Ctrl = { index: 0, count: 0, prev: false, next: false };
  const subs = new Set<() => void>();
  return {
    get: () => value,
    set(n: Ctrl) {
      if (value.index === n.index && value.count === n.count && value.prev === n.prev && value.next === n.next) return;
      value = n;
      subs.forEach((f) => f());
    },
    subscribe(f: () => void) {
      subs.add(f);
      return () => {
        subs.delete(f);
      };
    },
  };
}

function StoreControls({ store, ...rest }: { store: CtrlStore; progressRef: RefObject<HTMLDivElement | null>; onPrev: () => void; onNext: () => void }) {
  const ctrl = useSyncExternalStore(store.subscribe, store.get);
  return <Controls ctrl={ctrl} {...rest} />;
}

/* ──────────────────────── Mouse/trackpad: Embla ──────────────────────── */

function EmblaCarousel({ children, slideWidth, label, autoplayMs, options, sx }: CarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: '-20% 0px -20% 0px' });

  const [autoplay] = useState(() =>
    autoplayMs && !prefersReducedMotion()
      ? Autoplay({ delay: autoplayMs, playOnInit: false, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true })
      : null,
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'start', containScroll: 'trimSnaps', duration: 28, dragThreshold: 6, ...options },
    autoplay ? [autoplay] : [],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const useParallax = !prefersReducedMotion();
    let layers: (HTMLElement | null)[] = [];
    let centers: number[] = [];
    let viewW = 1;
    const applied: number[] = [];

    // Mede uma vez: centro de cada slide relativo ao container + largura da janela
    const measure = (api: EmblaCarouselType) => {
      viewW = api.rootNode().clientWidth || 1;
      const slides = api.slideNodes();
      centers = slides.map((s) => s.offsetLeft + s.offsetWidth / 2);
      layers = slides.map((s) => s.querySelector<HTMLElement>('[data-parallax]'));
      if (!useParallax) layers.forEach((l) => l && (l.style.transform = ''));
      applied.length = 0;
    };

    // Slides visíveis + vizinhos: o card que entra já tem camada pronta
    const nearby = (api: EmblaCarouselType) => {
      const inViewIdx = api.slidesInView();
      if (!inViewIdx.length) return [];
      const lo = Math.max(0, Math.min(...inViewIdx) - AHEAD);
      const hi = Math.min(layers.length - 1, Math.max(...inViewIdx) + AHEAD);
      const out: number[] = [];
      for (let i = lo; i <= hi; i++) out.push(i);
      return out;
    };

    const tween = (api: EmblaCarouselType) => {
      if (progressRef.current) {
        const p = Math.max(0, Math.min(1, api.scrollProgress()));
        progressRef.current.style.transform = `scaleX(${0.08 + p * 0.92})`;
      }
      if (!useParallax) return;
      const location = api.internalEngine().location.get();
      for (const i of nearby(api)) {
        const layer = layers[i];
        if (!layer) continue;
        const offset = (centers[i] + location - viewW / 2) / viewW;
        const v = Math.round(Math.max(-1, Math.min(1, offset)) * -PARALLAX * 100) / 100;
        if (applied[i] === v) continue;
        applied[i] = v;
        layer.style.transform = `translate3d(${v}%, 0, 0)`;
      }
    };

    // Deixa as fotos dos vizinhos baixadas e decodificadas antes de entrarem na tela
    const warmed = new Set<number>();
    const warm = (api: EmblaCarouselType) => {
      const slides = api.slideNodes();
      for (const i of nearby(api)) {
        if (warmed.has(i) || !slides[i]) continue;
        const imgs = slides[i].querySelectorAll('img');
        if (imgs.length === 0 || [...imgs].some((img) => !img.src)) continue;
        warmed.add(i);
        imgs.forEach((img) => {
          img.loading = 'eager';
          img.decode?.().catch(() => {});
        });
      }
    };

    const onInit = () => {
      measure(emblaApi);
      warmed.clear();
      tween(emblaApi);
      warm(emblaApi);
    };
    const onScroll = () => tween(emblaApi);
    const onWarm = () => warm(emblaApi);

    onInit();
    emblaApi
      .on('reInit', onInit)
      .on('resize', onInit)
      .on('scroll', onScroll)
      .on('slidesInView', onScroll)
      .on('slidesInView', onWarm)
      .on('select', onWarm);
    return () => {
      emblaApi
        .off('reInit', onInit)
        .off('resize', onInit)
        .off('scroll', onScroll)
        .off('slidesInView', onScroll)
        .off('slidesInView', onWarm)
        .off('select', onWarm);
    };
  }, [emblaApi]);

  // Autoplay só roda com o carrossel visível na tela
  useEffect(() => {
    if (!autoplay || !emblaApi) return;
    if (inView) autoplay.play();
    else autoplay.stop();
  }, [inView, autoplay, emblaApi]);

  const count = Children.count(children);

  return (
    <Box
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') emblaApi?.scrollNext();
        if (e.key === 'ArrowLeft') emblaApi?.scrollPrev();
      }}
    >
      <Box
        ref={emblaRef}
        sx={{
          overflow: 'hidden',
          mx: { xs: `-${BLEED.xs}px`, sm: `-${BLEED.sm}px`, md: 0 },
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <Box
          sx={{
            // position: relative => offsetLeft dos slides é medido em relação a este container
            position: 'relative',
            display: 'flex',
            touchAction: 'pan-y pinch-zoom',
            gap: { xs: `${GAP.xs}px`, md: `${GAP.md}px` },
            pl: { xs: `${BLEED.xs}px`, sm: `${BLEED.sm}px`, md: 0 },
            // Folga final igual à inicial — o Embla mede a margem do último slide
            '& > :last-of-type': { mr: { xs: `${BLEED.xs}px`, sm: `${BLEED.sm}px`, md: 0 } },
          }}
        >
          {Children.map(children, (child, i) => (
            <Box
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              sx={{ flex: '0 0 auto', minWidth: 0, width: slideWidth, display: 'flex', flexDirection: 'column' }}
            >
              {child}
            </Box>
          ))}
        </Box>
      </Box>

      <EmblaControls emblaApi={emblaApi} progressRef={progressRef} />
    </Box>
  );
}

/** Assina os eventos do Embla; quando o slide muda, só os controles re-renderizam */
function EmblaControls({ emblaApi, progressRef }: { emblaApi: EmblaCarouselType | undefined; progressRef: RefObject<HTMLDivElement | null> }) {
  const [ctrl, setCtrl] = useState<Ctrl>({ index: 0, count: 0, prev: false, next: false });

  useEffect(() => {
    if (!emblaApi) return;
    const sync = () =>
      setCtrl({
        index: emblaApi.selectedScrollSnap(),
        count: emblaApi.scrollSnapList().length,
        prev: emblaApi.canScrollPrev(),
        next: emblaApi.canScrollNext(),
      });
    sync();
    emblaApi.on('select', sync).on('reInit', sync);
    return () => {
      emblaApi.off('select', sync).off('reInit', sync);
    };
  }, [emblaApi]);

  return <Controls ctrl={ctrl} progressRef={progressRef} onPrev={() => emblaApi?.scrollPrev()} onNext={() => emblaApi?.scrollNext()} />;
}

/* ─────────────────────────── Controles (comum) ─────────────────────────── */

function Controls({ ctrl, progressRef, onPrev, onNext }: { ctrl: Ctrl; progressRef: RefObject<HTMLDivElement | null>; onPrev: () => void; onNext: () => void }) {
  const { t } = useLanguage();

  return (
    <Box
      data-fab-avoid
      sx={{
        mt: { xs: 4, md: 5 },
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, md: 3 },
        visibility: ctrl.count > 1 ? 'visible' : 'hidden',
      }}
    >
      <Box
        aria-live="polite"
        sx={{ fontFamily: font, fontWeight: 600, fontSize: '0.95rem', color: tokens.muted, minWidth: 52, fontVariantNumeric: 'tabular-nums' }}
      >
        <Box component="span" sx={{ color: tokens.white }}>{ctrl.index + 1}</Box>
        {' / '}
        {ctrl.count}
      </Box>

      <Box sx={{ flex: 1, height: 3, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
        <Box
          ref={progressRef}
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 3,
            backgroundColor: tokens.gold,
            transformOrigin: 'left center',
            transform: 'scaleX(0.08)',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <ArrowButton dir="prev" disabled={!ctrl.prev} onClick={onPrev} label={t.a11y.carouselPrev} />
        <ArrowButton dir="next" disabled={!ctrl.next} onClick={onNext} label={t.a11y.carouselNext} />
      </Box>
    </Box>
  );
}

function ArrowButton({ dir, disabled, onClick, label }: { dir: 'prev' | 'next'; disabled: boolean; onClick: () => void; label: string }) {
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      sx={{
        width: { xs: 46, md: 56 },
        height: { xs: 46, md: 56 },
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        color: tokens.white,
        transition: `background-color .4s ${easeCss}, color .4s ${easeCss}, opacity .3s`,
        '& svg': { transition: `transform .45s ${easeCss}` },
        '@media (hover: hover)': {
          '&:hover': { backgroundColor: tokens.gold, color: tokens.ink },
          '&:hover svg': { transform: dir === 'next' ? 'translateX(3px)' : 'translateX(-3px)' },
        },
        '&.Mui-disabled': { opacity: 0.35 },
        '&.Mui-focusVisible': { outline: `2px solid ${tokens.gold}`, outlineOffset: 3 },
      }}
    >
      <Icon name={dir === 'next' ? 'arrowRight' : 'arrowLeft'} size={18} />
    </ButtonBase>
  );
}
