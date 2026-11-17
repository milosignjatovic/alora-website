# Alora website

The landing page for the Alora app, a screen-by-screen tour (`/more-details`),
its privacy policy, terms of use and support page. Plain static HTML and CSS in
`public/`: no build step and no third-party requests (fonts, icons and
screenshots are served from here). Two small first-party scripts:
`public/tour.js` enhances the tour (the "Save as PDF" button, replaying each
screen's animation as it scrolls into view, and highlighting the contents), and
`public/theme.js`, loaded in every page's `<head>` so a stored choice applies
before the first paint, runs the light/dark switch in the header. Without them
the tour still reads and prints and the switch stays hidden; the CSP allows
`script-src 'self'` and nothing else.

## Languages

English at `/`, Serbian Latin at `/sr/` and Norwegian Bokmål at `/no/` (`lang="nb"`,
`hreflang="nb"`), each with `index`, `more-details` and `support`. The EN | SR | NO
switch in the header links each page to its counterparts, and every page declares
all three with `hreflang`. Each language is its own HTML file, so a copy change is
made in all three. The privacy policy and terms are English only until their text
is final; the Serbian and Norwegian pages link to them marked "(na engleskom)" /
"(på engelsk)", and on those two pages the switch leads to the other languages'
home pages. Serbian copy follows the app's glossary
(`alora-mobile-app/docs/specification/10-i18n-rules.md`): `ti` throughout,
ekavian, `Alora skor`, tab names as the app shows them. Norwegian copy is
translated from the English pages and follows the same document's `nb` column and
the app's `nb` bundles (`alora-mobile-app/src/common/i18n/locales/nb/`): `du`
throughout, `Alora-skår`, `tarmtømming` / `avføring`, `hastetilfeller`, and tab,
tray and feature names exactly as the app shows them (`Hjem`, `Analyser`,
`Innsikt`, `Utforsk`, `Helse`, `Innstillinger`, `Sykehistorie`,
`Behandling og timeplan`, `Mine dokumenter`, `«Kan ikke vente»-kort`).

## The tour and its screenshots

`public/assets/screens/{en,sr,no}/*.webp` are real app screens (iPhone 17 /
17 Pro simulator, demo data, 603×1311 WebP at `cwebp -q 80`) captured with
Maestro flows, 28 files per language with the same names. The `*-strip` files
are stitched scroll captures; their height follows the content, so each
language's `more-details.html` carries its own `--end` (and tap-dot positions
where a layout differs): Norwegian `health-strip` is 1830 px and `labs-strip`
4340 px tall, and the Norwegian launcher shows a "Venter på deg" row that moves
its tiles up. A step on
`/more-details` stacks the screen you come from under the screen it shows,
taps, then lets the tray rise or the tab crossfade; printing drops the layers
and lays the steps out two per A4 page, one chapter per page. Re-capture the
screens when the app's UI changes, and mask any personal name (the Home
greeting shows the account's name).

The two phones in the landing hero are drawn in HTML/CSS, not screenshots, so
their charts can draw in and their content scroll. All motion stops under
`prefers-reduced-motion`.

Hosted as static assets on Cloudflare Workers, like the doctor-report viewer in
`alora-mobile-app`.

## Run it locally

```sh
npm install
npm run dev        # http://localhost:8787
```

## Deploy

```sh
npm run deploy     # https://alora-website.alora.workers.dev
```

A custom domain can be added later to the same Worker in the Cloudflare
dashboard (Workers & Pages → www → Settings → Domains & Routes), with no
rebuild.

## Brand

Colours and type mirror the app's Alora theme
(`alora-mobile-app/src/app/theme/colors.ts`): brand `#2FAFA9`, brand vivid
`#158F8C`, the logo gradient's `#438FA4`, the five-stop screen wash, and Inter
(SIL Open Font License, `public/fonts/OFL.txt`). The mark in
`public/assets/alora-mark.svg` is the app's `AloraLogoMark` path with its
gradient. Light and dark follow the visitor's system setting until the visitor
picks one with the header switch (Match system → Light → Dark, wording from the
app's Appearance screen). The choice is kept in `localStorage` as
`alora-theme` and sets `data-theme` on `<html>`; the dark tokens in
`styles.css` apply under `[data-theme='dark']`, or under the system setting
unless `[data-theme='light']`.

## Before launch

- [ ] Complete `public/privacy.html` and `public/terms.html` (served as `/privacy` and `/terms`). Every grey
      italic "To be added before release" line (class `pending`) is a decision for the owner, not filler.
- [ ] Add a support e-mail address in `public/support.html`, `public/sr/support.html` and `public/no/support.html`
      (each says one will be published at launch).
- [ ] Translate the privacy policy and terms into Serbian and Norwegian once the English text is final.
- [ ] Remove `X-Robots-Tag: noindex` from `public/_headers`, open up
      `public/robots.txt`, and drop the `noindex` meta tags from the legal pages.
- [ ] Add the App Store and Google Play links once the apps are published.
- [ ] Point the app's `ALORA_PRIVACY_URL` and `ALORA_TERMS_URL` at these pages.
