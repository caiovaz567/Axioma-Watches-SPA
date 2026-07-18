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
}

export default function Carousel({ children, sx }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
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

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth : el.clientWidth, behavior: 'smooth' });
  };

  return (
    <Box
      sx={[
        { display: 'flex', alignItems: 'center', gap: { md: 2 } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
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
  );
}
