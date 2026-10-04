import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy policy for apps and games — Küberloome',
  description: 'How the apps and games Küberloome publishes in the Microsoft Store handle your data.',
  alternates: { canonical: '/en/privacy/apps', languages: { et: '/privaatsus/rakendused', en: '/en/privacy/apps' } },
};

export default function AppsPrivacy() {
  return (
    <main className="wrap privacy">
      <a href="/en">← Back to the homepage</a>
      <p className="eyebrow">KÜBERLOOME</p>
      <h1>Privacy policy for apps and games</h1>
      <p className="updated">Last updated: 3 October 2026</p>

      <p>This policy covers the apps and games that Küberloome publishes in the Microsoft Store. These products are published by Küberloome OÜ (formerly SotsiaalAI OÜ; registry code 14206225, Estonia), which is the data controller wherever personal data is processed. How this website itself handles data is described in the <a href="/en/privacy">website privacy policy</a>.</p>

      <h2>In short</h2>
      <p>Our apps and games are built to run on your device. Unless the section for a specific product below says otherwise, they:</p>
      <ul>
        <li>do not need an account with us;</li>
        <li>do not collect personal data and do not send any data to us;</li>
        <li>contain no advertising and no third-party analytics or tracking;</li>
        <li>do not sell or pass your data on to anyone.</li>
      </ul>

      <h2>What stays on your device</h2>
      <p>Settings, preferences, saved games and similar data are stored on your device, in the product’s own data folder. We have no access to them. Uninstalling a product removes it; you can delete anything left in its data folder yourself.</p>

      <h2>Internet connections</h2>
      <p>By default our products make no internet connections of their own. Where a product works together with another service or program — for example by reading that program’s files on your device, or by asking a program installed on your PC for information — this is described in the product’s section below. Such services and programs are provided by their own companies under their own terms and privacy policies, and we do not receive what they exchange.</p>

      <h2>Microsoft Store</h2>
      <p>Downloads, purchases, licences and updates are handled by Microsoft. Microsoft may give us aggregated statistics that do not identify you, such as download numbers and crash reports, and we can see the ratings and reviews you publish in the Store, as everyone can. We do not receive your payment details.</p>
      <p>If a game uses Xbox services, such as achievements or cloud saves, those are provided by Microsoft. How Microsoft handles your data is described in the <a href="https://privacy.microsoft.com/privacystatement" rel="noopener noreferrer">Microsoft Privacy Statement</a>.</p>

      <h2>If you contact us</h2>
      <p>If you write to us for support, we use your contact details and your message only to answer you, and keep the correspondence no longer than is needed to resolve the matter.</p>

      <h2>Children</h2>
      <p>Because our products do not collect personal data, they do not collect it from children either.</p>

      <h2>Your rights</h2>
      <p>Under the EU General Data Protection Regulation you have the right to ask for access to your personal data, to have it corrected or erased, to restrict or object to its processing, and to receive it in a portable form. As our products send no personal data to us, we normally hold nothing about you; if you have contacted us, these rights apply to that correspondence.</p>
      <p>To use your rights or ask a question, write to us through the <a href="/en#contact">contact form</a>. You also have the right to lodge a complaint with the Estonian Data Protection Inspectorate (<a href="https://www.aki.ee/en" rel="noopener noreferrer">aki.ee</a>).</p>

      <h2>Product-specific notes</h2>
      <h3>Limit Notch</h3>
      <p>Limit Notch shows how much of your Claude and ChatGPT plan limits you have used.</p>
      <ul>
        <li>To show the numbers, it starts Claude Code and Codex — programs installed on your PC — in the background and asks them for your plan usage, and it reads Codex’s session files on your PC. Those programs contact Anthropic and OpenAI with your own sign-in, under those companies’ terms and privacy policies.</li>
        <li>The app does not read or store your sign-in details, sends no messages to the AI models and sends nothing to us.</li>
        <li>It stores only its own settings — position, language, theme and the services you chose to show — in a folder under your user profile.</li>
      </ul>
      <p>Limit Notch is not affiliated with, endorsed by, or sponsored by Anthropic or OpenAI. Claude and ChatGPT are trademarks of their respective owners.</p>

      <h2>Changes to this policy</h2>
      <p>We update this policy when our products change. The date at the top shows the latest version, and a product that starts handling data differently is described in its own section before that change is released.</p>
    </main>
  );
}
