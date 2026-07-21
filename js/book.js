/**
 * Coach Kings — Booking form
 */
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    await populateServiceOptions(form);

    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        const name = data.get('fullName');
        const email = data.get('email');
        const phone = data.get('phone') || 'Not provided';
        const service = data.get('service') || 'Not specified';
        const location = data.get('location') || 'Not specified';
        const preferred = data.get('preferredTime') || 'Not specified';
        const experience = data.get('experience') || 'Not specified';
        const message = data.get('message') || '';

        const emailTo = (typeof COACH_CONFIG !== 'undefined' && COACH_CONFIG.email)
            ? COACH_CONFIG.email
            : 'simon@stacksfit.co.uk';

        const subject = encodeURIComponent(`Coach Kings booking request from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nPreferred location: ${location}\nPreferred time: ${preferred}\nExperience level: ${experience}\n\nGoals and notes:\n${message}`
        );

        window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
    });
});

async function populateServiceOptions(form) {
    const select = form.querySelector('#service');
    if (!select) return;

    try {
        const version = (typeof COACH_CONFIG !== 'undefined' && COACH_CONFIG.assetVersion)
            ? COACH_CONFIG.assetVersion
            : '';
        const path = version ? `data/site-content.json?v=${version}` : 'data/site-content.json';
        const res = await fetch(path);
        if (!res.ok) return;
        const data = await res.json();
        (data.services || []).forEach(service => {
            const opt = document.createElement('option');
            opt.value = service.title;
            opt.textContent = `${service.title} (from ${service.fromPrice})`;
            select.appendChild(opt);
        });
    } catch (err) {
        console.warn('Service list unavailable', err);
    }
}
