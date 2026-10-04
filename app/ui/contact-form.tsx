'use client';
import { useState } from 'react';
const copy = {
 et: { name:'Nimi', namePlaceholder:'Sinu nimi', company:'Ettevõte', optional:'Valikuline', email:'E-post', message:'Mida soovid luua?', messagePlaceholder:'Räägi oma ideest või väljakutsest…', privacyLead:'Andmeid kasutame päringule vastamiseks.', privacy:'Privaatsustingimused', sending:'Saadan…', send:'Saada päring', error:'Saatmine ei õnnestunud. Palun proovi uuesti.' },
 en: { name:'Name', namePlaceholder:'Your name', company:'Company', optional:'Optional', email:'Email', message:'What would you like to create?', messagePlaceholder:'Tell us about your idea or challenge…', privacyLead:'We use your data to respond to your enquiry.', privacy:'Privacy policy', sending:'Sending…', send:'Send enquiry', error:'Something went wrong. Please try again.' },
};
export default function ContactForm({ locale = 'et' }: { locale?: keyof typeof copy }) {
 const t=copy[locale];
 const [status,setStatus]=useState(''); const [pending,setPending]=useState(false);
 return <form onSubmit={async e=>{e.preventDefault();const form=e.currentTarget;setPending(true);setStatus('');try{const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...Object.fromEntries(new FormData(form)),locale})});const result=await response.json();setStatus(result.message);if(response.ok)form.reset();}catch{setStatus(t.error);}finally{setPending(false);}}}>
 <div className="form-row"><label>{t.name}<input name="name" autoComplete="name" placeholder={t.namePlaceholder} required maxLength={100}/></label><label>{t.company}<input name="company" autoComplete="organization" placeholder={t.optional} maxLength={150}/></label></div>
 <label>{t.email}<input name="email" type="email" autoComplete="email" placeholder={locale === 'en' ? 'you@example.com' : 'sinu@email.ee'} required maxLength={200}/></label>
 <label>{t.message}<textarea name="message" placeholder={t.messagePlaceholder} required maxLength={3000} rows={4}/></label>
 <div className="honeypot" aria-hidden="true"><label>Veebileht<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
 <div className="form-bottom"><p>{t.privacyLead} <a href={locale === 'en' ? '/en/privacy' : '/privaatsus'}>{t.privacy}</a></p><button className="button" disabled={pending} type="submit">{pending?t.sending:t.send}</button></div><p role="status">{status}</p></form>;
}
