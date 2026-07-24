import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { revealSx } from '../hooks/useScrollReveal';

interface SectionHeadingProps {
  label: string;
  heading: ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  visible: boolean;
  /** Atraso base — os três elementos entram em cascata a partir dele */
  delay?: number;
  sx?: SxProps<Theme>;
}

/**
 * Cabeçalho padrão de seção (olho + fio dourado + título + apoio).
 * Existe para que todas as seções compartilhem exatamente a mesma escala
 * tipográfica e o mesmo ritmo vertical — antes cada uma tinha os seus valores.
 */
export default function SectionHeading({
  label,
  heading,
  subtitle,
  align = 'center',
  visible,
  delay = 0,
  sx,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <Box sx={[{ textAlign: align }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Typography
        sx={{
          ...revealSx(visible, delay),
          color: 'primary.main',
          fontSize: '0.78rem',
          letterSpacing: '0.35em',
          // Compensa o espaço que o tracking adiciona depois da última letra,
          // senão o texto centralizado fica opticamente deslocado à esquerda.
          textIndent: centered ? '0.35em' : 0,
          fontFamily: '"Inter", sans-serif',
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          ...revealSx(visible, delay + 60),
          width: 32,
          height: '1px',
          backgroundColor: 'rgba(201,168,76,0.45)',
          mt: 2,
          mx: centered ? 'auto' : 0,
        }}
      />

      <Typography
        variant="h2"
        sx={{
          ...revealSx(visible, delay + 120),
          fontSize: { xs: '2rem', md: '2.6rem' },
          color: '#EBEBEB',
          lineHeight: 1.2,
          mt: 3,
        }}
      >
        {heading}
      </Typography>

      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            ...revealSx(visible, delay + 200),
            color: 'text.secondary',
            mt: 2.5,
            maxWidth: 520,
            mx: centered ? 'auto' : 0,
            lineHeight: 1.8,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
