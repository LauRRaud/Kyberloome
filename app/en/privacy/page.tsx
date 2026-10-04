import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy policy — Küberloome',
  description: 'How Küberloome handles information submitted through this website.',
  alternates: { canonical: '/en/privacy', languages: { et: '/privaatsus', en: '/en/privacy' } },
};

export default function Privacy() {
  return <main className="wrap privacy"><a href="/en">← Back to the homepage</a><p className="eyebrow">KÜBERLOOME</p><h1>Privacy</h1><p>This website is operated by Küberloome OÜ (formerly SotsiaalAI OÜ), registry code 14206225.</p><h2>Contact enquiries</h2><p>We use the name, email address, company name and message submitted through the form to respond to your enquiry. The enquiry is sent to the service provider by email. The website does not store enquiries in a database.</p><h2>Cookies</h2><p>The website does not use analytics or marketing cookies. Fonts are loaded from Google Fonts, whose servers receive your IP address when the connection is established.</p><h2>Apps and games</h2><p>The apps and games we publish in the Microsoft Store are covered by a separate <a href="/en/privacy/apps">privacy policy for apps and games</a>.</p><h2>Before accepting enquiries</h2><p>When we begin accepting enquiries, we will add the controller’s contact details, data retention periods and instructions for exercising your data protection rights here.</p></main>;
}
