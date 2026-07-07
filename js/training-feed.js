/**
 * Coach Kings — Training film feed
 * Loads session videos from data/instagram-videos.json
 */
const TrainingFeed = {
  cache: null,

  async getFeed() {
    if (this.cache) return this.cache;

    const version = (typeof COACH_CONFIG !== 'undefined' && COACH_CONFIG.assetVersion)
      ? COACH_CONFIG.assetVersion
      : '';
    const basePath = (typeof COACH_CONFIG !== 'undefined' && COACH_CONFIG.trainingData)
      ? COACH_CONFIG.trainingData
      : 'data/instagram-videos.json';
    const path = version ? `${basePath}?v=${version}` : basePath;

    const res = await fetch(path);
    if (!res.ok) throw new Error(`Training feed unavailable (${res.status})`);
    this.cache = await res.json();
    return this.cache;
  }
};
