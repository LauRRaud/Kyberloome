# Küberloome

Next.js, React ja TypeScript. Mustvalge eestikeelne tarkvarastuudio avaleht.

## Arendus

npm ci
npm run dev

Kontroll: npm run build ja npm run typecheck.

## Zone VPS

Olemasoleva Nginxiga serveris kasuta `docker compose -f compose.production.yaml up -d --build`. Rakendus kuulab ainult aadressil 127.0.0.1:3108. Domeeni konfiguratsioon on deploy/nginx.conf; sertifikaadi hangib serveri Certbot. Serveri projektikaust: /opt/kyberloome.

Docker ja Compose peavad olema paigaldatud. Pordid 80 ja 443 peavad olema saadaval. Kopeeri .env.example failiks .env ja täida SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_FROM ning CONTACT_TO. Ära lisa saladusi Giti. Seejärel käivita: docker compose up -d --build.

Caddy hangib HTTPS-sertifikaadi ja suunab www põhidomeenile. Docker-konfiguratsioon vajab VPS-is kontrollimist.

## Kontakt

Vorm saadab päringu serveri kaudu SMTP-ga. Saaja aadressi kasutajale ei avaldata. Ilma SMTP seadistuseta vastab API 503 ning vorm kuvab ausa veateate. Edu kuvatakse alles SMTP-serveri kinnituse järel. Ühe serveriprotsessi saatmiskatsete limiit on 30 tunnis; suurema koormuse korral lisa püsiv piirang. Enne avaldamist kinnita privaatsuslehe säilitamistähtajad ja õiguste kasutamise kontakt ning testi tegelikku kirja saabumist.

Teenusepakkuja: SotsiaalAI OÜ, registrikood 14206225. Tootelingid pärinevad tellija sisendist. Fontide laadimine toimub Google Fontsist.
