class AnalysisCache {
  constructor(defaultTtlMs = 10 * 60 * 1000) { // 10 minutes default TTL
    this.cache = new Map();
    this.ttl = defaultTtlMs;
  }

  /**
   * Set a value in the cache
   * @param {string} key - Stock ticker or search symbol
   * @param {any} value - The analysis result object
   */
  set(key, value) {
    const cacheKey = key.toUpperCase();
    this.cache.set(cacheKey, {
      data: value,
      timestamp: Date.now(),
    });
  }

  /**
   * Get a value from the cache if it exists and is not expired
   * @param {string} key - Stock ticker or search symbol
   * @returns {object|null} The cached data or null if not found/expired
   */
  get(key) {
    const cacheKey = key.toUpperCase();
    if (!this.cache.has(cacheKey)) {
      return null;
    }

    const cached = this.cache.get(cacheKey);
    const age = Date.now() - cached.timestamp;

    if (age > this.ttl) {
      // Expired, delete from cache
      this.cache.delete(cacheKey);
      return null;
    }

    return {
      data: cached.data,
      timestamp: cached.timestamp,
      ageMs: age,
      ageMinutes: Math.floor(age / 60000),
    };
  }

  /**
   * Check if a valid cache entry exists
   * @param {string} key - Stock ticker or search symbol
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
  }
}

// Export a singleton instance
module.exports = new AnalysisCache();
