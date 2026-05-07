# Implementation Plan: Website Improvements

## Overview

Implementacija 6 poboljšanja za AC-DC Elektroinstalacije web stranicu. Zadaci su poredani po ovisnostima: prvo ekstrakcija JS-a (temelj za sve nove JS značajke), zatim CSS promjene (footer stilovi, pristupačnost, mobilno), pa HTML promjene (footer, galerija, pristupačnost, SEO), i na kraju image optimization pipeline.

## Tasks

- [x] 1. Extract JavaScript into main.js
  - [x] 1.1 Create main.js with all JavaScript extracted from index.html
    - Move all inline `<script>` content from index.html into a new `/main.js` file
    - Remove the duplicate `scrollTo()` function, keep only `scrollToSection()`
    - Wrap initialization in a `DOMContentLoaded` event listener
    - Replace inline `onclick` attributes with JS-based event listeners
    - Ensure `openProject()` uses consistent URL paths with leading `/`
    - Add `initCurrentYear()` function to set footer year dynamically
    - _Requirements: 6.1, 6.2, 6.3, 5.2_

  - [x] 1.2 Update index.html to reference main.js
    - Remove all inline `<script>` content from index.html
    - Add `<script src="/main.js" defer></script>` in the `<head>`
    - Remove all inline `onclick` attributes from HTML elements (CTA button, gallery items, nav-toggle)
    - Add `id` or `data-*` attributes where needed for JS event binding
    - _Requirements: 6.2_

  - [x] 1.3 Create shared project page script for modal functionality
    - Extract modal `openModal`/`closeModal` functions from project pages into main.js or keep minimal inline if needed for project pages
    - Update all project pages to reference `/main.js` with defer
    - Remove inline scripts from all 6 project HTML files
    - _Requirements: 6.2_

- [x] 2. Checkpoint - Verify JS extraction
  - Ensure the site loads correctly with external JS, all navigation works, gallery animations fire, contact form submits, and project page modals function. Ask the user if questions arise.

- [x] 3. Implement accessibility improvements
  - [x] 3.1 Convert hamburger menu to accessible button
    - Change `.nav-toggle` from `<div>` to `<button>` element in index.html
    - Add `aria-expanded="false"`, `aria-controls="nav-links"`, and `aria-label="Otvori navigaciju"` attributes
    - Add `id="nav-links"` to the `.nav-links` container
    - Update `toggleNav()` in main.js to toggle `aria-expanded` between "true"/"false"
    - Add `body.nav-open` class toggle for scroll lock (used in Requirement 4)
    - _Requirements: 3.1, 3.2_

  - [x] 3.2 Add explicit labels to contact form
    - Add `<label for="...">` elements for each form input (Ime, Prezime, Email, Predmet, Poruka)
    - Add corresponding `id` attributes to each input/textarea
    - Style labels to be visually present (not `sr-only`) and consistent with form design
    - _Requirements: 3.4_

  - [x] 3.3 Add visible focus indicators
    - Add CSS `:focus-visible` styles for all interactive elements (links, buttons, form inputs)
    - Ensure focus outline meets WCAG 2.1 AA contrast requirements (3:1 minimum against adjacent colors)
    - Add focus styles for nav links, CTA button, service cards, gallery items, social links, and submit button
    - _Requirements: 3.3_

- [x] 4. Implement mobile experience improvements
  - [x] 4.1 Fix gallery heights on mobile
    - Update the mobile CSS media query to remove the rule that forces all `.gallery-item.tall, .medium, .short` to `span 20`
    - Set varied heights: `.short` → `span 15`, `.medium` → `span 20`, `.tall` → `span 28` (or similar proportional values for mobile)
    - _Requirements: 4.1_

  - [x] 4.2 Add scroll lock when mobile nav is open
    - Add `body.nav-open { overflow: hidden; }` CSS rule
    - Ensure `toggleNav()` in main.js adds/removes `nav-open` class on `<body>`
    - _Requirements: 4.3_

  - [x] 4.3 Fix mobile navigation padding
    - Ensure consistent padding on `.nav-links` in mobile view that matches the site spacing system
    - Verify navbar padding is consistent across 768px and 480px breakpoints
    - _Requirements: 4.2_

- [x] 5. Implement footer section
  - [x] 5.1 Add footer CSS styles
    - Add `.site-footer` styles to styles.css using existing CSS variables (--primary-blue, --primary-red, --gray-800)
    - Implement `.footer-grid` with responsive layout (3 columns on desktop, stacked on mobile)
    - Style `.footer-nav`, `.footer-contact`, `.footer-social`, and `.footer-bottom` sections
    - Add responsive breakpoint for footer at 768px
    - _Requirements: 1.6_

  - [x] 5.2 Add footer HTML to index.html
    - Insert footer HTML block before closing `</body>` tag (after contact section)
    - Include navigation links (Početna, Usluge, Projekti, O nama, Kontakt) with `/#section` format
    - Include contact info (address, phone, email)
    - Include Facebook link with `rel="noopener noreferrer"` and aria-label
    - Include copyright with `<span id="current-year"></span>` for dynamic year
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7_

  - [x] 5.3 Add footer to all project pages
    - Copy footer HTML to all 6 project pages (falkensteiner-resort, hotel-hilton-ugljan, obiteljska-kuca-babina-greda, pametna-kuca, sinsay-virovitica, smw-slavonski-brod)
    - Ensure footer links use absolute paths (`/#home`, `/#services`, etc.) so they navigate back to main page
    - _Requirements: 1.1_

- [x] 6. Checkpoint - Verify footer and accessibility
  - Ensure footer displays correctly on all pages, navigation links work from project pages, form labels are associated, hamburger button has correct ARIA states, and focus indicators are visible. Ask the user if questions arise.

- [x] 7. Implement SEO and meta tag fixes
  - [x] 7.1 Fix meta tags in index.html
    - Change `og:url` from `https://ac-dc-elektroinstalacije.com` to `https://ac-dc-elektroinstalacije.hr`
    - Add `<meta property="og:type" content="website">` tag
    - Verify canonical URL is consistent (`https://www.ac-dc-elektroinstalacije.hr`)
    - _Requirements: 5.1, 5.3_

  - [x] 7.2 Fix project page link consistency
    - Ensure all URLs in `projectUrls` object in main.js have leading `/` prefix
    - Verify all `<a href>` links in project pages use consistent path format
    - _Requirements: 5.2, 6.3_

- [x] 8. Implement image optimization pipeline
  - [x] 8.1 Create image optimization script
    - Create `scripts/optimize-images.js` using `sharp` library
    - Script should recursively find all `.jpg` files in `/img/` directory
    - Generate `.webp` versions alongside originals with reasonable quality (80%)
    - Add `"optimize-images"` script to package.json
    - Add `sharp` as a devDependency in package.json
    - _Requirements: 2.3_

  - [x] 8.2 Add lazy loading and picture elements to gallery
    - Add `loading="lazy"` to all gallery images in index.html (not the hero image)
    - Wrap gallery images in `<picture>` elements with `<source srcset="...webp" type="image/webp">` and JPG fallback
    - Add `loading="lazy"` to project page images
    - _Requirements: 2.1, 2.2, 2.4_

- [x] 9. Final checkpoint
  - Ensure all changes work together: JS is external, footer shows on all pages, accessibility improvements are in place, mobile experience is improved, SEO meta tags are correct, and image optimization script runs. Ask the user if questions arise.

## Notes

- Tasks are ordered by dependency: JS extraction first (foundation for new features), then CSS, then HTML changes, then image pipeline
- No property-based tests — this is UI/layout/config work without complex business logic
- The site uses no build tools for HTML/CSS; only `sharp` is added for image optimization as an npm script
- All code is plain HTML/CSS/JavaScript — no framework or bundler
- Footer uses absolute paths (`/#section`) to work correctly from both index.html and project pages
