import type { ReactNode, MouseEvent } from 'react';
import { ButtonBase } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { tokens, font, easeCss } from '../../theme';
import Icon from './Icon';
import type { IconName } from './Icon';

interface CtaProps {
  children: ReactNode;
  variant?: 'gold' | 'light' | 'ghost';
  href?: string;
  external?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  icon?: IconName | null;
  size?: 'md' | 'lg';
  sx?: SxProps<Theme>;
}

const VARIANTS = {
  gold: { bg: tokens.gold, fg: tokens.ink, border: tokens.gold, hoverBg: tokens.goldLight },
  light: { bg: tokens.white, fg: tokens.ink, border: tokens.white, hoverBg: '#FFFFFF' },
  ghost: { bg: 'rgba(255,255,255,0.1)', fg: tokens.white, border: 'rgba(255,255,255,0.22)', hoverBg: 'rgba(255,255,255,0.16)' },
};

/** Botão em pílula. No hover a seta desliza dentro do círculo. */
export default function Cta({
  children,
  variant = 'gold',
  href,
  external,
  onClick,
  type = 'button',
  disabled,
  icon = 'arrowRight',
  size = 'md',
  sx,
}: CtaProps) {
  const v = VARIANTS[variant];
  const linkProps = href
    ? { component: 'a' as const, href, ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
    : { type };

  return (
    <ButtonBase
      {...linkProps}
      onClick={onClick}
      disabled={disabled}
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          minHeight: size === 'lg' ? 58 : 50,
          pl: size === 'lg' ? 3.5 : 3,
          pr: icon ? 1 : size === 'lg' ? 3.5 : 3,
          borderRadius: 999,
          fontFamily: font,
          fontWeight: 600,
          fontSize: size === 'lg' ? '1.02rem' : '0.95rem',
          color: v.fg,
          backgroundColor: v.bg,
          border: `1px solid ${v.border}`,
          // Sem backdrop-filter: no hero ele some com a rolagem e o Safari engasgava
          transition: `background-color .35s ${easeCss}, transform .35s ${easeCss}`,
          '& .cta-dot': {
            width: size === 'lg' ? 42 : 36,
            height: size === 'lg' ? 42 : 36,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            backgroundColor: variant === 'ghost' ? tokens.white : tokens.ink,
            color: variant === 'ghost' ? tokens.ink : v.bg,
          },
          '& .cta-arrow': { transition: `transform .45s ${easeCss}` },
          '@media (hover: hover)': {
            '&:hover': { backgroundColor: v.hoverBg },
            '&:hover .cta-arrow': { transform: icon === 'arrowUpRight' ? 'translate(2px,-2px)' : 'translateX(3px)' },
          },
          '&:active': { transform: 'scale(0.98)' },
          '&.Mui-disabled': { opacity: 0.6, color: v.fg },
          '&.Mui-focusVisible': { outline: `2px solid ${tokens.gold}`, outlineOffset: 3 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <span>{children}</span>
      {icon && (
        <span className="cta-dot">
          <Icon name={icon} size={17} strokeWidth={1.6} className="cta-arrow" />
        </span>
      )}
    </ButtonBase>
  );
}
