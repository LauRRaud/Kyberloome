import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://xn--kberloome-q9a.ee'),
  title: 'Küberloome',
  description: 'Loome tarkvara, SaaS-lahendusi ja veebilehti ning automatiseerime ettevõtete tööprotsesse.',
  alternates: { canonical: '/', languages: { et: '/', en: '/en' } },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="et"><body>{children}</body></html>;
}
