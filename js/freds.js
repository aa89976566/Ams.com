(() => {
  const year = document.getElementById("year");
  const toggle = document.getElementById("navToggle");
  const overlay = document.getElementById("siteNavOverlay");
  const closeBtn = document.getElementById("navClose");
  const eventsBoard = document.getElementById("eventsBoard");
  const eventsCta = document.getElementById("eventsCta");
  const hoursTable = document.getElementById("hoursTable");
  const footerHours = document.getElementById("footerHours");
  const menuSections = document.getElementById("menuSections");
  const menuSource = document.getElementById("menuSource");

  if (year) year.textContent = String(new Date().getFullYear());

  const setNavOpen = (open) => {
    if (!overlay || !toggle) return;
    overlay.classList.toggle("is-open", open);
    overlay.setAttribute("aria-hidden", open ? "false" : "true");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  };

  if (toggle && overlay) {
    toggle.addEventListener("click", () => {
      setNavOpen(!overlay.classList.contains("is-open"));
    });

    closeBtn?.addEventListener("click", () => setNavOpen(false));

    overlay.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setNavOpen(false));
    });
  }

  const observeReveals = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = document.querySelectorAll(".reveal:not(.is-in)");

    if (reduceMotion) {
      reveals.forEach((el) => el.classList.add("is-in"));
      return;
    }

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("is-in"));
    }
  };

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formatEventDate = (iso) => {
    const d = new Date(`${iso}T12:00:00`);
    if (Number.isNaN(d.getTime())) return { day: "--", month: "" };
    return { day: String(d.getDate()), month: MONTHS[d.getMonth()] };
  };

  const loadJson = async (path) => {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error("bad status");
    return res.json();
  };

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const renderEvents = (events) => {
    if (!eventsBoard) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [...events]
      .filter((e) => {
        const d = new Date(`${e.date}T23:59:59`);
        return !Number.isNaN(d.getTime()) && d >= today;
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    if (!upcoming.length) {
      eventsBoard.innerHTML = `<p class="event-empty">No upcoming events listed. Follow @fredslondon for the latest.</p>`;
      return;
    }

    eventsBoard.innerHTML = upcoming
      .map((event) => {
        const { day, month } = formatEventDate(event.date);
        return `
      <article class="event-row reveal">
        <div class="event-date">
          <span class="day">${day}</span>
          <span class="month">${month}</span>
        </div>
        <div class="event-body">
          <h3>${escapeHtml(event.title)}</h3>
          <p>${escapeHtml(event.description)}</p>
          <div class="event-meta">
            <span class="tag">${escapeHtml(event.tag)}</span>
            <span>${escapeHtml(event.place)}</span>
          </div>
        </div>
        <div class="event-side">${escapeHtml(event.time)}</div>
      </article>`;
      })
      .join("");
  };

  const applyPlace = (place) => {
    if (hoursTable && place.hours?.length) {
      hoursTable.querySelector("tbody").innerHTML = place.hours
        .map((h) => `<tr><td>${escapeHtml(h.days)}</td><td>${escapeHtml(h.time)}</td></tr>`)
        .join("");
    }

    if (footerHours && place.hours?.length) {
      footerHours.innerHTML = place.hours
        .map(
          (h) =>
            `<div class="footer-hours-row"><span>${escapeHtml(h.days)}</span><span>${escapeHtml(h.time)}</span></div>`
        )
        .join("");
    }
  };

  const accentClass = (accent) => {
    if (accent === "blue") return "menu-section--blue";
    if (accent === "orange") return "menu-section--orange";
    if (accent === "simple") return "menu-section--simple";
    return "menu-section--gold";
  };

  const renderMenuItem = (item) => {
    const name = escapeHtml(item.name);
    const image = item.image ? escapeHtml(item.image) : "";
    return `
      <article class="menu-item">
        ${
          image
            ? `<div class="menu-img"><img src="${image}" alt="${name}" loading="lazy"></div>`
            : `<div class="menu-img" aria-hidden="true"></div>`
        }
        <div class="menu-name">${name}</div>
      </article>`;
  };

  const renderMenuList = (items) => `
    <div class="menu-list">
      ${(items || [])
        .map((item) => `<div class="menu-row"><span>${escapeHtml(item.name)}</span></div>`)
        .join("")}
    </div>`;

  const renderMenu = (data) => {
    if (!menuSections) return;
    if (menuSource && data.sourceNote) {
      menuSource.textContent = data.sourceNote;
    }

    menuSections.innerHTML = (data.categories || [])
      .map((cat) => {
        const accent = accentClass(cat.accent);
        const layout = cat.layout || "grid";
        let body = "";

        if (layout === "list" || cat.accent === "simple") {
          body = renderMenuList(cat.items);
        } else if (layout === "featured") {
          const featured = cat.featuredImage
            ? `<div class="menu-featured-img"><img src="${escapeHtml(cat.featuredImage)}" alt="${escapeHtml(cat.title)}" loading="lazy"></div>`
            : "";
          body = `${featured}${renderMenuList(cat.items)}`;
        } else {
          body = `<div class="menu-grid">${(cat.items || []).map(renderMenuItem).join("")}</div>`;
        }

        return `
      <section class="menu-section ${accent} ${layout === "featured" ? "menu-section--featured" : ""} reveal" id="menu-${escapeHtml(cat.id)}">
        <h2 class="menu-section-title">${escapeHtml(cat.title)}</h2>
        ${body}
      </section>`;
      })
      .join("");
  };

  const boot = async () => {
    try {
      const place = await loadJson("data/place.json");
      applyPlace(place);
    } catch {
      /* keep HTML defaults */
    }

    try {
      const eventsData = await loadJson("data/events.json");
      renderEvents(eventsData.events || []);
      if (eventsCta && eventsData.cta?.href) {
        eventsCta.href = eventsData.cta.href;
        if (eventsData.cta.label) eventsCta.textContent = eventsData.cta.label;
      }
    } catch {
      if (eventsBoard) {
        eventsBoard.innerHTML = `<p class="event-empty">Follow @fredslondon for upcoming community events.</p>`;
      }
    }

    try {
      const menuData = await loadJson("data/menu.json");
      renderMenu(menuData);
    } catch {
      if (menuSections) {
        menuSections.innerHTML = `<p class="event-empty">Menu details coming soon. Ask at the counter or DM @fredslondon.</p>`;
      }
    }

    observeReveals();
  };

  observeReveals();
  boot();
})();
