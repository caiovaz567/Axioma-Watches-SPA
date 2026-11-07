import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { tokens, display, eyebrow, gutter, maxWidth } from '../../theme';
import { Reveal, Words } from './motion';

interface SectionProps {
  id?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * Bloco de seção. No computador cada seção ocupa uma tela (conteúdo centralizado),
 * para caber inteira quando o menu leva até ela e o destaque dourado aparecer em
 * volta dela. No celular é só um bloco com respiro (lá não há como caber).
 */
export function Section({ id, children, sx }: SectionProps) {
  return (
    <Box
      component="section"
      id={id}
      sx={[
        {
          position: 'relative',
          backgroundColor: tokens.ink,
          py: { xs: 12, md: 5 },
          minHeight: { md: '100svh' },
          display: { md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ width: '100%' }}>{children}</Box>
    </Box>
  );
}

/** Container com largura máxima e margem lateral do site */
export function Container({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  return <Box sx={[{ maxWidth, mx: 'auto', px: gutter }, ...(Array.isArray(sx) ? sx : [sx])]}>{children}</Box>;
}

interface HeadingProps {
  label: string;
  title: string;
  lead?: ReactNode;
  align?: 'left' | 'center';
  /** Trecho do título a pintar de dourado */
  highlight?: string;
  /** Deixa o título usar a largura toda (cabe em uma linha no computador) */
  wide?: boolean;
  sx?: SxProps<Theme>;
}

/** Rótulo dourado + título grande + texto de apoio */
export function Heading({ label, title, lead, align = 'left', highlight, wide, sx }: HeadingProps) {
  const center = align === 'center';
  const parts = highlight && title.includes(highlight) ? title.split(highlight) : null;

  return (
    <Box sx={[{ textAlign: align, mb: { xs: 6, md: 9 } }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Reveal y={16}>
        <Box sx={{ ...eyebrow, color: tokens.gold, mb: { xs: 2, md: 2.5 } }}>{label}</Box>
      </Reveal>
      <Box
        component="h2"
        sx={{
          ...display,
          m: 0,
          mx: center ? 'auto' : 0,
          maxWidth: wide ? 'none' : center ? 980 : 1000,
          fontSize: { xs: 'clamp(2.4rem, 11vw, 3.4rem)', md: 'clamp(3.6rem, 6vw, 5.6rem)' },
          color: tokens.white,
          textWrap: 'balance',
        }}
      >
        {parts ? (
          <>
            <Words text={parts[0].trim()} />{' '}
            <Box component="span" sx={{ color: tokens.gold }}>
              <Words text={highlight!} delay={0.12} />
            </Box>
            {parts[1] && <> <Words text={parts[1].trim()} delay={0.2} /></>}
          </>
        ) : (
          <Words text={title} />
        )}
      </Box>
      {lead && (
        <Reveal delay={0.2} y={20}>
          <Box
            sx={{
              mt: { xs: 3, md: 4 },
              mx: center ? 'auto' : 0,
              maxWidth: 620,
              color: tokens.muted,
              fontSize: { xs: '1.05rem', md: '1.2rem' },
              lineHeight: 1.6,
            }}
          >
            {lead}
          </Box>
        </Reveal>
      )}
    </Box>
  );
}
