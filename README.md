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

## Instagram Videos

The site automatically loads reels from [@coach_kings2](https://www.instagram.com/coach_kings2/) via `data/instagram-videos.json`.

To refresh videos and thumbnails from Instagram:

```bash
python3 scripts/fetch-instagram.py
```

This fetches the latest reels, downloads thumbnails to `images/instagram/`, and updates the JSON catalog.

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
