# Vidrarios Armory — instalare și găzduire

Pachet pregătit la 26 octombrie 2026. Include versiunea cu prețurile curați/murdari (+15%), iconițele materialelor, 81 de variante de atașamente, coșul cu scroll propriu și corectura pentru scroll-ul cardurilor.

Site static: HTML, CSS și JavaScript. Nu necesită Node.js, npm, PHP, bază de date, chei API, autentificare ChatGPT sau abonament Sites pentru a funcționa. Nu există pas de compilare.

## Ce trebuie încărcat

În folderul publicat, index.html trebuie să fie direct la rădăcină:

```text
index.html
style.css
main.js
catalog.js
.nojekyll
assets/
  logo.png
  weapons/       (23 imagini)
  materials/     (8 imagini)
README.md
```

Păstrează numele, literele și structura folderelor. Nu încărca doar index.html și nu încărca arhiva ZIP ca un singur fișier în repository. Mai întâi dezarhivează arhiva.

## Varianta 1 — GitHub Pages

Recomandată dacă vrei să păstrezi și să actualizezi codul pe GitHub.

### Prima publicare, fără terminal

1. Conectează-te la https://github.com .
2. Creează un repository nou cu numele `vidrarios-armory`.
3. Pentru GitHub Free, alege un repository **Public** pentru această metodă. Codul, imaginile și rețetele încărcate vor fi vizibile public.
4. În repository, alege **Add file → Upload files**. La un repository complet gol, GitHub poate afișa direct **uploading an existing file**.
5. Încarcă **conținutul** folderului dezarhivat, inclusiv folderul assets. index.html trebuie să apară direct în rădăcina repository-ului, nu în interiorul altui folder vidrarios-armory.
6. Salvează prin **Commit changes** pe ramura `main`.
7. Deschide **Settings → Pages**.
8. La **Build and deployment → Source**, selectează **Deploy from a branch**.
9. Alege ramura **main** și folderul **/(root)**. Apasă **Save**.
10. Așteaptă finalizarea publicării. Adresa exactă apare în **Settings → Pages**. Pentru un repository numit vidrarios-armory, forma normală este:

```text
https://NUMELE-TAU-GITHUB.github.io/vidrarios-armory/
```

Înlocuiește NUMELE-TAU-GITHUB cu numele contului tău. Dacă ai ales alt nume de repository, se schimbă și ultima parte a adresei.

Folderul nu are nevoie de un workflow propriu sau de secrete GitHub. Fișierul .nojekyll indică publicarea fișierelor statice fără prelucrare Jekyll. Dacă Windows ascunde fișierul cu punct, poți să-l creezi din GitHub prin **Add file → Create new file**, cu numele `.nojekyll` și fără conținut.

### Actualizări

Încarcă fișierele schimbate peste cele existente și fă un nou commit pe main. GitHub Pages republică automat. Urmărește rezultatul în tabul **Actions**. Pentru imagini noi, încarcă și fișierele lor din assets.

Publicarea pe GitHub va fi independentă de versiunea găzduită acum pe chatgpt.site. Modificările făcute ulterior într-o copie nu se propagă singure în cealaltă.

### Opțional: publicare prin Git

Ai nevoie de Git instalat și de un repository GitHub gol creat în contul tău. Deschide terminalul în folderul care conține index.html și rulează, înlocuind NUMELE-TAU-GITHUB:

```sh
git init
git add .
git commit -m "Publica Vidrarios Armory"
git branch -M main
git remote add origin https://github.com/NUMELE-TAU-GITHUB/vidrarios-armory.git
git push -u origin main
```

Autentifică-te prin mecanismul oferit de Git/GitHub; nu introduce tokenuri în fișierele site-ului. După push, configurează Pages ca mai sus.

Pentru actualizări ulterioare:

```sh
git add .
git commit -m "Actualizeaza site-ul"
git push
```

Documentație: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Varianta 2 — Netlify Drop

Cea mai scurtă variantă dacă vrei să urci direct folderul, fără Git.

1. Dezarhivează pachetul într-un folder.
2. Conectează-te la contul tău Netlify, ca site-ul să fie asociat contului tău.
3. Deschide https://app.netlify.com/drop .
4. Trage în zona de upload **folderul care conține direct index.html**, împreună cu assets, style.css, main.js și catalog.js.
5. Folosește adresa returnată de Netlify, de forma `https://nume-generat.netlify.app`.

Nu este necesară o comandă de build. Pentru actualizare, deschide proiectul existent din Netlify și încarcă folderul actualizat în zona de publicare manuală din **Deploys**; astfel păstrezi același proiect și aceeași adresă. Nu crea alt proiect prin Drop la fiecare modificare.

Documentație: https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/

## Varianta 3 — hosting clasic / cPanel

Încarcă fișierele și folderul assets în directorul public al domeniului (de obicei public_html, dar denumirea depinde de furnizor). index.html trebuie să fie la rădăcina acelui director. Poți publica și într-un subfolder; căile către imagini și scripturi sunt relative.

Nu trebuie configurată o bază de date sau o versiune PHP. Activează HTTPS prin opțiunile furnizorului.

## Domeniu personalizat

Poți folosi inițial adresa oferită de platformă. Pentru un domeniu propriu, întâi publică site-ul, apoi adaugă domeniul în setările GitHub Pages sau Netlify și urmează instrucțiunile DNS ale platformei pentru domeniul ales. Valorile DNS depind de platformă și de numele domeniului. Activarea unui domeniu propriu nu este necesară pentru funcționarea site-ului.

## Cum modifici site-ul

| Fișier | Ce controlează |
| --- | --- |
| index.html | Textele principale, meniul, taburile și footer-ul |
| style.css | Culorile, dimensiunile cardurilor, iconițele și scroll-ul |
| main.js | Calculatorul, filtrele, coșul, loturile de muniție și prețurile murdare |
| catalog.js | Armele, materialele, prețurile, muniția și atașamentele |
| assets/ | Logo-ul și imaginile |

catalog.js definește obiectul `CATALOG`. Listele sunt `weapons`, `ammo`, `attachments` și `issues`. Identificatorii leagă fiecare armă de muniția și atașamentele ei; păstrează aceste legături când editezi.

- `price`: prețul unitar în $ curați. Valoarea 0 înseamnă armă craft. Varianta în $ murdari se calculează automat cu +15%.
- `materials`: numele materialelor și cantitățile pentru un obiect sau un lot de muniție.
- `batch`: numărul de gloanțe produse per lot; în catalogul actual este 10.
- `category`: Pistol, SMG sau RIFLE/LMG. Filtrul RIFLE/LMG rămâne comun; cardurile MG și Combat MG MK2 afișează LMG.
- `image`: cale relativă către imaginea armei.
- Atașamentele indică arma prin `weapon`; arma include ID-urile lor în `attachments`.

Dacă adaugi sau elimini arme, actualizează și numerele taburilor din index.html (acum 15 arme craft și 8 Neo/Oficiale). O modificare de rețetă în catalog.js se reflectă în totaluri la reîncărcare.

Fișierele .txt originale nu se citesc automat de site. În această versiune, datele lor au fost deja importate în catalog.js. Pentru actualizări, editezi catalog.js sau soliciți o nouă integrare a fișierelor text.

## Datele vizitatorilor și funcționarea

- Coșul se salvează prin localStorage în browserul fiecărui vizitator, pe adresa site-ului. Nu există conturi sau sincronizare între persoane/dispozitive.
- Mutarea de la chatgpt.site la github.io/netlify.app nu transferă automat coșul existent. Noul domeniu are propriul spațiu de stocare în browser.
- Ștergerea datelor browserului poate șterge coșul. Rețetele și imaginile rămân în fișierele site-ului.
- Notificarea de minimum 500 de gloanțe este informativă. Calculatorul permite aceleași cantități ca înainte și rotunjește materialele în sus la loturi de 10.
- Cantitățile atașamentelor și muniției sunt totale pe poziția din coș, nu per armă.
- Fonturile Inter și Barlow Condensed sunt încărcate de la Google Fonts prin style.css. Dacă sunt indisponibile, site-ul folosește fonturile de rezervă. Codul, calculele și imaginile nu necesită serviciul Sites.

## Verificare după publicare

1. Deschide noua adresă și verifică logo-ul, pozele armelor și iconițele materialelor.
2. Adaugă o armă craft, apoi modifică numărul ei: coșul și materialele trebuie să se actualizeze automat.
3. Alege atașamente și verifică materialele acestora. Orice lanternă necesită 1 Bec.
4. Verifică o armă Neo/Oficiale: de exemplu, Assault Rifle MK2 este 70.000 $ curați / 80.500 $ murdari.
5. Încearcă 11 gloanțe: se calculează 2 loturi, adică 20 de gloanțe produse.
6. Reîncarcă pagina și verifică păstrarea coșului în același browser.
7. Verifică scroll-ul cardurilor și al coșului, inclusiv pe telefon.

## Probleme frecvente

- **404 pe GitHub Pages:** verifică ramura main, folderul /(root), index.html la rădăcină și rezultatul din Actions. Folosește URL-ul exact din Settings → Pages.
- **Lipsesc imaginile:** verifică încărcarea întregului folder assets și potrivirea exactă a numelor de fișiere. GitHub diferențiază literele mari de cele mici.
- **Nu apar ultimele modificări:** așteaptă finalizarea deploy-ului, apoi reîncarcă forțat cu Ctrl+F5.
- **Calculatorul nu pornește după o editare:** verifică sintaxa din catalog.js/main.js și consola browserului (F12 → Console).
- **Coșul este gol pe noul domeniu:** stocarea este separată pe fiecare adresă; este comportamentul normal al versiunii actuale.

© 2026 Vidrarios Armory · Făcut de MeXicaNu
