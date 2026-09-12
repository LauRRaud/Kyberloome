'use client';
import { useState } from 'react';
export default function ContactForm() {
 const [status,setStatus]=useState(''); const [pending,setPending]=useState(false);
 return <form onSubmit={async e=>{e.preventDefault();const form=e.currentTarget;setPending(true);setStatus('');try{const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))});const result=await response.json();setStatus(result.message);if(response.ok)form.reset();}catch{setStatus('Saatmine ei õnnestunud. Palun proovi uuesti.');}finally{setPending(false);}}}>
 <div className="form-row"><label>Nimi<input name="name" autoComplete="name" placeholder="Sinu nimi" required maxLength={100}/></label><label>Ettevõte<input name="company" autoComplete="organization" placeholder="Valikuline" maxLength={150}/></label></div>
 <label>E-post<input name="email" type="email" autoComplete="email" placeholder="sinu@email.ee" required maxLength={200}/></label>
 <label>Mida soovid luua?<textarea name="message" placeholder="Räägi oma ideest või väljakutsest…" required maxLength={3000} rows={4}/></label>
 <div className="honeypot" aria-hidden="true"><label>Veebileht<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
 <div className="form-bottom"><p>Andmeid kasutame päringule vastamiseks. <a href="/privaatsus">Privaatsustingimused</a></p><button className="button" disabled={pending} type="submit">{pending?'Saadan…':'Saada päring'}</button></div><p role="status">{status}</p></form>;
}
