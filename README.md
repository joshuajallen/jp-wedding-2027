# Prerna &amp; Josh — Wedding Website (June 12–15, 2027 · Kenya)

A static, modular wedding website built with semantic HTML/CSS and a touch of
vanilla JavaScript. Designed for **GitHub Pages** hosting with a custom domain.

## Design

Safari-inspired palette pulled from the save-the-date:

| Token | Hex | Use |
|-------|-----|-----|
| Terracotta / rust | `#b5532a` | Accent, RSVP CTA |
| Olive | `#7c7b3f` | Dividers, line-art |
| Forest green | `#2f4233` | Headings, footer |
| Cream / parchment | `#f4ecd9` | Background |
| Ochre / mustard | `#cf9b3f` | Accents, badges |
| Espresso brown | `#2c2118` | Text, borders |

Typography: **Cormorant Garamond** (serif headings) + **Jost** (sans body).

All palette values live as CSS custom properties at the top of
`css/styles.css` — edit them once to restyle the whole site.

## Structure

```
index.html              Home
our-story.html          Our Story
wedding-details.html    Wedding Details
travel.html             Travel Information
accommodation.html      Accommodation
rsvp.html               RSVP
faq.html                FAQ
things-to-do.html       Things To Do
contact.html            Contact Us
css/styles.css          Shared design system
js/main.js              Shared header/footer injection + interactions
resources/              Source assets (save-the-date, etc.)
```

### Modularity
- Each page is self-contained. Sections are wrapped in clearly commented
  `<!-- MODULE: ... -->` blocks so they can be edited, reordered or removed
  independently.
- The **header/nav** and **footer** are injected on every page by `js/main.js`
  into the `#site-header` and `#site-footer` mount points — update them in one
  place and the change propagates everywhere.

## Placeholders
No real content is included yet. Look for bracketed text such as
`[Welcome message placeholder]` and the dashed image blocks labelled
`[... photo placeholder]`. Drop in real copy and images when ready.

## The RSVP link
The RSVP button points to an external URL configured in **one place**:

```js
// js/main.js
const SITE = { rsvpUrl: "#RSVP_LINK_PLACEHOLDER", ... }
```

Any element with the `data-rsvp-link` attribute is automatically wired to this
URL (opening in a new tab). Replace the placeholder when the real link exists.

## Hosting on GitHub Pages with a custom domain
1. Push to the `main` branch of the repo.
2. In **Settings → Pages**, set the source to `main` / root.
3. Add your custom domain; GitHub will create/commit a `CNAME` file.
4. `.nojekyll` is included so the `css/` and `js/` folders are served as-is.

## Local preview
Open `index.html` directly, or run a simple server:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```
