import ContactForm from './ui/contact-form';
import LanguageFlag from './ui/language-flag';
import StudioEffects from './ui/studio-effects';

import BinaryWordmark from './ui/binary-wordmark';
import CustomCursor from './ui/custom-cursor';
import CursorGrid from './ui/cursor-grid';
import DevelopmentVisual from './ui/development-visual';
import limitNotchIcon from './ui/limit-notch-icon.png';
import type { StaticImageData } from 'next/image';
import './studio.css';

const services = [
  ['Veebilahendused', 'Kaasaegsed kodulehed, maandumislehed, kliendiportaalid ja veebirakendused.'],
  ['Tarkvaraarendus', 'Ettevõtte vajadustele loodud süsteemid, halduskeskkonnad ja digitaalsed töövahendid.'],
  ['SaaS-lahendused', 'Veebipõhised tarkvaratooted, mida saab kasutada kuutasu või tellimuse alusel.'],
  ['Automatiseerimine & AI', 'Korduvate tööprotsesside automatiseerimine ning tehisintellekti praktiline kasutamine.'],
];
const steps = [
  ['Vajadus', 'Saame aru, mida on tegelikult vaja lahendada.'],
  ['Planeerimine', 'Paneme paika funktsioonid, kasutajateekonna ja tehnilise lahenduse.'],
  ['Arendus', 'Ehitame etappide kaupa. Tulemust saad jooksvalt kontrollida.'],
  ['Käivitamine', 'Testime, viime kasutusse ja arendame vajadusel edasi.'],
];
// Name, description, icon and Microsoft Store address; a row without the address reads "coming soon".
const apps: [string, string, StaticImageData, string?][] = [
  ['Limit Notch', 'Töölauavidin, mis näitab sinu Claude’i ja ChatGPT kasutuslimiite.', limitNotchIcon],
];
function Arrow() { return <span className="link-arrow" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" focusable="false"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>; }
function Brand() { return <BinaryWordmark className="brand"/>; }
export default function Home() {
  return <>
    <StudioEffects/>
    <CustomCursor/>
    <CursorGrid color="#c8cdd3" cellSize={52} radius={115} maxOpacity={0.3} fillOpacity={0} holdTime={180} fadeDuration={700} clickPulse={false}/>
    <a className="skip" href="#sisu">Liigu põhisisu juurde</a>
    <header id="algus"><div className="nav-wrap"><Brand/><nav aria-label="Peamenüü"><a href="#teenused">Teenused</a><a href="#tooted">Tooted</a><a href="#protsess">Kuidas töötame</a><a href="#kontakt">Kontakt</a></nav><div className="nav-actions"><a className="nav-cta" href="#kontakt">Räägi oma ideest <Arrow/></a><a className="language-link" href="/en" lang="et" hrefLang="en" aria-label="Praegune keel: eesti. Vaheta inglise keelele." title="Vaheta inglise keelele"><LanguageFlag locale="et"/><span>EE</span></a></div></div></header>
    <main id="sisu">
      <section className="hero wrap">
        <DevelopmentVisual stage="data"/>
        <h1>Ideest toimiva<br/><span className="muted">digilahenduseni.</span></h1>
        <p className="hero-copy">Loome tarkvara, SaaS-lahendusi ja veebilehti ning automatiseerime ettevõtete tööprotsesse.</p>
      </section>
      <section id="teenused" className="section wrap"><div className="section-heading"><div><p className="eyebrow">MIDA ME LOOME</p><h2>Hea idee väärib<br/><span className="muted">toimivat lahendust.</span></h2></div><p>Aitame ehitada digitaalseid tööriistu,<br/>mis teevad päriselt töö ära.</p></div><div className="services">{services.map(([title, description], i) => <article className="service" key={title}><span className="service-index" aria-hidden="true">0{i + 1}</span><div className="service-copy"><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
      <section id="tooted" className="section wrap"><div className="section-heading"><div><p className="eyebrow">MEIE TOOTED</p><h2>Loome ka oma<br/><span className="muted">digitooteid.</span></h2></div><p>Ideed, mille oleme ise ette võtnud.<br/>Lahendused, mille arengusse usume.</p></div><p className="product-group">Veebiplatvormid</p><div className="products"><article className="product"><div className="product-body"><div className="product-title"><h3>Ajasta</h3></div><p>Paindlik broneerimise tarkvara teenusepakkujatele. Teenused, töötajad, kalender ja kliendi broneerimine — ettevõtte enda kujundusega.</p><a className="product-link" href="https://ajasta.ee" target="_blank" rel="noopener noreferrer">Vaata ajasta.ee <Arrow/></a></div></article><article className="product"><div className="product-body"><div className="product-title"><h3>Sotsiaal.pro</h3></div><p>Sotsiaalvaldkonna digitaalne platvorm, mis aitab infot, teenuseid ja võimalusi paremini kättesaadavaks teha.</p><a className="product-link" href="https://sotsiaal.pro" target="_blank" rel="noopener noreferrer">Vaata sotsiaal.pro <Arrow/></a></div></article><article className="product"><div className="product-body"><div className="product-title"><h3>BeyondFrames</h3></div><p>Kunsti- ja loomeplatvorm, kus kohtuvad kunstnikud, teosed ja visuaalsed lood — ruum, mis kutsub loomingut uue nurga alt nägema.</p><a className="product-link" href="https://beyondframes.art" target="_blank" rel="noopener noreferrer">Vaata beyondframes.art <Arrow/></a></div></article></div><p className="product-group">Rakendused ja mängud<span>Windowsile · Microsoft Store</span></p><div className="apps">{apps.map(([title, description, icon, store]) => <article className="app" key={title}><h3><img src={icon.src} alt="" width={40} height={40}/>{title}</h3><p>{description}</p>{store ? <a className="app-link" href={store} target="_blank" rel="noopener noreferrer">Microsoft Store <Arrow/></a> : <span className="app-soon">Tulekul</span>}</article>)}</div><p className="apps-note"><a href="/privaatsus/rakendused">Rakenduste ja mängude privaatsustingimused</a></p></section>
      <section className="manifesto"><DevelopmentVisual stage="system"/><div className="wrap"><p className="eyebrow">VÄHEM KEERUKUST. ROHKEM VÕIMALUSI.</p><h2>Lihtne kasutada.<br/><span className="muted">Turvaliselt ehitatud.</span><br/><span className="lime">Kasvamiseks valmis.</span></h2><span className="manifesto-star" aria-hidden="true">✳</span></div></section>
      <section id="protsess" className="section wrap"><div className="section-heading"><div><p className="eyebrow">KUIDAS TÖÖTAME</p><h2>Ideest valmis<br/><span className="muted">lahenduseni.</span></h2></div><p>Selge protsess. Vahetu suhtlus.<br/>Igas etapis tead, kuhu liigume.</p></div><div className="steps">{steps.map(([title, text], i) => <article key={title}><div className="step-number">0{i + 1}<span aria-hidden="true">{i === 3 ? '↗' : '→'}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="idea"><DevelopmentVisual stage="application"/><div className="wrap"><p className="eyebrow">ERITELLIMUSEL LAHENDUSED</p><h2>Sul on idee, aga mitte<br/><span className="muted">tehnilist plaani?</span></h2><p>Sellest piisab. Aitame vajaduse läbi mõelda, valida sobiva lahenduse ja ehitada sellest toimiva veebilehe, tarkvara või SaaS-toote.</p><a className="text-link" href="#kontakt">Räägi oma ideest <Arrow/></a></div></section>
      <section id="kontakt" className="section contact wrap"><div><p className="eyebrow">VÕTAME ÜHENDUST</p><h2>Loome midagi<br/><span className="muted">toimivat.</span></h2><p>Kirjelda paari lausega, mida soovid teha<br/>või millist probleemi tahad lahendada.</p><div className="contact-note">Iga hea lahendus algab vestlusest</div></div><ContactForm/></section>
    </main>
    <footer className="studio-footer"><div className="wrap">
      <BinaryWordmark className="footer-wordmark"/>
      <div className="footer-bottom"><span className="footer-company">© {new Date().getFullYear()} OÜ Küberloome<small>Registrikood 14206225 · Harku vald, Harjumaa</small></span><span className="footer-disciplines">Tarkvara / SaaS / Veeb / Automatiseerimine</span><div><a href="#kontakt">Kontakt</a><a href="/privaatsus">Privaatsustingimused</a></div></div>
    </div></footer>
  </>;
}



