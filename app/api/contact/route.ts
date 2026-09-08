import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
export const runtime = 'nodejs';
let count = 0;
let expires = 0;
const reply = (message: string, status: number) => NextResponse.json({ message }, { status });
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowed = process.env.SITE_ORIGIN || (process.env.NODE_ENV === 'development' ? `http://${request.headers.get('host')}` : 'https://xn--kberloome-q9a.ee');
  if (origin !== allowed) return reply('Päring ei ole lubatud.', 403);
  if (!request.headers.get('content-type')?.includes('application/json')) return reply('Vigane päring.', 415);
  const raw = await request.text();
  if (raw.length > 10000) return reply('Päring on liiga pikk.', 413);
  let data: Record<string, unknown>;
  try { data = JSON.parse(raw); } catch { return reply('Vigane päring.', 400); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return reply('Vigane päring.', 400);
  if (data.website) return reply('Päring ei ole lubatud.', 400);
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  const company = typeof data.company === 'string' ? data.company.trim() : '';
  if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200 || !message || message.length > 3000 || company.length > 150) return reply('Kontrolli nime, e-posti aadressi ja sõnumit.', 400);
  if (Date.now() > expires) { count = 0; expires = Date.now() + 3600000; }
  if (count >= 30) return reply('Päringute limiit on täitunud. Palun proovi hiljem uuesti.', 429);
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_FROM, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_FROM || !CONTACT_TO) return reply('Päringute saatmine pole veel avatud. Palun proovi hiljem uuesti.', 503);
  count++;
  const transport = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT || 587), secure: SMTP_PORT === '465', requireTLS: SMTP_PORT !== '465', auth: { user: SMTP_USER, pass: SMTP_PASS }, connectionTimeout: 10000, socketTimeout: 15000 });
  try {
    await transport.sendMail({ from: CONTACT_FROM, to: CONTACT_TO, replyTo: email, subject: 'Uus päring — Küberloome', text: `Nimi: ${name}\nEttevõte: ${company}\nE-post: ${email}\n\n${message}` });
    return reply('Aitäh! Sinu päring on saadetud.', 200);
  } catch { return reply('Saatmine ei õnnestunud. Palun proovi hiljem uuesti.', 502); }
  finally { transport.close(); }
}
