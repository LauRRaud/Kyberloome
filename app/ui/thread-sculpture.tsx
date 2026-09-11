type Stage = 'spiral' | 'orbit' | 'weave';

// One ribbon throughout: straight and twisted, bent into a loop, then twisted again.
// Coordinates are generated on the server; only the finished SVG rotates in CSS.
function filament(stage: Stage, strand: number) {
  const across = strand / 23 * 2 - 1;
  const closed = stage !== 'spiral';
  const twists = stage === 'weave' ? 2 : 1;
  const halfWidth = closed ? 46 : 100;
  const points = Array.from({ length: 241 }, (_, step) => {
    const t = (step / 240 - .5) * Math.PI * 2;
    const taper = closed ? 1 : Math.pow(Math.sin(step / 240 * Math.PI), .6);
    const offset = across * halfWidth * taper * Math.cos(twists * t + .45);
    const z = across * halfWidth * taper * Math.sin(twists * t + .45);
    // Bending the ribbon's centre line into a circle preserves the strand order.
    // The final stage keeps that same circle and adds one turn to the ribbon.
    const x = closed ? (132 + offset) * Math.cos(t) : offset;
    const y = closed ? (132 + offset) * Math.sin(t) : t / Math.PI * 170;
    const tilt = stage === 'spiral' ? .18 : .48;
    const px = x * .96 + z * .28;
    const py = y * Math.cos(tilt) - z * Math.sin(tilt);
    return `${step === 0 ? 'M' : 'L'}${(260 + px).toFixed(2)},${(260 + py).toFixed(2)}`;
  });
  return points.join(' ') + (stage === 'spiral' ? '' : ' Z');
}

export default function ThreadSculpture({ stage }: { stage: Stage }) {
  const light = `thread-${stage}-light`;
  const fade = `thread-${stage}-fade`;
  return <div className={`thread-sculpture thread-sculpture--${stage}`} aria-hidden="true">
    <svg viewBox="0 0 520 520" fill="none" focusable="false">
      <defs>
        <linearGradient id={light} x1="95" y1="80" x2="420" y2="430" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity=".08"/><stop offset=".28" stopColor="#c7c7c7" stopOpacity=".42"/>
          <stop offset=".49" stopColor="#fff" stopOpacity=".85"/><stop offset=".7" stopColor="#c7c7c7" stopOpacity=".38"/><stop offset="1" stopColor="#fff" stopOpacity=".12"/>
        </linearGradient>
        <linearGradient id={fade} x1="0" y1="90" x2="0" y2="430" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0"/><stop offset=".12" stopColor="white"/><stop offset=".88" stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/>
        </linearGradient>
        <mask id={`${fade}-mask`}><rect width="520" height="520" fill={`url(#${fade})`}/></mask>
      </defs>
      <g className="thread-rotation">
        <g stroke={`url(#${light})`} strokeWidth=".8" strokeLinecap="round" mask={stage === 'spiral' ? `url(#${fade}-mask)` : undefined}>
          {Array.from({ length: 24 }, (_, i) => <path key={i} d={filament(stage, i)}/>)}
        </g>
      </g>
    </svg>
  </div>;
}
