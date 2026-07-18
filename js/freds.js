(() => {
  const year = document.getElementById("year");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const siteNav = document.querySelector(".site-nav");
  const eventsBoard = document.getElementById("eventsBoard");
  const eventsCta = document.getElementById("eventsCta");
  const hoursTable = document.getElementById("hoursTable");
  const menuSections = document.getElementById("menuSections");
  const menuSource = document.getElementById("menuSource");

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && links) {
    const panel = siteNav || links;
    const setOpen = (open) => {
      toggle.classList.toggle("is-open", open);
      panel.classList.toggle("is-open", open);
      links.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => {
      setOpen(!panel.classList.contains("is-open"));
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
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
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <div class="event-meta">
            <span class="tag">${event.tag}</span>
            <span>${event.place}</span>
          </div>
        </div>
        <div class="event-side">${event.time}</div>
      </article>`;
      })
      .join("");
  };

  const applyPlace = (place) => {
    if (hoursTable && place.hours?.length) {
      hoursTable.querySelector("tbody").innerHTML = place.hours
        .map((h) => `<tr><td>${h.days}</td><td>${h.time}</td></tr>`)
        .join("");
    }
  };

  const renderMenu = (data) => {
    if (!menuSections) return;
    if (menuSource) {
      const bits = [data.sourceNote, data.priceNote].filter(Boolean);
      menuSource.textContent = bits.join(" ");
    }

    const reported = (data.reportedPrices || [])
      .map(
        (row) => `
      <li>
        <div class="menu-items__name">${row.label}</div>
        ${row.source ? `<p class="menu-items__note">${row.source}</p>` : ""}
        <span class="menu-items__price">${row.price}</span>
      </li>`
      )
      .join("");

    const reportedBlock = reported
      ? `<section class="menu-section menu-section--prices reveal" id="menu-prices">
        <h2>Guest-reported prices</h2>
        <ul class="menu-items">${reported}</ul>
      </section>`
      : "";

    menuSections.innerHTML =
      reportedBlock +
      (data.categories || [])
        .map(
          (cat) => `
      <section class="menu-section reveal" id="menu-${cat.id}">
        <h2>${cat.title}</h2>
        <ul class="menu-items">
          ${(cat.items || [])
            .map(
              (item) => `
            <li>
              <div class="menu-items__name">${item.name}</div>
              ${item.note ? `<p class="menu-items__note">${item.note}</p>` : ""}
              ${item.price ? `<span class="menu-items__price">${item.price}</span>` : `<span class="menu-items__price menu-items__price--muted">ask</span>`}
            </li>`
            )
            .join("")}
        </ul>
      </section>`
        )
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
