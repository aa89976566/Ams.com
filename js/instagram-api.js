/**
 * Coach Kings — Instagram API
 * Loads collected reels from data/instagram-videos.json (built by scripts/fetch-instagram.py)
 */
const InstagramAPI = {
  cache: null,

  async getFeed() {
    if (this.cache) return this.cache;

    const path = (typeof COACH_CONFIG !== 'undefined' && COACH_CONFIG.instagramData)
      ? COACH_CONFIG.instagramData
      : 'data/instagram-videos.json';

    const res = await fetch(path);
    if (!res.ok) throw new Error(`Instagram feed unavailable (${res.status})`);
    this.cache = await res.json();
    return this.cache;
  }
};
