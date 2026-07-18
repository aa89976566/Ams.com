(() => {
  const clock = document.getElementById("clock");
  const year = document.getElementById("year");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const igGrid = document.getElementById("igGrid");

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

  const fallbackPosts = [
    {
      image: "images/freds/instagram/pastry-case.jpg",
      url: "https://www.instagram.com/p/DNAdmBModix/",
      caption: "Fresh from the case — croissants, muffins, pasteis de nata and homemade cakes.",
      tag: "Inside Fred's",
    },
    {
      image: "images/freds/instagram/sausage-rolls.jpg",
      url: "https://www.instagram.com/p/DOYF3XPjDkp/",
      caption: "Come and grab a warm Fred's sausage roll.",
      tag: "Signature bake",
    },
    {
      image: "images/freds/instagram/matcha-latte.jpg",
      url: "https://www.instagram.com/p/DKmKpXxI0YH/",
      caption: "Our vibrant matcha comes from Good & Proper — come try it for yourself.",
      tag: "Matcha",
    },
    {
      image: "images/freds/instagram/lemon-poppy-cake.jpg",
      url: "https://www.instagram.com/p/CDBWAT1nHCz/",
      caption: "Our vegan lemon poppy seed cake — homemade in Brockley.",
      tag: "Vegan bake",
    },
    {
      image: "images/freds/instagram/grab-and-go.jpg",
      url: "https://www.instagram.com/p/DJWeGULISVj/",
      caption: "Your daily grab-and-go just got better — freshly made.",
      tag: "Grab & go",
    },
    {
      image: "images/freds/instagram/iced-drinks.jpg",
      url: "https://www.instagram.com/p/DaplIBJNhMP/",
      caption: "Iced coffees, fresh juice, and neighbourhood SE4 vibes.",
      tag: "Drinks",
    },
    {
      image: "images/freds/instagram/matcha-spritz.jpg",
      url: "https://www.instagram.com/p/DMkeX2NI4_B/",
      caption: "Matcha Spritz — iced, bright, and made to sip in the garden.",
      tag: "Seasonal",
    },
    {
      image: "images/freds/instagram/latte-pour.jpg",
      url: "https://www.instagram.com/p/DWnpzhKjBwj/",
      caption: "Neighbourhood coffeeshop energy — SE4.",
      tag: "Coffee",
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

  const loadIg = async () => {
    try {
      const res = await fetch("data/instagram-posts.json", { cache: "no-store" });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      renderIg(data.posts || fallbackPosts);
    } catch {
      renderIg(fallbackPosts);
    }
  };

  observeReveals();
  loadIg();
})();
