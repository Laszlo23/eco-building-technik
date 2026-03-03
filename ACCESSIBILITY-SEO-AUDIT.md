# Barrierefreiheit & SEO Audit – ECO Building Technik

**Stand:** März 2025

---

## 1. Umgesetzte Verbesserungen

### SEO & Meta-Tags
- **Title-Tag:** „Wärmepumpen & Smart Home kaufen | ECO Building Technik“ (unter 60 Zeichen)
- **Meta-Description:** ca. 155 Zeichen, mit Klimaförderung und Beratung
- **Canonical URL:** https://eco-building.tech/
- **Open Graph (Facebook/LinkedIn):** og:title, og:description, og:image, og:url, og:type, og:locale, og:site_name
- **Twitter Card:** summary_large_image mit title, description, image, image:alt
- **Theme-Color:** #059669 (emerald)
- **Schema.org:** Organization, HVACBusiness, Product (JNOD 12kW)
- **robots.txt:** Allow all, Sitemap-Hinweis
- **Webmanifest:** Fehler behoben, Beschreibung angepasst

### Barrierefreiheit
- **Skip-Link:** Sichtbar bei Fokus, mit Outline, `prefers-reduced-motion` berücksichtigt
- **Landmarks:** `role="banner"` (Header), `role="main"` (Main), `aria-label` für Navigationen
- **Logo:** Als Button mit `aria-label="ECO Building Technik - Zur Startseite"`
- **Icon-Buttons:** `aria-label` für Abmelden, Warenkorb, Menü
- **Mobile-Menü:** `aria-expanded` und `aria-label` für Öffnen/Schließen
- **Bilder:** `alt`-Texte für Produkte, `aria-hidden` für dekorative Icons
- **Sprache:** `lang="de-AT"` im HTML

### Überschriftenstruktur
- **H1:** Eine pro Seite („A+++ Geräte für nachhaltige Gebäudetechnik“)
- **H2:** Sektionen (Produkte, Rechner, FAQ, Kontakt)
- **H3:** Produktnamen, FAQ-Fragen
- **H4:** Unterbereiche (Adresse, Kontakt, Rechtliches)

---

## 2. Empfehlungen für weitere Optimierung

### OG-Image (Social Sharing)
**Aktuell:** Logo wird als og:image genutzt.

**Empfehlung:** Eigenes OG-Image 1200×630 px erstellen:
- Text: „ECO Building Technik – A+++ Wärmepumpen & Smart Home“
- Ort: Ebreichsdorf
- Datei: `/public/images/og-image.png`
- In `index.html` og:image auf `https://eco-building.tech/images/og-image.png` umstellen

### Sitemap
**Aktuell:** robots.txt verweist auf `/sitemap.xml`, Datei fehlt noch.

**Empfehlung:** Sitemap mit allen Sektionen (home, produkte, rechner, faq, kontakt) anlegen.

### Farbkontrast
- Emerald (#059669) auf Weiß: Prüfung mit [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) empfohlen
- Slate-600 auf Slate-50: ausreichend für Fließtext

### Formulare
- Kontaktformular: Prüfen, ob alle Felder mit `<Label>` verknüpft sind
- Fehlermeldungen: `aria-live` für dynamische Validierung nutzen

### Tastatur-Navigation
- Alle interaktiven Elemente per Tab erreichbar
- Dialoge: Fokus beim Öffnen ins Dialog-Innere setzen (Radix UI übernimmt das in der Regel)

---

## 3. Checkliste für Google & Nutzer

| Kriterium | Status |
|----------|--------|
| Title 50–60 Zeichen | ✓ |
| Meta-Description 150–160 Zeichen | ✓ |
| H1 pro Seite | ✓ |
| Logische H2–H4-Hierarchie | ✓ |
| Alt-Texte für Bilder | ✓ |
| Skip-Link vorhanden | ✓ |
| ARIA-Labels für Icon-Buttons | ✓ |
| Canonical URL | ✓ |
| OG-Tags für Social Sharing | ✓ |
| Schema.org Markup | ✓ |
| Mobile Viewport | ✓ |
| robots.txt | ✓ |

---

## 4. Test-Tools

- **Lighthouse** (Chrome DevTools): Performance, Accessibility, SEO, Best Practices
- **WAVE** (wave.webaim.org): Barrierefreiheit
- **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **Google Rich Results Test:** https://search.google.com/test/rich-results
