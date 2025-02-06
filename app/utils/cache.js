// utils/cache.js

/**
 * Simple in-memory cache implementation.
 * Note: This cache is not persistent and is limited to a single server instance.
 */

const cache = {};

/**
 * Retrieves data from the cache if it exists and hasn't expired.
 * @param {string} key - The cache key.
 * @returns {any|null} - The cached data or null if not found/expired.
 */
const getCache = (key) => {
  const cached = cache[key];
  if (!cached) return null;

  const isExpired = Date.now() > cached.expiry;
  if (isExpired) {
    delete cache[key];
    return null;
  }

  return cached.value;
};

/**
 * Stores data in the cache with a Time-To-Live (TTL).
 * @param {string} key - The cache key.
 * @param {any} value - The data to cache.
 * @param {number} ttl - Time-To-Live in seconds.
 */
const setCache = (key, value, ttl = 3600) => { // ttl default is 1 hour
  const expiry = Date.now() + ttl * 1000;
  cache[key] = { value, expiry };
};

module.exports = { getCache, setCache };
