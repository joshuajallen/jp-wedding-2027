/* =====================================================================
   Prerna & Josh — Wedding 2027
   Shared site script:
   - Injects the header/nav + footer components into every page
   - Handles mobile menu, FAQ accordion, and Things-To-Do tabs
   Keeping shared chrome here means each page file stays focused on
   its own content modules only.
   ===================================================================== */

/* ----- Site-wide config (edit once, applies everywhere) ----- */
const SITE = {
  // TODO: replace with the real external RSVP link when supplied.
  rsvpUrl: "#RSVP_LINK_PLACEHOLDER",
  coupleShort: "P <span>&amp;</span> J",
  // Order of nav tabs. `file` matches the page filename.
  pages: [
    { file: "index.html",        label: "Home" },
    { file: "our-story.html",    label: "Our Story" },
    { file: "wedding-details.html", label: "Wedding Details" },
    { file: "travel.html",       label: "Travel" },
    { file: "accommodation.html", label: "Accommodation" },
    { file: "things-to-do.html", label: "Things To Do" },
    { file: "faq.html",          label: "FAQ" },
    { file: "contact.html",      label: "Contact" },
    { file: "rsvp.html",         label: "RSVP", isRsvp: true }
  ]
};

/* ----- Determine current page filename ----- */
function currentPage() {
  const path = window.location.pathname.split("/").pop();
  return path === "" ? "index.html" : path;
}

/* ----- Build header / nav ----- */
function renderHeader() {
  const here = currentPage();
  const links = SITE.pages
    .filter(p => !p.isRsvp)
    .map(p => `<li><a href="${p.file}"${p.file === here ? ' class="is-active" aria-current="page"' : ""}>${p.label}</a></li>`)
    .join("");

  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <nav class="nav" aria-label="Primary">
      <a class="nav__brand" href="index.html">${SITE.coupleShort}</a>
      <button class="nav__toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="navMenu">
        <span></span><span></span><span></span>
      </button>
      <div class="nav__menu" id="navMenu">
        <ul class="nav__links">${links}</ul>
      </div>
    </nav>
  </header>`;
}

/* ----- Build footer ----- */
function renderFooter() {
  const quick = ["wedding-details.html", "travel.html", "accommodation.html", "faq.html"];
  const quickLinks = SITE.pages
    .filter(p => quick.includes(p.file))
    .map(p => `<li><a href="${p.file}">${p.label}</a></li>`)
    .join("");

  return `
  <footer class="site-footer">
    <div class="footer__grid footer">
      <div>
        <div class="footer__brand">Prerna <span>&amp;</span> Josh</div>
        <p>June 12&ndash;15, 2027 &middot; Kenya</p>
        <p class="muted">[Short footer tagline placeholder]</p>
      </div>
      <div>
        <h4>Explore</h4>
        <ul>${quickLinks}</ul>
      </div>
      <div>
        <h4>Get in touch</h4>
        <ul>
          <li><a href="contact.html">Contact us</a></li>
          <li><a href="rsvp.html">RSVP</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <p>Made with love for our celebration in Kenya &middot; &copy; 2027 Prerna &amp; Josh</p>
    </div>
  </footer>`;
}

/* ----- Inject components & wire interactions ----- */
function mountChrome() {
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");
  if (headerMount) headerMount.innerHTML = renderHeader();
  if (footerMount) footerMount.innerHTML = renderFooter();

  // Resolve any RSVP placeholder links to the configured URL.
  document.querySelectorAll('[data-rsvp-link]').forEach(el => {
    el.setAttribute("href", SITE.rsvpUrl);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // Mobile menu toggle
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }
}

/* ----- FAQ accordion ----- */
function initAccordions() {
  document.querySelectorAll(".accordion__trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      panel.style.maxHeight = expanded ? null : panel.scrollHeight + "px";
    });
  });
}

/* ----- Tabs (Things To Do) ----- */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach(group => {
    const buttons = group.querySelectorAll(".tabs__btn");
    const panels = group.querySelectorAll(".tabs__panel");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        buttons.forEach(b => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", String(active));
        });
        panels.forEach(p =>
          p.classList.toggle("is-active", p.dataset.panel === target)
        );
      });
    });
  });
}

/* ----- Boot ----- */
document.addEventListener("DOMContentLoaded", () => {
  mountChrome();
  initAccordions();
  initTabs();
});
