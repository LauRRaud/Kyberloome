import DocumentLanguage from '../ui/document-language';

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><DocumentLanguage lang="en"/>{children}</>;
}
