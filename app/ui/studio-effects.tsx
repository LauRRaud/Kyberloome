'use client';

import { useEffect } from 'react';

export default function StudioEffects() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('header');
    if (!header) return;
    let lastY = Math.max(0, window.scrollY);
    let travel = 0;
    let direction = 0;
    const onScroll = () => {
      const y = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - window.innerHeight));
      const delta = y - lastY;
      lastY = y;
      if (y <= header.offsetHeight) {
        header.classList.remove('header-hidden');
        travel = 0;
        return;
      }
      if (!delta) return;
      const nextDirection = Math.sign(delta);
      travel = nextDirection === direction ? travel + Math.abs(delta) : Math.abs(delta);
      direction = nextDirection;
      if (travel >= (direction > 0 ? 24 : 8)) {
        header.classList.toggle('header-hidden', direction > 0 && !header.contains(document.activeElement));
      }
    };
    const reveal = () => header.classList.remove('header-hidden');
    window.addEventListener('scroll', onScroll, { passive: true });
    header.addEventListener('focusin', reveal);
    return () => {
      window.removeEventListener('scroll', onScroll);
      header.removeEventListener('focusin', reveal);
      reveal();
    };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.product, .form-bottom .button'));
    const move = (event: PointerEvent) => {
      if (preference.matches || event.pointerType !== 'mouse') return;
      const card = event.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--light-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--light-y', `${event.clientY - rect.top}px`);
    };
    cards.forEach(card => card.addEventListener('pointermove', move));
    return () => {
      cards.forEach(card => card.removeEventListener('pointermove', move));
    };
  }, []);
  return null;
}
