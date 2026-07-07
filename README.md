# Coach Kings — Boxing Coach Website

Premium boxing coaching website for **Simon "Kingsley" Bent** (@coach_kings2), inspired by [Ultimate Performance](https://ultimateperformance.com/).

## Features

- Premium dark-theme landing page with hero, stats, method pillars, and client stories
- **Training Academy** section linking to [@coach_kings2](https://www.instagram.com/coach_kings2/) Instagram teaching videos
- Instagram embed support — add reel URLs to `js/config.js` → `instagramPosts`
- Client reviews from stacksFit (5.0 · 44 reviews)
- Online booking via [stacksfit.setmore.com](https://stacksfit.setmore.com/)
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
- **Embedded Instagram player** (playable on-site)
- **Story narrative** (full caption text)
- **Hashtags, category tag, and post date**

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
- **Booking:** [stacksfit.setmore.com](https://stacksfit.setmore.com/)
- **Email:** simon@stacksfit.co.uk
- **Phone:** +44 7943 785333
- **Location:** London, UK

## Credentials

- England Boxing Level 2 Amateur Coach
- Advanced Level 3 Personal Trainer
- Strength & Conditioning Coach
- Exercise Nutrition Practitioner
