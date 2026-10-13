import type { SVGProps } from 'react';

const P: Record<string, string> = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4.2-4.2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8c0-3.9 3.1-6 7-6s7 2.1 7 6',
  cart: 'M3 4h2.2l2 11h10.4l2-8H6.2M9.5 20a1 1 0 1 0 0-.01M16.5 20a1 1 0 1 0 0-.01',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  x: 'M6 6l12 12M18 6 6 18',
  chevL: 'M15 5l-7 7 7 7',
  chevR: 'M9 5l7 7-7 7',
  arrowR: 'M4 12h15M13 6l6 6-6 6',
  arrowL: 'M20 12H5M11 6l-6 6 6 6',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-14v5l3 2',
  camera: 'M4 8h3l1.5-2h7L17 8h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  leaf: 'M5 19c0-8 5-14 15-14 0 9-5 15-13 14M5 19c3-5 6-8 10-10',
  heart: 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.7A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z',
  smile: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 14a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01',
  chef: 'M7 14a3.5 3.5 0 0 1-1-6.8A4.5 4.5 0 0 1 12 4a4.5 4.5 0 0 1 6 3.2A3.5 3.5 0 0 1 17 14M7 14h10v6H7z',
  home: 'M4 11l8-7 8 7M6 10v10h12V10M10 20v-5h4v5',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  upload: 'M12 16V4M7 9l5-5 5 5M5 20h14',
  download: 'M12 4v12M7 11l5 5 5-5M5 20h14',
  alert: 'M12 4 2.5 20h19zM12 10v4.5M12 17.5h.01',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  // food categories
  salads: 'M3 12h18a9 9 0 0 1-18 0zM7 9c0-2.5 2-3.5 3.5-3 1-2 4-2 4.5.5 2.2-.2 3 2 2.5 3M9 9.5l1.5 2M14 9l-1 2.5',
  pasta: 'M3 12h18a9 9 0 0 1-18 0zM8 9c0-2 2-2 2-4M12.5 9c0-2 2-2 2-4M17 9c0-1.5 1-1.5 1-3',
  pizza: 'M12 21 3.5 6.2a17 17 0 0 1 17 0zM3.5 6.2c1.5-1.4 4.5-2.2 8.5-2.2s7 .8 8.5 2.2M10 9.5h.01M14 11h.01M12 15h.01',
  burgers: 'M4 10a8 5.2 0 0 1 16 0zM3 13h18M4 15.8c2 1.4 3-1 5 0s3 1.4 5 0 4 1 6 0M5 18.5h14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z',
  chicken: 'M14.5 4a5 5 0 0 1 3.6 8.4l-3.2 3.2-7-7 3.2-3.2A5 5 0 0 1 14.5 4zM7.9 15.1 4.5 18.5M5 20a1.8 1.8 0 1 0 2.8-2.2M3.5 17.5A1.8 1.8 0 1 0 6 20.3',
  sides: 'M6.5 10 8 20h8l1.5-10zM8.5 10V5M11 10V3M13.5 10V5M16 10V6',
  omelettes: 'M3 13.5c0-4 4-7 9-7s9 3 9 7-4 5-9 5-9-1-9-5zM12 16a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z',
  pies: 'M3 15h18M4 15c0-5 4-8 8-8s8 3 8 8M5 15l1 4.5h12l1-4.5M9.5 11l1 2M14 10l1 3',
  party: 'M4 9h16v4H4zM5 13h14v7H5zM12 9v11M12 9C10 5 7 6 8 7.5 9 9 12 9 12 9zm0 0c2-4 5-3 4-1.5C15 9 12 9 12 9z',
};

export type IconName = keyof typeof P;

export function Icon({ name, size = 22, ...rest }: { name: string; size?: number } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      <path d={P[name] || P.plus} />
    </svg>
  );
}

export const StarFill = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d={P.star} fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" /></svg>
);

export function Social({ name, size = 22 }: { name: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp'; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (name === 'instagram') return <svg {...common}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></svg>;
  if (name === 'facebook') return <svg {...common}><path d="M14 8h2.5V4.5H14a4 4 0 0 0-4 4V11H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3V9a1 1 0 0 1 1-1z" /></svg>;
  if (name === 'tiktok') return <svg {...common}><path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.4 2 3.8 4.5 4" /></svg>;
  return <svg {...common}><path d="M4 20l1.2-4A8 8 0 1 1 8.3 19zM9 9c0 3 3 6 6 6l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z" /></svg>;
}
