// Coach Kings — Main JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });

    initNavigation();
    initMobileMenu();
    initHeroVideo();
    initCounters();
    await initInstagramStoryFeed();
    initReviewsCarousel();
    initEnquireForm();
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function initInstagramStoryFeed() {
    const hero = document.getElementById('storyHero');
    const feed = document.getElementById('storyFeed');
    if (!feed) return;

    let data;
    try {
        data = await InstagramAPI.getFeed();
    } catch (err) {
        console.warn(err);
        feed.innerHTML = '<p class="story-error">Instagram videos loading… <a href="https://www.instagram.com/coach_kings2/" target="_blank" rel="noopener">Watch on Instagram</a></p>';
        return;
    }

    const videos = data.videos || [];
    if (!videos.length) return;

    const embedBlock = (url) => `
        <blockquote
            class="instagram-media"
            data-instgrm-permalink="${url}"
            data-instgrm-version="14"
            style="background:#FFF;border:0;border-radius:4px;margin:0 auto;max-width:540px;min-width:280px;width:100%;">
        </blockquote>
    `;

    const renderStory = (video, featured = false) => {
        const tags = (video.hashtags || []).slice(0, 5).map(t => `#${escapeHtml(t)}`).join(' ');
        return `
        <article class="story-item${featured ? ' story-item--featured' : ''}">
            <div class="story-embed">${embedBlock(video.url)}</div>
            <div class="story-content">
                <div class="story-meta">
                    <span class="story-tag">${escapeHtml(video.tag)}</span>
                    ${video.postedAt ? `<span class="story-date">${escapeHtml(video.postedAt)}</span>` : ''}
                    ${video.duration ? `<span class="story-duration">${escapeHtml(video.duration)}</span>` : ''}
                </div>
                <h3>${escapeHtml(video.title)}</h3>
                <p class="story-narrative">${escapeHtml(video.story || video.caption || video.description || '')}</p>
                ${tags ? `<p class="story-hashtags">${tags}</p>` : ''}
                <a href="${video.url}" class="story-link" target="_blank" rel="noopener">
                    <i class="fab fa-instagram"></i> Open on Instagram
                </a>
            </div>
        </article>`;
    };

    if (hero) {
        const featured = videos[0];
        hero.innerHTML = `
            <div class="story-profile">
                <div class="story-profile-text">
                    <p class="story-profile-handle"><i class="fab fa-instagram"></i> @${escapeHtml(data.username)}</p>
                    <h3>${escapeHtml(data.fullName)}</h3>
                    <p class="story-profile-bio">${escapeHtml(data.bio)}</p>
                    <p class="story-profile-count">${videos.length} training reels collected</p>
                </div>
            </div>
            ${renderStory(featured, true)}
        `;
    }

    feed.innerHTML = videos.slice(hero ? 1 : 0).map(v => renderStory(v)).join('');
    InstagramAPI.processEmbeds();
}

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

function initHeroVideo() {
    const video = document.querySelector('.hero-video');
    if (!video) return;

    if (typeof COACH_CONFIG !== 'undefined') {
        const source = video.querySelector('source');
        if (source && COACH_CONFIG.heroVideo) source.src = COACH_CONFIG.heroVideo;
        if (COACH_CONFIG.heroPoster) video.poster = COACH_CONFIG.heroPoster;
    }

    const play = () => video.play().catch(() => {});
    play();
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) play();
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
