import { useEffect, useRef, useState } from 'react';
import { ButtonBase, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'motion/react';
import { tokens, font, ease } from '../../theme';
import { copyText } from '../../lib/clipboard';
import { useLanguage } from '../../contexts/LanguageContext';
import Icon from './Icon';

interface CouponChipProps {
  code: string;
  label: string;
  copiedLabel: string;
  tooltip: string;
  /** "overlay" fica sobre foto (fundo escuro translúcido) */
  tone?: 'overlay' | 'inline';
  sx?: SxProps<Theme>;
}

/** Cupom clicável: copia o código e troca o conteúdo por "copiado" com uma transição curta */
export default function CouponChip({ code, label, copiedLabel, tooltip, tone = 'inline', sx }: CouponChipProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copyText(code);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  const overlay = tone === 'overlay';

  return (
    <Tooltip title={tooltip} placement="top" disableInteractive>
      <ButtonBase
        onClick={handleCopy}
        aria-label={`${t.a11y.copyCoupon} ${code}`}
        sx={[
          {
            position: 'relative',
            overflow: 'hidden',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: 40,
            px: 2,
            borderRadius: 999,
            border: '1px dashed',
            borderColor: copied ? 'success.main' : tokens.goldA(0.6),
            // Sem backdrop-filter: desfoque sobre foto em movimento engasga o carrossel no celular
            backgroundColor: overlay ? 'rgba(8,9,11,0.82)' : tokens.goldA(0.06),
            fontFamily: font,
            transition: 'border-color .3s, background-color .3s',
            '@media (hover: hover)': {
              '&:hover': { borderColor: copied ? 'success.main' : tokens.gold, backgroundColor: overlay ? 'rgba(8,9,11,0.85)' : tokens.goldA(0.1) },
            },
            '&.Mui-focusVisible': { outline: `1px solid ${tokens.gold}`, outlineOffset: 2 },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {copied ? (
            <motion.span
              key="done"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#7FB685' }}
            >
              <Icon name="check" size={14} strokeWidth={1.6} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{copiedLabel}</span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.08em', color: tokens.muted }}>{label}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.06em', color: tokens.gold }}>{code}</span>
              <span style={{ color: tokens.faint }}>
                <Icon name="copy" size={13} />
              </span>
            </motion.span>
          )}
        </AnimatePresence>
        <span aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          {copied ? copiedLabel : ''}
        </span>
      </ButtonBase>
    </Tooltip>
  );
}
