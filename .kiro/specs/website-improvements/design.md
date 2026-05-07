# Design Document: Website Improvements

## Overview

Ovaj dokument opisuje tehnički pristup za implementaciju 6 zahtjeva poboljšanja web stranice AC-DC Elektroinstalacije. Stranica je izgrađena u čistom HTML/CSS/JS-u bez build alata ili frameworka, hostirana na Vercelu. Dizajn zadržava tu jednostavnost — nema uvođenja bundlera, frameworka ili složenih alata.

Ključne odluke:
- JavaScript se izdvaja u zasebnu `main.js` datoteku (Requirement 6)
- Footer se implementira kao HTML komponenta kopirana na svaku stranicu (nema server-side includea)
- Slike se optimiziraju ručno ili putem jednostavnog npm skripte (sharp)
- Pristupačnost se rješava semantičkim HTML-om i ARIA atributima

## Architecture

Trenutna arhitektura ostaje nepromijenjena — statička stranica bez build pipeline-a za HTML/CSS. Jedina nova ovisnost je `sharp` za generiranje WebP slika.

```mermaid
graph TD
    A[index.html] --> B[styles.css]
    A --> C[main.js - NOVO]
    A --> D[img/]
    A --> E[img/ *.webp - NOVO]
    
    F[projects/*.html] --> B
    F --> C
    F --> D
    
    G[package.json] --> H[sharp - NOVO]
    G --> I[@vercel/analytics]
    
    J[scripts/optimize-images.js - NOVO] --> H
```

### Struktura datoteka (promjene)

```
/
├── index.html          (dodaje footer, lazy loading, aria atributi, label elementi)
├── styles.css          (dodaje footer stilove, focus indikatore, scroll-lock)
├── main.js             (NOVO - sav JS izdvojen iz HTML-a)
├── scripts/
│   └── optimize-images.js  (NOVO - generira WebP verzije)
├── projects/
│   ├── *.html          (dodaje footer, ispravlja linkove)
│   └── project_styles.css
└── package.json        (dodaje sharp, scripts)
```

## Components and Interfaces

### 1. Footer komponenta (Requirement 1)

Footer se dodaje kao HTML blok na dno `index.html` i svih `projects/*.html` stranica.

```html
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-nav">
        <h4>Navigacija</h4>
        <ul>
          <li><a href="/#home">Početna</a></li>
          <li><a href="/#services">Usluge</a></li>
          <li><a href="/#projects">Projekti</a></li>
          <li><a href="/#about">O nama</a></li>
          <li><a href="/#contact">Kontakt</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h4>Kontakt</h4>
        <p>Braće Radića 50, Babina Greda</p>
        <p>+385 95 851 8709</p>
        <p>ac.dc.babic@gmail.com</p>
      </div>
      <div class="footer-social">
        <h4>Pratite nas</h4>
        <a href="https://www.facebook.com/ac.dc.obrt.za.elektroinstalacije" 
           target="_blank" rel="noopener noreferrer" aria-label="Facebook stranica">
          <img src="/img/facebook.png" alt="Facebook" class="social-icon">
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="current-year"></span> AC-DC d.o.o. Sva prava pridržana.</p>
    </div>
  </div>
</footer>
```

**Odluka**: Linkovi u footeru koriste apsolutne putanje s `/` prefiksom (npr. `/#home`) tako da rade i s glavne stranice i s project stranica. Na project stranicama, klik na footer link vodi natrag na index.html s odgovarajućim anchor-om.

### 2. main.js — izdvojeni JavaScript (Requirement 6)

Sav inline JavaScript iz `index.html` se premješta u `/main.js`. Funkcije:

```javascript
// main.js - API surface
function scrollToSection(sectionId) { ... }
function toggleNav() { ... }
function openProject(projectId) { ... }
function handleFormSubmit(e) { ... }

// Inicijalizacija
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initGalleryAnimations();
  initServiceCardObserver();
  initContactForm();
  initCurrentYear();
});
```

**Odluka**: Uklanja se duplicirana `scrollTo()` funkcija — ostaje samo `scrollToSection()`. Svi event listeneri se postavljaju u JS-u umjesto inline `onclick` atributa u HTML-u (poboljšava pristupačnost i održivost).

### 3. Pristupačnost navigacije (Requirement 3)

Hamburger menu se pretvara iz `<div>` u `<button>`:

```html
<button class="nav-toggle" 
        aria-expanded="false" 
        aria-controls="nav-links" 
        aria-label="Otvori navigaciju">
  <span></span>
  <span></span>
  <span></span>
</button>

<div class="nav-links" id="nav-links" role="navigation">
  ...
</div>
```

`toggleNav()` ažurira `aria-expanded` pri svakom kliku.

Kontakt forma dobiva eksplicitne `<label>` elemente:

```html
<label for="contact-name">Ime</label>
<input type="text" id="contact-name" name="Ime" placeholder="Ime" required>
```

### 4. Galerija — performanse (Requirement 2)

- Sve galerije slike dobivaju `loading="lazy"` (osim hero slike koja već ima `fetchpriority="high"`)
- Dodaje se `<picture>` element s WebP izvorom:

```html
<picture>
  <source srcset="/img/project-thumb.webp" type="image/webp">
  <img src="/img/project-thumb.jpg" alt="..." loading="lazy" class="gallery-image">
</picture>
```

- Skripta `scripts/optimize-images.js` koristi `sharp` za generiranje WebP verzija svih slika u `/img/` direktoriju

### 5. Mobilno iskustvo (Requirement 4)

- Galerija na mobilnom zadržava varijabilne visine (uklanja se override koji forsira `span 20` na sve)
- Navigacija dobiva konzistentan padding
- Kad je mobilni meni otvoren, `body` dobiva klasu `nav-open` koja sprječava scroll:

```css
body.nav-open {
  overflow: hidden;
}
```

### 6. SEO konzistentnost (Requirement 5)

Ispravke meta tagova u `index.html`:
- `og:url` → `https://ac-dc-elektroinstalacije.hr` (uklanja `.com`)
- Dodaje `<meta property="og:type" content="website">`
- Svi project linkovi u `openProject()` dobivaju vodeći `/`

## Data Models

Nema novih data modela — stranica ne koristi bazu podataka niti API (osim Formspree za kontakt formu). Jedina "podatkovna" promjena je konzistentnost URL putanja u JavaScript objektu `projectUrls`.

```javascript
const projectUrls = {
  'pametna-kuca-austrija': '/projects/pametna-kuca.html',
  'sinsay-virovitica': '/projects/sinsay-virovitica.html',
  'hotel-hilton-ugljan': '/projects/hotel-hilton-ugljan.html',
  'obiteljska-kuca-babina-greda': '/projects/obiteljska-kuca-babina-greda.html',
  'falkensteiner-resort': '/projects/falkensteiner-resort.html',
  'smw-slavonski-brod': '/projects/smw-slavonski-brod.html'
};
```

## Error Handling

| Scenarij | Pristup |
|----------|---------|
| WebP nije podržan u pregledniku | `<picture>` fallback na JPG automatski |
| JavaScript se ne učita | Footer i navigacija rade bez JS-a (osim hamburger toggle-a). Smooth scroll fallback na browser native `scroll-behavior: smooth` |
| Formspree nedostupan | Postojeći try/catch prikazuje poruku greške korisniku |
| Slika ne postoji | `alt` tekst se prikazuje; nema broken layout-a zahvaljujući CSS `object-fit` |

## Testing Strategy

### Pristup

Budući da je ovo statička HTML/CSS/JS stranica bez složene poslovne logike, testiranje se fokusira na:

1. **Manualno testiranje** — vizualna provjera na desktop i mobilnim uređajima
2. **Lighthouse audit** — performanse, pristupačnost, SEO
3. **HTML validacija** — W3C validator za svaku stranicu
4. **Accessibility audit** — axe DevTools ili WAVE za WCAG 2.1 AA provjeru

### Zašto nema property-based testova

Ova značajka uključuje:
- UI rendering i layout (footer, galerija, navigacija)
- HTML atribute i meta tagove (pristupačnost, SEO)
- Kod reorganizaciju (JS ekstrakcija)
- Konfiguraciju (image optimization skripta)

Nijedan od ovih zahtjeva nema čiste funkcije s varijabilnim ulazima gdje bi property-based testiranje otkrilo greške. Nema parsera, serializera, algoritama ni poslovne logike. Testiranje se oslanja na validaciju, audit alate i manualni pregled.

### Provjere po zahtjevu

| Zahtjev | Metoda testiranja |
|---------|-------------------|
| 1. Footer | Vizualna provjera na svim stranicama; provjera linkova |
| 2. Performanse | Lighthouse Performance score; provjera `loading="lazy"` atributa; WebP generiranje |
| 3. Pristupačnost | axe DevTools audit; keyboard navigation test; screen reader test |
| 4. Mobilno | Chrome DevTools responsive mode; provjera scroll-lock-a |
| 5. SEO | Lighthouse SEO score; ručna provjera meta tagova |
| 6. Kvaliteta koda | Provjera da nema inline JS-a; provjera konzistentnosti URL-ova |
