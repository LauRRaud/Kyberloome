import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://xn--kberloome-q9a.ee'),
  title: 'Küberloome — Ideest toimiva digilahenduseni',
  description: 'Loome tarkvara, SaaS-lahendusi ja veebilehti ning automatiseerime ettevõtete tööprotsesse.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="et"><body>{children}</body></html>;
}
