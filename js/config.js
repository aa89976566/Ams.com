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

  // Paste reel or post URLs from @coach_kings2 — they will auto-embed on the site.
  instagramPosts: [
    // Example: 'https://www.instagram.com/reel/XXXXXXXXX/'
  ],

  trainingCategories: [
  {
    title: 'Fundamentals & Stance',
    description: 'Master your guard, footwork, and the building blocks of real boxing.',
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f53f?w=800&q=80',
    tag: 'Technique'
  },
  {
    title: 'Punch Combinations',
    description: 'Jab, cross, hook, and uppercut — drilled with precision and purpose.',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80',
    tag: 'Combinations'
  },
  {
    title: 'Pad Work & Mitt Drills',
    description: 'Sports-specific drills that develop timing, power, and fight IQ.',
    image: 'https://images.unsplash.com/photo-1517438476312-10d79c0771a8?w=800&q=80',
    tag: 'Pad Work'
  },
  {
    title: 'Defence & Head Movement',
    description: 'Slip, roll, block, and counter — stay safe while staying dangerous.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    tag: 'Defence'
  },
  {
    title: 'Strength & Conditioning',
    description: '20+ years of S&C expertise to build explosive, durable athletes.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    tag: 'S&C'
  },
  {
    title: 'Sparring & Competition Prep',
    description: 'From white collar to elite amateur — coached for the ring.',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80',
    tag: 'Competition'
  }
  ]
};
