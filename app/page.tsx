import ContactForm from './ui/contact-form';

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
function Arrow() { return <span aria-hidden="true">↗</span>; }
function Brand() { return <a className="brand" href="#algus" aria-label="Kÿberloome — avalehe algusesse">Kÿberloome</a>; }
export default function Home() {
  return <>
    <a className="skip" href="#sisu">Liigu põhisisu juurde</a>
    <header id="algus"><div className="nav-wrap"><Brand/><nav aria-label="Peamenüü"><a href="#teenused">Teenused</a><a href="#tooted">Tooted</a><a href="#protsess">Kuidas töötame</a><a href="#kontakt">Kontakt</a></nav><a className="nav-cta" href="#kontakt">Räägi oma ideest <Arrow/></a></div></header>
    <main id="sisu">
      <section className="hero wrap">
        <h1>Ideest toimiva<br/><span className="muted">digilahenduseni.</span></h1>
        <p className="hero-copy">Loome tarkvara, SaaS-lahendusi ja veebilehti ning automatiseerime ettevõtete tööprotsesse.</p>
      </section>
      <section id="teenused" className="section wrap"><div className="section-intro"><p className="eyebrow">01 / MIDA ME LOOME</p><h2>Hea idee väärib<br/>toimivat lahendust.</h2><p>Aitame ehitada digitaalseid tööriistu,<br/>mis teevad päriselt töö ära.</p></div><div className="services">{services.map(([title, description], i) => <article className="service" key={title}><div className="service-copy"><h3><span className="service-index">0{i + 1}</span>{title}</h3><p>{description}</p></div></article>)}</div></section>
      <section id="tooted" className="section wrap"><div className="section-heading"><div><p className="eyebrow">02 / MEIE TOOTED</p><h2>Loome ka oma<br/><span className="muted">digitooteid.</span></h2></div><p>Ideed, mille oleme ise ette võtnud.<br/>Lahendused, mille arengusse usume.</p></div><div className="products"><article className="product"><div className="product-body"><div className="product-title"><h3>Ajasta</h3><span className="badge">Arendamisel</span></div><p>Paindlik broneerimise tarkvara teenusepakkujatele. Teenused, töötajad, kalender ja kliendi broneerimine — ettevõtte enda kujundusega.</p><a className="product-link" href="https://ajasta.ee" target="_blank" rel="noopener noreferrer">Vaata ajasta.ee <Arrow/></a></div></article><article className="product"><div className="product-body"><div className="product-title"><h3>SotsiaalAI</h3><span className="badge">Arendamisel</span></div><p>Sotsiaalvaldkonna digitaalne lahendus, mis aitab infot, teenuseid ja võimalusi paremini kättesaadavaks teha.</p><a className="product-link" href="https://sotsiaal.ai" target="_blank" rel="noopener noreferrer">Vaata sotsiaal.ai <Arrow/></a></div></article><article className="product"><div className="product-body"><div className="product-title"><h3>BeyondFrames</h3><span className="badge">Arendamisel</span></div><p>Kunsti- ja loomeplatvorm, kus kohtuvad kunstnikud, teosed ja visuaalsed lood — ruum, mis kutsub loomingut uue nurga alt nägema.</p><a className="product-link" href="https://beyondframes.art" target="_blank" rel="noopener noreferrer">Vaata beyondframes.art <Arrow/></a></div></article></div></section>
      <section className="manifesto"><div className="wrap"><p className="eyebrow">VÄHEM KEERUKUST. ROHKEM VÕIMALUSI.</p><h2>Lihtne kasutada.<br/><span className="muted">Turvaliselt ehitatud.</span><br/><span className="lime">Kasvamiseks valmis.</span></h2><span className="manifesto-star" aria-hidden="true">✳</span></div></section>
      <section id="protsess" className="section wrap"><div className="section-heading"><div><p className="eyebrow">03 / KUIDAS TÖÖTAME</p><h2>Ideest valmis<br/>lahenduseni.</h2></div><p>Selge protsess. Vahetu suhtlus.<br/>Igas etapis tead, kuhu liigume.</p></div><div className="steps">{steps.map(([title, text], i) => <article key={title}><div className="step-number">0{i + 1}<span aria-hidden="true">{i === 3 ? '↗' : '→'}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="idea wrap"><span className="idea-icon" aria-hidden="true">↗</span><div><p className="eyebrow">ERITELLIMUSEL LAHENDUSED</p><h2>Sul on idee, aga mitte<br/>tehnilist plaani?</h2><p>Sellest piisab. Aitame vajaduse läbi mõelda, valida sobiva lahenduse ja ehitada sellest toimiva veebilehe, tarkvara või SaaS-toote.</p><a className="text-link" href="#kontakt">Räägi oma ideest <Arrow/></a></div></section>
      <section id="kontakt" className="section contact wrap"><div><p className="eyebrow">04 / VÕTAME ÜHENDUST</p><h2>Loome midagi<br/><span className="lime">toimivat.</span></h2><p>Kirjelda paari lausega, mida soovid teha<br/>või millist probleemi tahad lahendada.</p><div className="contact-note"><span className="status-dot"/> Iga hea lahendus algab vestlusest.</div></div><ContactForm/></section>
    </main>
    <footer className="wrap"><div className="footer-top"><Brand/><span>Tarkvara · SaaS · Veebilahendused · Automatiseerimine</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Küberloome</span><span>Teenusepakkuja: SotsiaalAI OÜ · 14206225 · Eesti</span><div><a href="#kontakt">Kontakt</a><a href="/privaatsus">Privaatsustingimused</a></div></div></footer>
  </>;
}



