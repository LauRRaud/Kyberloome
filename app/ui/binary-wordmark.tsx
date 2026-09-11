'use client';

import { useEffect, useRef } from 'react';

const wordmark = 'Kÿberloome';

export default function BinaryWordmark({ className }: { className: string }) {
  const link = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = link.current;
    if (!element) return;
    const cells = Array.from(element.querySelectorAll<HTMLElement>('.binary-value'));
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout> | undefined;
    let running = false;
    let revealed = false;

    const finish = () => {
      clearTimeout(timer);
      running = false;
      cells.forEach((cell, index) => {
        cell.textContent = wordmark[index];
        cell.removeAttribute('data-binary');
      });
    };
    const play = () => {
      if (running || preference.matches || document.hidden) return;
      running = true;
      const started = performance.now();
      const tick = () => {
        const elapsed = performance.now() - started;
        if (elapsed >= 1450) { finish(); return; }
        cells.forEach((cell, index) => {
          if (elapsed >= 350 + index * 115) {
            cell.textContent = wordmark[index];
            cell.removeAttribute('data-binary');
          } else {
            cell.textContent = Math.random() < .5 ? '0' : '1';
            cell.setAttribute('data-binary', '');
          }
        });
        timer = setTimeout(tick, 75);
      };
      tick();
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') play();
    };
    const onVisibility = () => { if (document.hidden) finish(); };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !revealed) { revealed = true; play(); }
      else if (!entry.isIntersecting) finish();
    }, { threshold: .6 });
    observer.observe(element);
    element.addEventListener('pointerenter', onPointer);
    element.addEventListener('focus', play);
    preference.addEventListener('change', finish);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      finish();
      observer.disconnect();
      element.removeEventListener('pointerenter', onPointer);
      element.removeEventListener('focus', play);
      preference.removeEventListener('change', finish);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <a ref={link} className={`${className} binary-wordmark`} href="#algus" aria-label="Küberloome — tagasi lehe algusesse">
    <span className="binary-text" aria-hidden="true">{Array.from(wordmark, (letter, index) =>
      <span className="binary-cell" key={index}><span className="binary-size">{letter}</span><span className="binary-value">{letter}</span></span>
    )}</span>
  </a>;
}
