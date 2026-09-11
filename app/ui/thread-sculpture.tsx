type Stage = 'spiral' | 'orbit' | 'weave';

// The same top-down spiral remains the core as a ring and then a system form around it.
function filament(stage: 'spiral' | 'orbit', strand: number) {
  const across = strand / 23 * 2 - 1;
  const points = Array.from({ length: 241 }, (_, step) => {
    const progress = step / 240;
    const t = progress * Math.PI * (stage === 'spiral' ? 3.6 : 2) - Math.PI / 2;
    const spread = stage === 'spiral' ? Math.sin(progress * Math.PI) * 18 : 15;
    const radius = (stage === 'spiral' ? 14 + progress * 158 : 148) + across * spread;
    const angle = t + (stage === 'spiral' ? across * .13 : across * .05);
    return `${step === 0 ? 'M' : 'L'}${(260 + radius * Math.cos(angle)).toFixed(2)},${(260 + radius * Math.sin(angle)).toFixed(2)}`;
  });
  return points.join(' ') + (stage === 'spiral' ? '' : ' Z');
}

function Filaments({ stage }: { stage: 'spiral' | 'orbit' }) {
  return <>{Array.from({ length: 24 }, (_, i) => <path key={i} d={filament(stage, i)}/>)}</>;
}

export default function ThreadSculpture({ stage }: { stage: Stage }) {
  const light = `thread-${stage}-light`;
  return <div className={`thread-sculpture thread-sculpture--${stage}`} aria-hidden="true">
    <svg viewBox="0 0 520 520" fill="none" focusable="false">
      <defs>
        <linearGradient id={light} x1="95" y1="80" x2="420" y2="430" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity=".08"/><stop offset=".28" stopColor="#c7c7c7" stopOpacity=".42"/>
          <stop offset=".49" stopColor="#fff" stopOpacity=".85"/><stop offset=".7" stopColor="#c7c7c7" stopOpacity=".38"/><stop offset="1" stopColor="#fff" stopOpacity=".12"/>
        </linearGradient>
      </defs>
      <g className="thread-rotation">
        <g stroke={`url(#${light})`} strokeWidth=".8" strokeLinecap="round">
          {stage === 'spiral' ? <Filaments stage="spiral"/> : <>
            <Filaments stage="orbit"/>
            <g transform="translate(260 260) scale(.48) translate(-260 -260)"><Filaments stage="spiral"/></g>
          </>}
          {stage === 'weave' && <g className="thread-system">
            <circle cx="260" cy="260" r="198" strokeOpacity=".3"/>
            <circle cx="260" cy="260" r="105" strokeOpacity=".55"/>
            {Array.from({ length: 4 }, (_, i) => <g key={i} transform={`rotate(${i * 90} 260 260)`}>
              <path d="M 260 155 C 287 143 285 123 260 112 M 260 112 C 233 100 235 77 260 62" strokeOpacity=".7"/>
              <circle cx="260" cy="112" r="8" fill="#121212" stroke="#c8c8c8" strokeOpacity=".8"/>
              <circle cx="260" cy="112" r="2" fill="#ddd" stroke="none"/>
              <circle cx="260" cy="62" r="3" fill="#aaa" stroke="none"/>
            </g>)}
          </g>}
        </g>
      </g>
    </svg>
  </div>;
}
