(() => {
  const clock = document.getElementById("clock");
  const year = document.getElementById("year");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const igGrid = document.getElementById("igGrid");
  const eventsBoard = document.getElementById("eventsBoard");
  const eventsCta = document.getElementById("eventsCta");
  const reviewsGrid = document.getElementById("reviewsGrid");
  const reviewsNote = document.getElementById("reviewsNote");
  const hoursTable = document.getElementById("hoursTable");
  const amenityList = document.getElementById("amenityList");

  const pad = (n) => String(n).padStart(2, "0");

  const tick = () => {
    const now = new Date();
    if (clock) {
      clock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
  };

  tick();
  setInterval(tick, 1000);
  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && links) {
    const setOpen = (open) => {
      toggle.classList.toggle("is-open", open);
      links.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => {
      setOpen(!links.classList.contains("is-open"));
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
      eventsBoard.innerHTML = `<p class="event-empty">No upcoming events listed — follow @fredslondon for the latest.</p>`;
      return;
    }

    eventsBoard.innerHTML = upcoming
      .map((event, i) => {
        const { day, month } = formatEventDate(event.date);
        return `
      <article class="event-row reveal${i % 3 === 1 ? " reveal-delay-1" : i % 3 === 2 ? " reveal-delay-2" : ""}">
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

  const renderReviews = (data) => {
    if (!reviewsGrid) return;
    if (reviewsNote && data.sourcesNote) reviewsNote.textContent = data.sourcesNote;
    const list = (data.reviews || []).slice(0, 6);
    reviewsGrid.innerHTML = list
      .map((review, i) => {
        const stars = "★".repeat(review.stars || 5);
        return `
      <article class="review-card reveal${i % 3 === 1 ? " reveal-delay-1" : i % 3 === 2 ? " reveal-delay-2" : ""}">
        <div class="review-stars" aria-label="${review.stars || 5} stars">${stars}</div>
        <blockquote>“${review.quote}”</blockquote>
        <div class="review-meta">
          <span>${review.author}</span>
          <span class="source">${review.source}</span>
        </div>
      </article>`;
      })
      .join("");
  };

  const renderIg = (posts) => {
    if (!igGrid) return;
    igGrid.innerHTML = posts
      .map(
        (post, i) => `
      <a class="ig-card reveal${i % 3 === 1 ? " reveal-delay-1" : i % 3 === 2 ? " reveal-delay-2" : ""}" href="${post.url}" target="_blank" rel="noopener noreferrer">
        <figure>
          <img src="${post.image}" alt="${post.caption.replace(/"/g, "&quot;")}" loading="lazy" width="720" height="900">
        </figure>
        <div class="ig-body">
          <span class="ig-tag">${post.tag}</span>
          <p>${post.caption}</p>
          <span class="ig-link">View on Instagram →</span>
        </div>
      </a>`
      )
      .join("");
  };

  const applyPlace = (place) => {
    if (hoursTable && place.hours?.length) {
      hoursTable.querySelector("tbody").innerHTML = place.hours
        .map((h) => `<tr><td>${h.days}</td><td>${h.time}</td></tr>`)
        .join("");
    }
    if (amenityList && place.amenities?.length) {
      amenityList.innerHTML = place.amenities.map((a) => `<li>${a}</li>`).join("");
    }
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
      const reviewsData = await loadJson("data/reviews.json");
      renderReviews(reviewsData);
    } catch {
      if (reviewsGrid) {
        reviewsGrid.innerHTML = `<p class="event-empty">See reviews on Google Maps and Yelp.</p>`;
      }
    }

    try {
      const igData = await loadJson("data/instagram-posts.json");
      renderIg(igData.posts || []);
    } catch {
      if (igGrid) igGrid.innerHTML = "";
    }

    observeReveals();
  };

  observeReveals();
  boot();
})();
