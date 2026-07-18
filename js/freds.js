(() => {
  const clock = document.getElementById("clock");
  const year = document.getElementById("year");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const igGrid = document.getElementById("igGrid");
  const eventsBoard = document.getElementById("eventsBoard");
  const eventsCta = document.getElementById("eventsCta");

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

  const fallbackEvents = [
    {
      date: "2026-07-26",
      time: "10:00 – 13:00",
      title: "Sunday Garden Brunch",
      place: "Garden patio",
      description: "Neighbourhood brunch in the garden — Allpress coffee, warm sausage rolls, and space to linger.",
      tag: "Weekly",
    },
    {
      date: "2026-08-02",
      time: "11:00 – 12:30",
      title: "Little Makers Morning",
      place: "Inside Fred's",
      description: "Family-friendly craft hour for little neighbours. Free to join — just grab a drink and pull up a chair.",
      tag: "Family",
    },
    {
      date: "2026-08-09",
      time: "14:00 – 15:30",
      title: "Good & Proper Matcha Tasting",
      place: "Counter + garden",
      description: "Learn how we whisk our vibrant matcha, then taste latte and spritz styles side by side.",
      tag: "Workshop",
    },
    {
      date: "2026-08-16",
      time: "12:00 – 16:00",
      title: "SE4 Book Swap",
      place: "Garden patio",
      description: "Bring a book, take a book. Soft jazz, cake, and community chat in the garden.",
      tag: "Community",
    },
    {
      date: "2026-08-23",
      time: "15:00 – 17:00",
      title: "Garden Open Mic",
      place: "Garden patio",
      description: "Acoustic sets and spoken word from Crofton Park & Brockley. Sign up on the day or DM @fredslondon.",
      tag: "Music",
    },
    {
      date: "2026-08-30",
      time: "09:00 – 11:00",
      title: "Regulars' Morning Meet",
      place: "Inside Fred's",
      description: "Coffee for the early crew — meet neighbours, share the Wi‑Fi, and start the week together.",
      tag: "Social",
    },
  ];

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
    observeReveals();
  };

  const fallbackPosts = [
    {
      image: "images/freds/instagram/matcha-latte.jpg",
      url: "https://www.instagram.com/p/DKmKpXxI0YH/",
      caption: "Our vibrant matcha comes from Good & Proper — come try it for yourself.",
      tag: "Matcha",
    },
    {
      image: "images/freds/instagram/iced-drinks.jpg",
      url: "https://www.instagram.com/p/DaplIBJNhMP/",
      caption: "Iced coffees, fresh juice, and neighbourhood SE4 vibes.",
      tag: "Drinks",
    },
    {
      image: "images/freds/instagram/grab-and-go.jpg",
      url: "https://www.instagram.com/p/DJWeGULISVj/",
      caption: "Your daily grab-and-go just got better — freshly made.",
      tag: "Grab & go",
    },
    {
      image: "images/freds/instagram/matcha-spritz.jpg",
      url: "https://www.instagram.com/p/DMkeX2NI4_B/",
      caption: "Matcha Spritz — iced, bright, and made to sip in the garden.",
      tag: "Seasonal",
    },
    {
      image: "images/freds/instagram/lemon-poppy-cake.jpg",
      url: "https://www.instagram.com/p/CDBWAT1nHCz/",
      caption: "Our vegan lemon poppy seed cake — homemade in Brockley.",
      tag: "Vegan bake",
    },
    {
      image: "images/freds/instagram/barista-matcha.jpg",
      url: "https://www.instagram.com/p/DLZ5Be7o6Kq/",
      caption: "Behind the counter — matcha whisked by hand, every cup.",
      tag: "Team",
    },
  ];

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
    observeReveals();
  };

  const loadJson = async (path) => {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error("bad status");
    return res.json();
  };

  const boot = async () => {
    try {
      const eventsData = await loadJson("data/events.json");
      renderEvents(eventsData.events || fallbackEvents);
      if (eventsCta && eventsData.cta?.href) {
        eventsCta.href = eventsData.cta.href;
        if (eventsData.cta.label) eventsCta.textContent = eventsData.cta.label;
      }
    } catch {
      renderEvents(fallbackEvents);
    }

    try {
      const igData = await loadJson("data/instagram-posts.json");
      renderIg(igData.posts || fallbackPosts);
    } catch {
      renderIg(fallbackPosts);
    }

    observeReveals();
  };

  observeReveals();
  boot();
})();
