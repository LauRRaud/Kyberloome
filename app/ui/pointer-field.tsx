'use client';

import { useEffect, useRef } from 'react';

export default function PointerField() {
  const field = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = field.current;
    const point = cursor.current;
    if (!surface || !point) return;
    const enabled = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let visible = false;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    const draw = () => {
      x += (targetX - x) * .18;
      y += (targetY - y) * .18;
      surface.style.setProperty('--pointer-x', `${x}px`);
      surface.style.setProperty('--pointer-y', `${y}px`);
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .2 ? requestAnimationFrame(draw) : 0;
    };
    const hide = () => {
      visible = false;
      surface.removeAttribute('data-visible');
      point.removeAttribute('data-visible');
      document.documentElement.removeAttribute('data-custom-cursor');
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const move = (event: PointerEvent) => {
      if (!enabled.matches || event.pointerType !== 'mouse') { hide(); return; }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) { x = targetX; y = targetY; }
      visible = true;
      point.style.transform = `translate3d(${targetX}px,${targetY}px,0)`;
      const interactive = event.target instanceof Element && event.target.closest('a,button,input,textarea,select,[role="button"]');
      point.toggleAttribute('data-interactive', Boolean(interactive));
      point.setAttribute('data-visible', '');
      surface.setAttribute('data-visible', '');
      document.documentElement.setAttribute('data-custom-cursor', '');
      if (!frame) frame = requestAnimationFrame(draw);
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

  return <>
    <div ref={field} className="pointer-field" aria-hidden="true">
      <div className="pointer-metal"/>
      <div className="pointer-grid"/>
      <div className="pointer-bits"><span>01</span><span>1</span><span>10</span><span>0</span><span>01</span><span>1</span></div>
    </div>
    <div ref={cursor} className="custom-cursor" aria-hidden="true"><span/></div>
  </>;
}
