import type { Metadata } from 'next';
import ContactForm from '../ui/contact-form';
import LanguageFlag from '../ui/language-flag';
import StudioEffects from '../ui/studio-effects';
import BinaryWordmark from '../ui/binary-wordmark';
import CustomCursor from '../ui/custom-cursor';
import CursorGrid from '../ui/cursor-grid';
import DevelopmentVisual from '../ui/development-visual';
import limitNotchIcon from '../ui/limit-notch-icon.png';
import type { StaticImageData } from 'next/image';
import '../studio.css';

export const metadata: Metadata = {
  title: 'Küberloome — Software, SaaS and web development',
  description: 'We build software, SaaS products and websites, and automate business processes.',
  alternates: { canonical: '/en', languages: { et: '/', en: '/en' } },
};

const services = [
  ['Web solutions', 'Modern websites, landing pages, customer portals and web applications.'],
  ['Software development', 'Custom systems, admin environments and digital tools built around your business needs.'],
  ['SaaS solutions', 'Web-based software products offered through subscriptions or monthly plans.'],
  ['Automation & AI', 'Automating repetitive workflows and putting artificial intelligence to practical use.'],
];
const steps = [
  ['Discovery', 'We identify what actually needs to be solved.'],
  ['Planning', 'We define the features, user journey and technical approach.'],
  ['Development', 'We build in stages, so you can review the work as it progresses.'],
  ['Launch', 'We test, deploy and continue improving the solution when needed.'],
];
// Name, description, icon and Microsoft Store address; a row without the address reads "coming soon".
const apps: [string, string, StaticImageData, string?][] = [
  ['Limit Notch', 'A desktop widget that shows your Claude and ChatGPT usage limits.', limitNotchIcon],
];
function Arrow() { return <span className="link-arrow" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" focusable="false"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>; }
function Brand() { return <BinaryWordmark className="brand"/>; }

export default function EnglishHome() {
  return <>
    <StudioEffects/>
    <CustomCursor/>
    <CursorGrid color="#c8cdd3" cellSize={52} radius={115} maxOpacity={0.3} fillOpacity={0} holdTime={180} fadeDuration={700} clickPulse={false}/>
    <a className="skip" href="#content">Skip to main content</a>
    <header id="top"><div className="nav-wrap"><Brand/><nav aria-label="Main navigation"><a href="#services">Services</a><a href="#products">Products</a><a href="#process">How we work</a><a href="#contact">Contact</a></nav><div className="nav-actions"><a className="nav-cta" href="#contact">Tell us your idea <Arrow/></a><a className="language-link" href="/" lang="en" hrefLang="et" aria-label="Current language: English. Switch to Estonian." title="Switch to Estonian"><LanguageFlag locale="en"/><span>EN</span></a></div></div></header>
    <main id="content">
      <section className="hero wrap">
        <DevelopmentVisual stage="data"/>
        <h1>From an idea to a<br/><span className="muted">working digital solution.</span></h1>
        <p className="hero-copy">We build software, SaaS products and websites, and automate business processes.</p>
      </section>
      <section id="services" className="section wrap"><div className="section-heading"><div><p className="eyebrow">WHAT WE CREATE</p><h2>A good idea deserves<br/><span className="muted">a solution that works.</span></h2></div><p>We build digital tools<br/>that get real work done.</p></div><div className="services">{services.map(([title, description], i) => <article className="service" key={title}><span className="service-index" aria-hidden="true">0{i + 1}</span><div className="service-copy"><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
      <section id="products" className="section wrap"><div className="section-heading"><div><p className="eyebrow">OUR PRODUCTS</p><h2>We also create our own<br/><span className="muted">digital products.</span></h2></div><p>Ideas we have chosen to pursue.<br/>Solutions whose potential we believe in.</p></div><p className="product-group">Web platforms</p><div className="products"><article className="product"><div className="product-body"><div className="product-title"><h3>Ajasta</h3></div><p>Flexible booking software for service providers. Services, team members, calendars and customer bookings — all in your own brand.</p><a className="product-link" href="https://ajasta.ee" target="_blank" rel="noopener noreferrer">Visit ajasta.ee <Arrow/></a></div></article><article className="product"><div className="product-body"><div className="product-title"><h3>Sotsiaal.pro</h3></div><p>A digital platform for the social sector that makes information, services and opportunities easier to access.</p><a className="product-link" href="https://sotsiaal.pro" target="_blank" rel="noopener noreferrer">Visit sotsiaal.pro <Arrow/></a></div></article><article className="product"><div className="product-body"><div className="product-title"><h3>BeyondFrames</h3></div><p>An art and creative platform where artists, artworks and visual stories meet — a space that invites you to see creativity from a new perspective.</p><a className="product-link" href="https://beyondframes.art" target="_blank" rel="noopener noreferrer">Visit beyondframes.art <Arrow/></a></div></article></div><p className="product-group">Apps and games<span>For Windows · Microsoft Store</span></p><div className="apps">{apps.map(([title, description, icon, store]) => <article className="app" key={title}><h3><img src={icon.src} alt="" width={40} height={40}/>{title}</h3><p>{description}</p>{store ? <a className="app-link" href={store} target="_blank" rel="noopener noreferrer">Microsoft Store <Arrow/></a> : <span className="app-soon">Coming soon</span>}</article>)}</div><p className="apps-note"><a href="/en/privacy/apps">Privacy policy for apps and games</a></p></section>
      <section className="manifesto"><DevelopmentVisual stage="system"/><div className="wrap"><p className="eyebrow">LESS COMPLEXITY. MORE POSSIBILITY.</p><h2>Easy to use.<br/><span className="muted">Built securely.</span><br/><span className="lime">Ready to grow.</span></h2><span className="manifesto-star" aria-hidden="true">✳</span></div></section>
      <section id="process" className="section wrap"><div className="section-heading"><div><p className="eyebrow">HOW WE WORK</p><h2>From an idea to a<br/><span className="muted">finished solution.</span></h2></div><p>A clear process. Direct communication.<br/>You always know where we are heading.</p></div><div className="steps">{steps.map(([title, text], i) => <article key={title}><div className="step-number">0{i + 1}<span aria-hidden="true">{i === 3 ? '↗' : '→'}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="idea"><DevelopmentVisual stage="application"/><div className="wrap"><p className="eyebrow">CUSTOM SOLUTIONS</p><h2>Have an idea, but no<br/><span className="muted">technical plan?</span></h2><p>That is enough to get started. We help you refine the need, choose the right approach and turn it into a working website, software solution or SaaS product.</p><a className="text-link" href="#contact">Tell us your idea <Arrow/></a></div></section>
      <section id="contact" className="section contact wrap"><div><p className="eyebrow">LET'S TALK</p><h2>Let’s create something<br/><span className="muted">that works.</span></h2><p>In a few sentences, tell us what you want to create<br/>or which problem you would like to solve.</p><div className="contact-note">Every good solution starts with a conversation</div></div><ContactForm locale="en"/></section>
    </main>
    <footer className="studio-footer"><div className="wrap">
      <BinaryWordmark className="footer-wordmark"/>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Küberloome</span><span className="footer-disciplines">Software / SaaS / Web / Automation</span><div><a href="#contact">Contact</a><a href="/en/privacy">Privacy policy</a></div></div>
    </div></footer>
  </>;
}
