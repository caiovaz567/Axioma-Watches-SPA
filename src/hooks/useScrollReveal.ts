import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options?: IntersectionObserverInit) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(prefersReduced);
  // Só o valor da montagem importa — evita re-observar a cada render
  // quando o caller passa um objeto literal.
  const optionsRef = useRef(options);

  useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, ...optionsRef.current }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return { ref, visible };
}

export function revealSx(visible: boolean, delay = 0) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(28px)',
    transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
  };
}
