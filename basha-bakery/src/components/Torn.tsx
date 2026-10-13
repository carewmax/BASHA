import { useMemo } from 'react';

/** Ripped-paper edge between sections. `fill` = colour of the section that follows. */
export function Torn({ fill, flip = false, seed = 3 }: { fill: string; flip?: boolean; seed?: number }) {
  const d = useMemo(() => {
    let s = seed * 9301 + 49297;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const w = 1440; const pts: string[] = [`M0 60 L0 ${22 + rnd() * 14}`];
    for (let x = 0; x <= w; x += 14 + rnd() * 18) pts.push(`L${x.toFixed(0)} ${(8 + rnd() * 30).toFixed(1)}`);
    pts.push(`L${w} ${22 + rnd() * 14} L${w} 60 Z`);
    return pts.join(' ');
  }, [seed]);
  return (
    <svg className={`torn ${flip ? 'torn-flip' : ''}`} viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={d} fill={fill} />
    </svg>
  );
}
