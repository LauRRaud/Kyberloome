import type { Metadata } from 'next';
import DocumentLanguage from '../ui/document-language';

export const metadata: Metadata = {
  openGraph: { type: 'website', siteName: 'Küberloome', locale: 'en_GB', alternateLocale: ['et_EE'] },
};

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><DocumentLanguage lang="en"/>{children}</>;
}
