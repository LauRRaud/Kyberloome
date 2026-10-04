export default function LanguageFlag({ locale }: { locale: 'en' | 'et' }) {
  return <svg className="language-flag" viewBox="0 0 60 40" aria-hidden="true" focusable="false">
    {locale === 'et' ? <>
      <path fill="#4891d9" d="M0 0h60v14H0z"/>
      <path fill="#161616" d="M0 14h60v13H0z"/>
      <path fill="#fff" d="M0 27h60v13H0z"/>
    </> : <>
      <path fill="#16356b" d="M0 0h60v40H0z"/>
      <path stroke="#fff" strokeWidth="8" d="m0 0 60 40M60 0 0 40"/>
      <path stroke="#cf3045" strokeWidth="3" d="m0 0 60 40M60 0 0 40"/>
      <path stroke="#fff" strokeWidth="13" d="M30 0v40M0 20h60"/>
      <path stroke="#cf3045" strokeWidth="7" d="M30 0v40M0 20h60"/>
    </>}
  </svg>;
}
