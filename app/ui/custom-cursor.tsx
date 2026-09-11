'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const point = cursor.current;
    if (!point) return;
    const enabled = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const hide = () => {
      point.removeAttribute('data-visible');
      document.documentElement.removeAttribute('data-custom-cursor');
    };
    const move = (event: PointerEvent) => {
      if (!enabled.matches || event.pointerType !== 'mouse') { hide(); return; }
      point.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      const interactive = event.target instanceof Element && event.target.closest('a,button,input,textarea,select,[role="button"]');
      point.toggleAttribute('data-interactive', Boolean(interactive));
      point.setAttribute('data-visible', '');
      document.documentElement.setAttribute('data-custom-cursor', '');
    };
    const onVisibility = () => { if (document.hidden) hide(); };
    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    document.addEventListener('visibilitychange', onVisibility);
    enabled.addEventListener('change', hide);
    return () => {
      hide();
      document.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      document.removeEventListener('visibilitychange', onVisibility);
      enabled.removeEventListener('change', hide);
    };
  }, []);

  return <div ref={cursor} className="custom-cursor" aria-hidden="true"><span/></div>;
}
