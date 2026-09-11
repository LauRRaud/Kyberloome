import { useId } from 'react';

type Stage = 'data' | 'system' | 'application';

export default function DevelopmentVisual({ stage }: { stage: Stage }) {
  const id = useId().replace(/:/g, '');
  const surface = `url(#${id}-surface)`;
  const edge = `url(#${id}-edge)`;
  const plane = 'matrix(.92 .46 -.92 .46 240 76)';
  return <div className={`development-visual development-visual--${stage}`} aria-hidden="true">
    <svg viewBox="0 0 480 380" fill="none">
      <defs>
        <linearGradient id={`${id}-surface`} x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#44494e"/><stop offset=".45" stopColor="#202326"/><stop offset="1" stopColor="#111315"/>
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e0e4e8"/><stop offset=".48" stopColor="#787f85"/><stop offset="1" stopColor="#353a3e"/>
        </linearGradient>
      </defs>
      <path d="M40 249 240 349 440 249M80 269v12m320-12v12" stroke="#34383c" strokeWidth=".7"/>
      <path d="M240 349v-25" stroke="#72797f" strokeWidth=".7"/>
      <g className="development-float">
        {stage === 'data' && <>
          <g transform="matrix(.92 .46 -.92 .46 240 108)" stroke="#52595f" strokeWidth=".7" strokeDasharray="3 7">
            <rect x="-10" y="-10" width="220" height="220"/>
            <path d="M63-10v220M137-10v220M-10 63h220M-10 137h220"/>
          </g>
          {[[-12,5,-18],[76,-8,-30],[153,12,-6],[-3,77,-2],[74,76,-18],[156,84,-28],[7,151,-22],[82,162,-4],[160,158,-15]].map(([x,y,lift],i) =>
            <g key={i} transform={`translate(0 ${lift})`}>
              <g transform={plane}>
                <rect x={x} y={y+5} width="48" height="48" fill="#111315" stroke="#454b50"/>
                <rect x={x} y={y} width="48" height="48" fill={surface} stroke={edge}/>
                <path d={`M${x+9} ${y+33}h${i%2?22:30}`} stroke="#68737c" strokeWidth="1"/>
                <text x={x+9} y={y+22} fill="#d0d6dc" fontFamily="monospace" fontSize="12" letterSpacing="2">{i%3===0?'01':i%3===1?'10':'11'}</text>
              </g>
            </g>
          )}
        </>}
        {stage === 'system' && <>
          {[48,24,0].map((lift,i) => <g key={lift} transform={`translate(0 ${lift})`}>
            <g transform={plane}>
              <rect width="200" height="200" rx="3" fill={surface} stroke={edge} opacity={i===2?1:.7}/>
              {i<2 && <path d="M14 182h36m8 0h8m8 0h8" stroke="#7b858f" strokeWidth="2"/>}
            </g>
          </g>)}
          <g transform={plane}>
            <g stroke="#626d77" strokeWidth="1.2"><path d="M48 48h104v104H48ZM48 100h104M100 48v104"/></g>
            <path className="development-signal" d="M48 48h104v104H48V48" stroke="#dbe3eb" strokeWidth="2" strokeDasharray="18 398"/>
            {[[25,25],[129,25],[25,129],[129,129]].map(([x,y],i)=><g key={i}>
              <rect x={x} y={y} width="46" height="46" rx="2" fill={surface} stroke={edge}/>
              <path d={`M${x+11} ${y+16}h24m-24 7h17m-17 7h21`} stroke="#a5afb8" strokeWidth="2"/>
            </g>)}
            <rect x="81" y="81" width="38" height="38" fill="#c4cdd4" stroke="#e4e9ee"/>
            <path d="m95 91-8 9 8 9m10-18 8 9-8 9" stroke="#343c43" strokeWidth="2"/>
          </g>
        </>}
        {stage === 'application' && <>
          <g transform="matrix(.92 .46 -.92 .46 240 120)"><rect width="200" height="200" rx="3" fill={surface} stroke={edge}/><path d="M15 182h34m8 0h8" stroke="#9ba6ae" strokeWidth="2"/></g>
          <g transform="matrix(.92 .46 -.92 .46 240 98)"><rect width="200" height="200" rx="3" fill="#171b1e" stroke="#66717b"/></g>
          <g transform={plane}>
            <rect width="200" height="200" rx="4" fill={surface} stroke={edge}/>
            <path d="M0 25h200M44 25v175" stroke="#727c85"/>
            {[12,21,30].map(x=><circle key={x} cx={x} cy="12" r="2" fill="#bdc6ce"/>)}
            <path d="M12 44h20m-20 13h14m-14 13h17m-17 13h12" stroke="#929ca6" strokeWidth="2"/>
            <rect x="57" y="40" width="128" height="50" rx="2" fill="#c5cdd4"/>
            <path d="M68 54h49m-49 10h30m-30 12h70" stroke="#4d5963" strokeWidth="3"/>
            <path d="m152 64 8 8 16-19" stroke="#46545f" strokeWidth="3"/>
            <rect x="57" y="104" width="58" height="42" rx="2" stroke="#828e99"/>
            <rect x="127" y="104" width="58" height="42" rx="2" stroke="#828e99"/>
            <path d="M67 134v-9m10 9v-17m10 17v-12m10 12v-22" stroke="#bcc7d0" strokeWidth="4"/>
            <path className="development-signal" d="m136 134 11-13 10 5 18-15" stroke="#d5e0e8" strokeWidth="2" strokeDasharray="16 50"/>
            <path d="M57 162h128m-128 10h92m-92 10h110" stroke="#63717c" strokeWidth="2"/>
          </g>
        </>}
      </g>
    </svg>
  </div>;
}
