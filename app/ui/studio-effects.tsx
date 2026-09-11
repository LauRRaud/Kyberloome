'use client';

import { useEffect } from 'react';

export default function StudioEffects() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.product'));
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
