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

/* Flag that JS is available as early as possible so CSS can decide
   whether to hide the body for the fade-in (avoids a flash for no-JS). */
document.documentElement.classList.add("js");

const prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      <button class="nav__toggle" aria-label="Open menu" aria-expanded="false" aria-controls="navMenu">
        <span></span><span></span><span></span>
      </button>
      <div class="nav__menu" id="navMenu">
        <ul class="nav__links">${links}</ul>
      </div>
    </nav>
  </header>
  <div class="nav__backdrop" id="navBackdrop" hidden></div>`;
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

  initMobileMenu();
}

/* ----- Mobile menu: drawer + backdrop + scroll lock ----- */
function initMobileMenu() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("navMenu");
  const backdrop = document.getElementById("navBackdrop");
  if (!toggle || !menu) return;

  let savedScrollY = 0;

  function openMenu() {
    // Lock body scroll without a "jump": pin the body at the current
    // scroll offset (position: fixed + negative top via CSS class).
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add("nav-open");

    menu.classList.add("is-open");
    if (backdrop) { backdrop.hidden = false; requestAnimationFrame(() => backdrop.classList.add("is-open")); }
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  function closeMenu(restoreScroll = true) {
    menu.classList.remove("is-open");
    if (backdrop) {
      backdrop.classList.remove("is-open");
      // Hide after the fade-out so it doesn't block taps.
      setTimeout(() => { backdrop.hidden = true; }, 260);
    }
    // Release the scroll lock.
    document.body.classList.remove("nav-open");
    document.body.style.top = "";
    // Only restore the previous scroll position when staying on the page.
    if (restoreScroll) window.scrollTo(0, savedScrollY);

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function toggleMenu() {
    if (menu.classList.contains("is-open")) closeMenu();
    else openMenu();
  }

  toggle.addEventListener("click", toggleMenu);
  if (backdrop) backdrop.addEventListener("click", () => closeMenu());

  // IMPORTANT: do NOT add a click handler to the nav links.
  // Each link navigates to a separate page, so the browser does the
  // navigation natively and the new page loads with a clean (unlocked)
  // body. Mutating the body layout here during the tap would cancel the
  // navigation on mobile browsers (the bug we're fixing).

  // Close on Escape, and tidy up if resized back to desktop.
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960 && menu.classList.contains("is-open")) closeMenu();
  });
}

/* ----- Speed up navigation: prefetch internal pages -----
   Multi-page static sites re-request each HTML file on navigation.
   We prefetch same-site pages (1) when the browser is idle and
   (2) the moment a user hovers/touches a link — so the next page is
   usually already in cache and loads instantly. CSS/JS/fonts are
   shared and cached after the first visit. */
function initPrefetch() {
  const prefetched = new Set();
  const supportsPrefetch = (() => {
    const l = document.createElement("link");
    return l.relList && l.relList.supports && l.relList.supports("prefetch");
  })();

  function prefetch(url) {
    if (!url || prefetched.has(url)) return;
    prefetched.add(url);
    if (supportsPrefetch) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = url;
      link.as = "document";
      document.head.appendChild(link);
    } else {
      // Fallback: warm the HTTP cache with a quiet fetch.
      fetch(url, { credentials: "same-origin" }).catch(() => {});
    }
  }

  function internalLinks() {
    return Array.from(document.querySelectorAll('a[href$=".html"]'))
      .filter(a => a.hostname === window.location.hostname);
  }

  // Prefetch on hover / focus / touch (intent to navigate).
  ["mouseover", "touchstart", "focusin"].forEach(evt => {
    document.addEventListener(evt, e => {
      const a = e.target.closest && e.target.closest('a[href$=".html"]');
      if (a && a.hostname === window.location.hostname) prefetch(a.href);
    }, { passive: true });
  });

  // Prefetch the rest when the browser is idle.
  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1200));
  idle(() => internalLinks().forEach(a => prefetch(a.href)));
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
        const current = group.querySelector(".tabs__panel.is-active");
        const next = group.querySelector(`.tabs__panel[data-panel="${target}"]`);
        if (next === current) return;

        // Update the button states immediately.
        buttons.forEach(b => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", String(active));
        });

        if (prefersReducedMotion || !current) {
          panels.forEach(p => {
            p.classList.remove("is-leaving");
            p.classList.toggle("is-active", p === next);
          });
          return;
        }

        // Smooth cross-fade: fade the current panel out, then fade the
        // next one in once the outgoing transition finishes.
        current.classList.add("is-leaving");
        current.classList.remove("is-active");

        const swap = () => {
          current.classList.remove("is-leaving");
          next.classList.add("is-active");
          current.removeEventListener("transitionend", swap);
        };
        current.addEventListener("transitionend", swap);
        // Safety fallback in case transitionend doesn't fire.
        setTimeout(swap, 400);
      });
    });
  });
}

/* ----- Page-load fade-in + fade-out on internal navigation -----
   Makes multi-page browsing feel like a single smooth app rather than
   a hard reload between every tab. */
function initPageTransitions() {
  // Reveal the page (CSS hid it for the entrance animation).
  requestAnimationFrame(() => document.body.classList.add("is-ready"));

  if (prefersReducedMotion) return;

  // Restore visibility if the page is shown again from the bfcache
  // (e.g. the user taps "back") so it never stays stuck mid-fade-out.
  window.addEventListener("pageshow", () => {
    document.body.classList.remove("is-leaving");
    document.body.classList.add("is-ready");
  });

  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest("a");
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href) return;

    // Ignore new tabs, modifier-clicks, downloads, anchors, and external links.
    const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    const isInternal = a.hostname === window.location.hostname && !a.target;
    const isHash = href.startsWith("#");
    const isSamePage = a.pathname === window.location.pathname && (isHash || href === "");
    if (isModified || !isInternal || isHash || isSamePage || a.hasAttribute("download")) return;
    if (!/\.html?$/.test(a.pathname) && a.pathname !== "/") return;

    // Play the fade-out, then navigate.
    e.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(() => { window.location.href = a.href; }, 280);
  });
}

/* ----- Reveal-on-scroll -----
   Adds .is-visible to .reveal elements as they enter the viewport. */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  items.forEach(el => observer.observe(el));
}

/* ----- Boot ----- */
document.addEventListener("DOMContentLoaded", () => {
  mountChrome();
  initAccordions();
  initTabs();
  initPrefetch();
  initPageTransitions();
  initReveal();
});
