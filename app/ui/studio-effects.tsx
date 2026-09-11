'use client';

import { useEffect } from 'react';

export default function StudioEffects() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const animations: Animation[] = [];
    const setup = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          animations.push(entry.target.animate([
            { opacity: 0.25, transform: 'translateY(22px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: 750, easing: 'cubic-bezier(.2,.7,.2,1)' }));
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.service, .product, .steps article, .manifesto h2, .idea .wrap, .contact, .footer-top').forEach(element => observer?.observe(element));
    };
    setup();
    preference.addEventListener('change', setup);
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
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      preference.removeEventListener('change', setup);
      cards.forEach(card => card.removeEventListener('pointermove', move));
    };
  }, []);
  return null;
}
