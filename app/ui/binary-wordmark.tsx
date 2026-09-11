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
      const shuffle = <T,>(values: T[]) => {
        for (let i = values.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [values[i], values[j]] = [values[j], values[i]];
        }
        return values;
      };
      const order = shuffle(cells.map((_, index) => index));
      const settlesAt = cells.map((_, index) => 850 + order[index] * 130 + Math.random() * 110);
      const tick = () => {
        const elapsed = performance.now() - started;
        if (elapsed >= 2300) { finish(); return; }
        const unresolved = cells.filter((_, index) => elapsed < settlesAt[index]);
        const bits = shuffle(unresolved.map((_, index) => index % 2 ? '1' : '0'));
        if (unresolved.every((cell, index) => cell.textContent === bits[index])) {
          bits.forEach((bit, index) => { bits[index] = bit === '0' ? '1' : '0'; });
        }
        let bitIndex = 0;
        cells.forEach((cell, index) => {
          if (elapsed >= settlesAt[index]) {
            cell.textContent = wordmark[index];
            cell.removeAttribute('data-binary');
          } else {
            cell.textContent = bits[bitIndex++];
            cell.setAttribute('data-binary', '');
          }
        });
        timer = setTimeout(tick, 100 + Math.random() * 40);
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
    <span className="binary-text" aria-hidden="true">
      <span className="binary-size">{wordmark}</span>
      <span className="binary-output">{Array.from(wordmark, (letter, index) =>
        <span className="binary-value" key={index}>{letter}</span>
      )}</span>
    </span>
  </a>;
}
