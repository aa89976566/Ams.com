# Coach Kings — Boxing Coach Website

**Live site:** [https://aa89976566.github.io/Ams.com/](https://aa89976566.github.io/Ams.com/)

Premium boxing coaching website for **Simon "Kingsley" Bent**, inspired by [Ultimate Performance](https://ultimateperformance.com/).

## Features

- Premium dark-theme landing page with hero, stats, method pillars, and client stories
- **Training Academy** section linking to [@coach_kings2](https://www.instagram.com/coach_kings2/) Instagram teaching videos
- Instagram embed support — add reel URLs to `js/config.js` → `instagramPosts`
- Client reviews from stacksFit (5.0 · 44 reviews)
- On site booking via **book.html** with services, pricing, and schedule pages
- Contact enquiry form (mailto)
- Fully responsive mobile design

## Quick Start

Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`

## Instagram API & Storytelling

Reels are collected from [@coach_kings2](https://www.instagram.com/coach_kings2/) via Instagram's public profile API and saved to `data/instagram-videos.json`.

Each reel includes:
- **On-site video player** — tap thumbnail to play in a modal (stays on your website)
- **Story narrative** (full caption text)
- **Hashtags, category tag, and post date**

Videos are downloaded to `videos/instagram/` during collection for self-hosted playback.

### Refresh videos manually

```bash
python3 scripts/fetch-instagram.py
```

### Automatic weekly sync

GitHub Actions runs every Monday (`.github/workflows/update-instagram.yml`) to pull new reels automatically.

### Frontend API

`js/instagram-api.js` loads `data/instagram-videos.json` and renders the story feed with Instagram embed.js.

## Coach Details

- **Name:** Simon "Kingsley" Bent
- **Instagram:** [@coach_kings2](https://www.instagram.com/coach_kings2/)
- **Booking:** [book.html](book.html) on site
- **Email:** simon@stacksfit.co.uk
- **Phone:** +44 7943 785333
- **Location:** London, UK

## Credentials

- England Boxing Level 2 Amateur Coach
- Advanced Level 3 Personal Trainer
- Strength & Conditioning Coach
- Exercise Nutrition Practitioner
