import { useState, useRef, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Box, IconButton } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const arrowSx = (enabled: boolean) => ({
  flexShrink: 0,
  display: { xs: 'none', md: 'flex' },
  color: enabled ? 'primary.main' : 'rgba(255,255,255,0.15)',
  border: '1px solid',
  borderColor: enabled ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)',
  borderRadius: '50%',
  width: 44,
  height: 44,
  transition: 'all 0.2s',
  '&:hover:not(:disabled)': {
    borderColor: 'primary.main',
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  '&.Mui-disabled': {
    color: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
});

interface CarouselProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
  /** Quando este valor muda, a rolagem volta ao início (sem remontar os slides) */
  resetToken?: unknown;
}

export default function Carousel({ children, sx, resetToken }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [bar, setBar] = useState({ start: 0, size: 1 });

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    setBar({
      start: el.scrollWidth > 0 ? el.scrollLeft / el.scrollWidth : 0,
      size: el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1,
    });
  }, []);

  const seek = useCallback((clientX: number) => {
    const el = trackRef.current;
    const barEl = barRef.current;
    if (!el || !barEl) return;
    const rect = barEl.getBoundingClientRect();
    const frac = (clientX - rect.left) / rect.width;
    el.scrollLeft = frac * el.scrollWidth - el.clientWidth / 2;
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(updateScrollState);
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, children]);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    updateScrollState();
  }, [resetToken, updateScrollState]);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth : el.clientWidth, behavior: 'smooth' });
  };

  return (
    <Box sx={[{}, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 2 } }}>
      <IconButton
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Anterior"
        sx={arrowSx(canScrollLeft)}
      >
        <ChevronLeftIcon />
      </IconButton>

      <Box sx={{ overflow: 'hidden', flex: 1, mx: { xs: -4, sm: -6, md: 0 } }}>
        <Box
          ref={trackRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            px: { xs: 4, sm: 6, md: 0 },
            scrollPaddingLeft: { xs: '32px', sm: '48px', md: '0px' },
          }}
        >
          {children}
        </Box>
      </Box>

      <IconButton
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Próximo"
        sx={arrowSx(canScrollRight)}
      >
        <ChevronRightIcon />
      </IconButton>
      </Box>

      {/* Espaço da barra sempre reservado para a altura da seção não pular ao filtrar */}
      <Box
        ref={barRef}
        style={{ visibility: bar.size < 0.999 ? 'visible' : 'hidden' }}
          onPointerDown={(e) => {
            draggingRef.current = true;
            barRef.current?.setPointerCapture(e.pointerId);
            seek(e.clientX);
          }}
        onPointerMove={(e) => {
          if (draggingRef.current) seek(e.clientX);
        }}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
        sx={{
          mt: { xs: 3.5, md: 4 },
          mx: 'auto',
          width: { xs: 140, md: 180 },
          py: 1,
          cursor: 'pointer',
          touchAction: 'none',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${bar.start * 100}%`,
              width: `${bar.size * 100}%`,
              borderRadius: 2,
              backgroundColor: 'rgba(201,168,76,0.6)',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
