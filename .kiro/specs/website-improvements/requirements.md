# Requirements Document

## Introduction

Poboljšanja web stranice AC-DC Elektroinstalacije (ac-dc-elektroinstalacije.hr) — jednstraničnog sajta izgrađenog u čistom HTML/CSS/JS-u i hostiranog na Vercelu. Fokus je na dodavanju podnožja (footer), poboljšanju performansi, pristupačnosti, mobilnog korisničkog iskustva, SEO konzistentnosti i kvalitete koda.

## Glossary

- **Website**: Jednstranična web stranica AC-DC Elektroinstalacije na domeni ac-dc-elektroinstalacije.hr
- **Footer**: Podnožje stranice koje se prikazuje na dnu svake stranice s navigacijom, kontakt podacima i pravnim informacijama
- **Gallery**: Sekcija projekata na glavnoj stranici koja prikazuje slike završenih radova
- **Navigation**: Navigacijski izbornik (navbar) na vrhu stranice
- **Contact_Form**: Obrazac za kontakt u sekciji "Kontakt" na glavnoj stranici
- **Hamburger_Menu**: Mobilni navigacijski gumb koji otvara/zatvara navigacijske linkove
- **Project_Page**: Pojedinačna stranica projekta u direktoriju /projects/

## Requirements

### Requirement 1: Footer sekcija

**User Story:** Kao posjetitelj stranice, želim vidjeti podnožje na dnu stranice, kako bih imao brz pristup kontakt informacijama, navigaciji i pravnim podacima tvrtke.

#### Acceptance Criteria

1. THE Website SHALL display a Footer section at the bottom of every page (index.html and all Project_Pages)
2. THE Footer SHALL contain copyright information including the company name "AC-DC d.o.o." and the current year
3. THE Footer SHALL contain quick navigation links to all main sections (Početna, Usluge, Projekti, O nama, Kontakt)
4. THE Footer SHALL contain repeated contact information including address, phone number, and email
5. THE Footer SHALL contain a link to the company Facebook page with a visible Facebook icon
6. THE Footer SHALL be visually consistent with the existing site design using the defined CSS variables (--primary-blue, --primary-red)
7. WHEN a user clicks a navigation link in the Footer, THE Website SHALL scroll smoothly to the corresponding section on the main page

### Requirement 2: Performanse galerije slika

**User Story:** Kao posjetitelj stranice, želim da se stranica brzo učitava, kako bih imao ugodno korisničko iskustvo bez dugog čekanja.

#### Acceptance Criteria

1. THE Gallery SHALL use the `loading="lazy"` attribute on all gallery images that are not visible in the initial viewport
2. THE Gallery SHALL use responsive `srcset` attributes or `<picture>` elements to serve appropriately sized images based on viewport width
3. THE Website SHALL include a build step or image optimization pipeline that generates WebP format alternatives for all gallery images
4. WHEN a gallery image is below the fold, THE Website SHALL defer loading that image until the user scrolls near it

### Requirement 3: Pristupačnost navigacije

**User Story:** Kao korisnik koji koristi tipkovnicu ili čitač zaslona, želim da navigacija bude potpuno pristupačna, kako bih mogao koristiti stranicu bez miša.

#### Acceptance Criteria

1. THE Hamburger_Menu SHALL be implemented as a `<button>` element with `aria-expanded` and `aria-controls` attributes
2. WHEN the Hamburger_Menu is activated, THE Hamburger_Menu SHALL update its `aria-expanded` attribute to reflect the current state
3. THE Website SHALL provide visible focus indicators on all interactive elements (links, buttons, form inputs) that meet WCAG 2.1 AA contrast requirements
4. THE Contact_Form SHALL use explicit `<label>` elements associated with each input field via the `for` attribute, in addition to placeholder text

### Requirement 4: Mobilno korisničko iskustvo

**User Story:** Kao korisnik na mobilnom uređaju, želim da galerija i navigacija budu vizualno privlačne i funkcionalne, kako bih imao jednako dobro iskustvo kao na desktopu.

#### Acceptance Criteria

1. THE Gallery SHALL maintain varied image heights on mobile viewports (below 768px) to preserve visual interest, rather than forcing all items to the same height
2. THE Navigation SHALL have consistent padding on mobile viewports that matches the overall site spacing system
3. WHEN the mobile Navigation is open, THE Website SHALL prevent background scrolling to avoid disorientation

### Requirement 5: SEO i meta podaci

**User Story:** Kao vlasnik stranice, želim da svi meta podaci budu konzistentni i ispravni, kako bi tražilice pravilno indeksirale stranicu.

#### Acceptance Criteria

1. THE Website SHALL use a consistent domain (ac-dc-elektroinstalacije.hr) across all meta tags including `og:url` and `canonical`
2. THE Website SHALL use consistent URL paths in all project links (all with leading `/` prefix)
3. THE Website SHALL include an `og:type` meta tag with value "website"

### Requirement 6: Kvaliteta koda

**User Story:** Kao developer koji održava stranicu, želim da kod bude čist i organiziran, kako bih lakše dodavao nove značajke i ispravljao greške.

#### Acceptance Criteria

1. THE Website SHALL have a single scroll-to-section function without duplicates
2. THE Website SHALL have all JavaScript extracted into a separate `.js` file linked from the HTML
3. THE Website SHALL use consistent URL path format (with leading `/`) in all internal navigation and project links
