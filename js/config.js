/**
 * Coach Kings — Site Configuration
 * Add Instagram reel/post URLs to instagramPosts to embed teaching videos.
 */
const COACH_CONFIG = {
  name: 'Simon "Kingsley" Bent',
  brand: 'Coach Kings',
  tagline: 'World-Class Boxing Coaching',
  instagram: 'https://www.instagram.com/coach_kings2/',
  instagramHandle: '@coach_kings2',
  booking: 'https://stacksfit.setmore.com/',
  email: 'simon@stacksfit.co.uk',
  phone: '+44 7943 785333',
  location: 'London, UK',

  heroVideo: 'images/videos/hero-boxing.mp4',
  heroPoster: 'images/videos/pad-work.jpg',

  instagramPosts: [],

  trainingVideos: [
    {
      title: 'Online Boxing Drills',
      description: 'Follow-along technique drills you can practice anywhere.',
      thumbnail: 'images/videos/reel-1.png',
      url: 'https://www.instagram.com/coach_kings2/',
      tag: 'Reel',
      duration: '0:60'
    },
    {
      title: 'Pad Work Session',
      description: 'Real mitt work — timing, power, and combination flow.',
      thumbnail: 'images/videos/reel-2.png',
      url: 'https://www.instagram.com/coach_kings2/',
      tag: 'Pad Work',
      duration: '0:45'
    },
    {
      title: 'Strength & Boxing Combo',
      description: 'Blend boxing skills with strength training for full-body results.',
      thumbnail: 'images/videos/reel-3.png',
      url: 'https://www.instagram.com/coach_kings2/',
      tag: 'S&C',
      duration: '1:00'
    },
    {
      title: '1-to-1 Boxing Coaching',
      description: 'Personalised sessions tailored to your level and goals.',
      thumbnail: 'images/videos/boxing-121.jpg',
      url: 'https://www.instagram.com/coach_kings2/',
      tag: '1-to-1',
      duration: '2:30'
    },
    {
      title: 'Mitt Drills & Technique',
      description: 'Sports-specific pad drills that develop fight IQ and precision.',
      thumbnail: 'images/videos/pad-work.jpg',
      url: 'https://www.instagram.com/coach_kings2/',
      tag: 'Technique',
      duration: '1:15'
    },
    {
      title: 'Junior Boxing Programme',
      description: 'Safe, structured boxing for young athletes — DBS certified coaching.',
      thumbnail: 'images/videos/junior-boxing.jpg',
      url: 'https://www.instagram.com/coach_kings2/',
      tag: 'Juniors',
      duration: '1:30'
    }
  ]
};
