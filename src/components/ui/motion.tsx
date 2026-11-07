import { Fragment, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { motion, useScroll, useTransform } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';
import { ease } from '../../theme';
import { scrollFxEnabled, cssScrollFx } from '../../lib/scroll';

const VIEWPORT = { once: true, margin: '0px 0px -10% 0px' } as const;

type RevealProps = HTMLMotionProps<'div'> & { delay?: number; y?: number };

/** Sobe e aparece quando entra na tela (uma vez só) */
export function Reveal({ delay = 0, y = 40, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 1, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Título que entra palavra por palavra (sobe + aparece) */
export function Words({ text, delay = 0, immediate = false }: { text: string; delay?: number; immediate?: boolean }) {
  const trigger = immediate ? { animate: 'show' as const } : { whileInView: 'show' as const, viewport: VIEWPORT };
  return (
    <>
    {/* Texto real para leitor de tela; as palavras animadas são só visuais */}
    <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>{text}</span>
    <motion.span initial="hidden" {...trigger} aria-hidden style={{ display: 'inline' }}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
            <motion.span
              style={{ display: 'inline-block' }}
              variants={{
                hidden: { y: '100%', opacity: 0 },
                show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease, delay: delay + i * 0.06 } },
              }}
            >
              {w}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </motion.span>
    </>
  );
}

interface BleedImageProps {
  src?: string;
  alt?: string;
  /** Arte em vetor no lugar da foto (mesmas animações de abertura/zoom) */
  art?: ReactNode;
  /** Altura (aceita objeto responsivo do MUI: { xs, md }) */
  height: Record<string, string | number> | string;
  objectPosition?: string;
  /** Conteúdo por cima da foto (título, botões) */
  children?: ReactNode;
  /** Gradiente por cima da foto para o texto ler bem */
  overlay?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Foto de ponta a ponta. Ela entra como um cartão com bordas arredondadas e,
 * conforme a página rola, se abre até ocupar a largura inteira da tela,
 * enquanto a imagem dentro faz um zoom-out suave.
 */
export function BleedImage({ src, alt = '', art, height, objectPosition = 'center', children, overlay, loading = 'lazy' }: BleedImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [fx] = useState(scrollFxEnabled);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ['inset(0% 5% 0% 5% round 28px)', 'inset(0% 0% 0% 0% round 0px)'],
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

  return (
    <Box ref={ref} className="sd-bleed" sx={{ position: 'relative', height, overflow: 'hidden' }}>
      <motion.div
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', ...(fx ? { clipPath } : {}) }}
        {...(fx
          ? {}
          : {
              initial: { clipPath: 'inset(0% 5% 0% 5% round 28px)' },
              whileInView: { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
              viewport: { once: true, amount: 0.25 },
              transition: { duration: 1.4, ease },
            })}
      >
        {art ? (
          <motion.div
            className={cssScrollFx ? 'sd-bleed-img' : undefined}
            style={{ position: 'absolute', inset: 0, willChange: 'transform', ...(cssScrollFx ? {} : { scale }) }}
          >
            {art}
          </motion.div>
        ) : (
          <motion.img
            src={src}
            alt={alt}
            loading={loading}
            className={cssScrollFx ? 'sd-bleed-img' : undefined}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, willChange: 'transform', ...(cssScrollFx ? {} : { scale }) }}
          />
        )}
        {overlay && <div aria-hidden style={{ position: 'absolute', inset: 0, background: overlay }} />}
        {children && <Box sx={{ position: 'absolute', inset: 0 }}>{children}</Box>}
      </motion.div>
    </Box>
  );
}
