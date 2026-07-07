// Coach Kings — Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });

    initNavigation();
    initMobileMenu();
    initCounters();
    initVideoGallery();
    initInstagramEmbeds();
    initReviewsCarousel();
    initEnquireForm();
});

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const offset = 80;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });

            document.getElementById('navMenu')?.classList.remove('active');
        });
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        const spans = toggle.querySelectorAll('span');
        const open = menu.classList.contains('active');
        spans[0].style.transform = open ? 'rotate(45deg) translateY(7px)' : '';
        spans[1].style.opacity = open ? '0' : '1';
        spans[2].style.transform = open ? 'rotate(-45deg) translateY(-7px)' : '';
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;

        el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);

        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function initVideoGallery() {
    const featured = document.getElementById('videoFeatured');
    const grid = document.getElementById('videoGrid');
    if (!grid || typeof COACH_CONFIG === 'undefined') return;

    const videos = COACH_CONFIG.trainingVideos || [];
    if (!videos.length) return;

    const renderCard = (video, featuredCard = false) => `
        <a href="${video.url}" class="video-card${featuredCard ? ' video-card--featured' : ''}" target="_blank" rel="noopener" aria-label="Watch ${video.title} on Instagram">
            <div class="video-thumb">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <div class="video-play" aria-hidden="true">
                    <span class="video-play-icon"><i class="fas fa-play"></i></span>
                </div>
                <span class="video-badge">${video.tag}</span>
                ${video.duration ? `<span class="video-duration">${video.duration}</span>` : ''}
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <span class="video-watch"><i class="fab fa-instagram"></i> Watch on Instagram</span>
            </div>
        </a>
    `;

    if (featured) {
        featured.innerHTML = videos.slice(0, 3).map(v => renderCard(v, true)).join('');
    }

    const remaining = featured ? videos.slice(3) : videos;
    grid.innerHTML = remaining.length
        ? remaining.map(v => renderCard(v)).join('')
        : videos.map(v => renderCard(v)).join('');
}

function initInstagramEmbeds() {
    const container = document.getElementById('instagramEmbeds');
    if (!container || typeof COACH_CONFIG === 'undefined') return;

    const posts = COACH_CONFIG.instagramPosts.filter(Boolean);
    if (!posts.length) return;

    container.innerHTML = posts.map(url => `
        <blockquote
            class="instagram-media"
            data-instgrm-permalink="${url}"
            data-instgrm-version="14"
            style="background:#FFF;border:0;border-radius:4px;margin:0;max-width:100%;min-width:280px;padding:0;width:100%;">
        </blockquote>
    `).join('');

    if (window.instgrm) {
        window.instgrm.Embeds.process();
    } else {
        const check = setInterval(() => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
                clearInterval(check);
            }
        }, 200);
        setTimeout(() => clearInterval(check), 10000);
    }
}

function initReviewsCarousel() {
    const track = document.getElementById('reviewsTrack');
    const prev = document.getElementById('reviewPrev');
    const next = document.getElementById('reviewNext');
    if (!track || !prev || !next) return;

    let index = 0;

    function getVisible() {
        return window.innerWidth <= 1024 ? 1 : 2;
    }

    function getMaxIndex() {
        const cards = track.children.length;
        return Math.max(0, cards - getVisible());
    }

    function update() {
        const card = track.querySelector('.review-card');
        if (!card) return;
        const gap = 24;
        const offset = index * (card.offsetWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
    }

    prev.addEventListener('click', () => {
        index = index > 0 ? index - 1 : getMaxIndex();
        update();
    });

    next.addEventListener('click', () => {
        index = index < getMaxIndex() ? index + 1 : 0;
        update();
    });

    window.addEventListener('resize', () => {
        index = Math.min(index, getMaxIndex());
        update();
    });
}

function initEnquireForm() {
    const form = document.getElementById('enquireForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const data = new FormData(form);
        const firstName = data.get('firstName');
        const lastName = data.get('lastName');
        const email = data.get('email');
        const phone = data.get('phone') || 'Not provided';
        const goals = [...form.querySelectorAll('input[name="goals"]:checked')].map(i => i.value).join(', ') || 'Not specified';
        const message = data.get('message') || '';

        const subject = encodeURIComponent(`Coaching Enquiry from ${firstName} ${lastName}`);
        const body = encodeURIComponent(
            `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nGoals: ${goals}\n\nMessage:\n${message}`
        );

        window.location.href = `mailto:simon@stacksfit.co.uk?subject=${subject}&body=${body}`;
    });
}
