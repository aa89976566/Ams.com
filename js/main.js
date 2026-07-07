// Coach Kings — Main JavaScript

document.addEventListener('DOMContentLoaded', async () => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });

    initNavigation();
    initMobileMenu();
    initHeroVideo();
    initCounters();
    initVideoModal();
    await initTrainingFeed();
    initReviewsCarousel();
    initEnquireForm();
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function initTrainingFeed() {
    const hero = document.getElementById('storyHero');
    const feed = document.getElementById('storyFeed');
    if (!feed) return;

    let data;
    try {
        data = await TrainingFeed.getFeed();
    } catch (err) {
        console.warn(err);
        feed.innerHTML = '<p class="story-error">Videos could not be loaded. Please refresh the page.</p>';
        return;
    }

    const videos = data.videos || [];
    if (!videos.length) return;

    initMethodPillars(data, videos);

    const renderStory = (video, featured = false) => {
        const videoSrc = video.video || '';
        return `
        <article class="story-item${featured ? ' story-item--featured' : ''}">
            <button type="button" class="story-video-trigger" data-video="${escapeHtml(videoSrc)}" data-title="${escapeHtml(video.title)}" data-story="${escapeHtml(video.story || video.caption || '')}" aria-label="Play ${escapeHtml(video.title)}">
                <img src="${video.thumbnail}" alt="${escapeHtml(video.title)}" loading="lazy">
                <span class="story-play" aria-hidden="true"><i class="fas fa-play"></i></span>
                <span class="story-video-badge">${escapeHtml(video.tag)}</span>
                ${video.duration ? `<span class="story-video-duration">${escapeHtml(video.duration)}</span>` : ''}
            </button>
            <div class="story-content">
                <div class="story-meta">
                    <span class="story-tag">${escapeHtml(video.tag)}</span>
                    ${video.postedAt ? `<span class="story-date">${escapeHtml(video.postedAt)}</span>` : ''}
                </div>
                <h3>${escapeHtml(video.title)}</h3>
                <p class="story-narrative">${escapeHtml(video.story || video.caption || video.description || '')}</p>
            </div>
        </article>`;
    };

    if (hero) {
        const featured = videos[0];
        hero.innerHTML = `
            <div class="story-profile">
                <div class="story-profile-text">
                    <p class="story-profile-eyebrow">Coach's Film Room</p>
                    <h3>${escapeHtml(data.fullName)}</h3>
                    <p class="story-profile-bio">${escapeHtml(data.bio)}</p>
                    <p class="story-profile-count">${videos.length} sessions on film. Select any clip to play.</p>
                </div>
            </div>
            ${renderStory(featured, true)}
        `;
    }

    feed.innerHTML = videos.slice(hero ? 1 : 0).map(v => renderStory(v)).join('');
}

function initMethodPillars(data, videos) {
    const grid = document.getElementById('methodPillars');
    const pillars = data.methodPillars || [];
    if (!grid || !pillars.length || grid.children.length) return;

    const byShortcode = Object.fromEntries(videos.map(v => [v.shortcode, v]));

    const renderPillarVideo = (video) => `
        <button type="button" class="pillar-video-trigger story-video-trigger"
            data-video="${escapeHtml(video.video || '')}"
            data-title="${escapeHtml(video.title)}"
            data-story="${escapeHtml(video.story || '')}"
            aria-label="Play ${escapeHtml(video.title)}">
            <img src="${video.thumbnail}" alt="${escapeHtml(video.title)}" loading="lazy">
            <span class="pillar-video-play" aria-hidden="true"><i class="fas fa-play"></i></span>
            <span class="pillar-video-label">${escapeHtml(video.tag)}</span>
        </button>`;

    grid.innerHTML = pillars.map((pillar, index) => {
        const pillarVideos = (pillar.videos || [])
            .map(code => byShortcode[code])
            .filter(Boolean)
            .slice(0, 3);

        return `
        <article class="pillar-card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="pillar-icon"><i class="fas ${escapeHtml(pillar.icon)}"></i></div>
            <h3>${escapeHtml(pillar.title)}</h3>
            <p>${escapeHtml(pillar.intro)}</p>
            ${pillarVideos.length ? `
            <div class="pillar-videos">
                <p class="pillar-videos-label">Coach Kings sessions on film</p>
                <div class="pillar-videos-grid">
                    ${pillarVideos.map(renderPillarVideo).join('')}
                </div>
            </div>` : ''}
            <a href="#training" class="pillar-link">Watch full sessions <i class="fas fa-arrow-right"></i></a>
        </article>`;
    }).join('');
}

function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('modalVideo');
    const info = document.getElementById('modalInfo');
    const backdrop = document.getElementById('videoModalBackdrop');
    const closeBtn = document.getElementById('videoModalClose');
    if (!modal || !player) return;

    const open = (src, title, story) => {
        if (!src) return;
        player.src = src;
        player.currentTime = 0;
        info.innerHTML = `
            <h3>${escapeHtml(title)}</h3>
            ${story ? `<p>${escapeHtml(story)}</p>` : ''}
        `;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        player.play().catch(() => {});
    };

    const close = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        player.pause();
        player.removeAttribute('src');
        player.load();
    };

    document.addEventListener('click', e => {
        const btn = e.target.closest('.story-video-trigger');
        if (!btn) return;
        open(btn.dataset.video, btn.dataset.title, btn.dataset.story);
    });

    backdrop?.addEventListener('click', close);
    closeBtn?.addEventListener('click', close);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
}

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const logoImg = document.querySelector('.logo img');

    if (logoImg && typeof COACH_CONFIG !== 'undefined' && COACH_CONFIG.logo) {
        logoImg.src = COACH_CONFIG.logo;
    }

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
