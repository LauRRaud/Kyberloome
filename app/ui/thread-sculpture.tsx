type Stage = 'spiral' | 'orbit' | 'weave';

// A single family of filaments: an open helix, a closed torus, then a torus knot.
// Coordinates are generated on the server; only the finished SVG rotates in CSS.
function filament(stage: Stage, strand: number) {
  const phase = strand / 24 * Math.PI * 2;
  const points = Array.from({ length: 241 }, (_, step) => {
    const t = step / 240 * Math.PI * 2;
    let x: number, y: number, z: number;
    if (stage === 'spiral') {
      const angle = t * 1.12 - Math.PI * 1.12;
      const radius = 105 + 24 * Math.cos(phase);
      x = radius * Math.sin(angle);
      y = (step / 240 - .5) * 330;
      z = radius * Math.cos(angle) + 24 * Math.sin(phase);
    } else {
      const knot = stage === 'weave';
      const tube = knot ? 38 : 27;
      const radius = (knot ? 112 : 137) + tube * Math.cos((knot ? 3 * t : t) + phase * (knot ? .12 : 1));
      x = radius * Math.cos(t * (knot ? 2 : 1));
      y = radius * Math.sin(t * (knot ? 2 : 1));
      z = tube * Math.sin((knot ? 3 * t : t) + phase * (knot ? .12 : 1));
      if (knot) { x += 12 * Math.cos(phase) * Math.cos(2 * t); y += 12 * Math.cos(phase) * Math.sin(2 * t); z += 12 * Math.sin(phase); }
    }
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
