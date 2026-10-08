import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rakenduste ja mängude privaatsustingimused — Küberloome',
  description: 'Kuidas Küberloome Microsoft Store’is avaldatud rakendused ja mängud sinu andmeid käsitlevad.',
  alternates: { canonical: '/privaatsus/rakendused', languages: { et: '/privaatsus/rakendused', en: '/en/privacy/apps' } },
};

export default function AppsPrivacy() {
  return (
    <main className="wrap privacy">
      <a href="/">← Tagasi avalehele</a>
      <p className="eyebrow">KÜBERLOOME</p>
      <h1>Rakenduste ja mängude privaatsustingimused</h1>
      <p className="updated">Viimati uuendatud: 3. oktoober 2026</p>

      <p>Need tingimused kehtivad rakendustele ja mängudele, mille Küberloome avaldab Microsoft Store’is. Nende toodete väljaandja ja isikuandmete töötlemise korral vastutav töötleja on OÜ Küberloome (varem SotsiaalAI OÜ; registrikood 14206225, Eesti). Selle veebilehe enda andmekäsitlust kirjeldavad <a href="/privaatsus">veebilehe privaatsustingimused</a>.</p>

      <h2>Lühidalt</h2>
      <p>Meie rakendused ja mängud on tehtud töötama sinu seadmes. Kui allpool konkreetse toote juures pole öeldud teisiti, siis need:</p>
      <ul>
        <li>ei nõua meie juures konto loomist;</li>
        <li>ei kogu isikuandmeid ega saada meile mingeid andmeid;</li>
        <li>ei sisalda reklaami ega kolmandate osapoolte analüütikat või jälgimist;</li>
        <li>ei müü ega anna sinu andmeid kellelegi edasi.</li>
      </ul>

      <h2>Mis jääb sinu seadmesse</h2>
      <p>Seaded, eelistused, mängude salvestused ja muu sarnane hoitakse sinu seadmes, toote enda andmekaustas. Meil neile ligipääsu ei ole. Toote eemaldamisel see kustub; andmekausta jäänud failid saad soovi korral ise kustutada.</p>

      <h2>Internetiühendused</h2>
      <p>Vaikimisi meie tooted ise internetiühendusi ei loo. Kui toode töötab koos mõne teise teenuse või programmiga – näiteks loeb selle programmi faile sinu seadmes või küsib infot sinu arvutisse paigaldatud programmilt –, on see kirjas allpool toote enda jaotises. Selliseid teenuseid ja programme pakuvad nende omanikud oma tingimuste ja privaatsuspõhimõtete alusel ning nende vahetatav info meieni ei jõua.</p>

      <h2>Microsoft Store</h2>
      <p>Allalaadimisi, oste, litsentse ja uuendusi haldab Microsoft. Microsoft võib meile anda koondstatistikat, mis sind ei tuvasta, näiteks allalaadimiste arvu ja krahhiaruandeid. Poes avaldatud hinnanguid ja arvustusi näeme samamoodi nagu kõik teised. Sinu makseandmeid me ei saa.</p>
      <p>Kui mäng kasutab Xboxi teenuseid, näiteks saavutusi või pilvesalvestust, pakub neid Microsoft. Seda, kuidas Microsoft sinu andmeid käsitleb, kirjeldab <a href="https://privacy.microsoft.com/privacystatement" rel="noopener noreferrer">Microsofti privaatsusavaldus</a>.</p>

      <h2>Kui võtad meiega ühendust</h2>
      <p>Kui kirjutad meile kasutajatoe saamiseks, kasutame sinu kontaktandmeid ja sõnumit ainult sulle vastamiseks ning säilitame kirjavahetust mitte kauem, kui on vaja küsimuse lahendamiseks.</p>

      <h2>Lapsed</h2>
      <p>Kuna meie tooted isikuandmeid ei kogu, ei kogu need neid ka lastelt.</p>

      <h2>Sinu õigused</h2>
      <p>Isikuandmete kaitse üldmääruse järgi on sul õigus küsida ligipääsu oma isikuandmetele, lasta neid parandada või kustutada, piirata nende töötlemist või esitada sellele vastuväide ning saada andmed ülekantaval kujul. Kuna meie tooted meile isikuandmeid ei saada, ei ole meil sinu kohta üldjuhul andmeid; kui oled meiega ühendust võtnud, kehtivad need õigused selle kirjavahetuse kohta.</p>
      <p>Oma õiguste kasutamiseks või küsimuse esitamiseks kirjuta meile <a href="/#kontakt">kontaktivormi</a> kaudu. Sul on ka õigus esitada kaebus Andmekaitse Inspektsioonile (<a href="https://www.aki.ee" rel="noopener noreferrer">aki.ee</a>).</p>

      <h2>Toodete erisused</h2>
      <h3>Limit Notch</h3>
      <p>Limit Notch näitab, kui suure osa oma Claude’i ja ChatGPT paketi limiitidest oled ära kasutanud.</p>
      <ul>
        <li>Numbrite näitamiseks käivitab rakendus taustal sinu arvutisse paigaldatud programmid Claude Code ja Codex ning küsib neilt sinu paketi kasutust; lisaks loeb see Codexi sessioonifaile sinu arvutis. Need programmid suhtlevad Anthropicu ja OpenAI-ga sinu enda sisselogimisega, nende ettevõtete tingimuste ja privaatsuspõhimõtete alusel.</li>
        <li>Rakendus ei loe ega salvesta sinu sisselogimisandmeid, ei saada tehisintellekti mudelitele sõnumeid ega saada midagi meile.</li>
        <li>Rakendus salvestab ainult oma seaded – asukoha, keele, teema ja selle, milliseid teenuseid näidata – kausta sinu kasutajaprofiili all.</li>
      </ul>
      <p>Limit Notch ei ole seotud Anthropicu ega OpenAI-ga ega nende poolt heaks kiidetud või toetatud. Claude ja ChatGPT on nende omanike kaubamärgid.</p>

      <h2>Tingimuste muutmine</h2>
      <p>Uuendame neid tingimusi, kui meie tooted muutuvad. Lehe alguses olev kuupäev näitab viimast versiooni. Kui mõni toode hakkab andmeid teisiti käsitlema, kirjeldame seda toote jaotises enne muudatuse avaldamist.</p>
    </main>
  );
}
