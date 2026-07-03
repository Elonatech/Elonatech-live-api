const redis = require("../lib/redis");
const logger = require("../lib/logger");


// Cache middleware factory — pass in how many seconds the cache should live
// Example: cache(60) caches the response for 60 seconds
const cache = (ttl = 60) => async (req, res, next) => {

  // Build a unique cache key from the request URL including any query params
  // Strip trailing slash so /api/v1/blog and /api/v1/blog/ resolve to the same key
  // This ensures clearCache("/api/v1/blog") works regardless of how the frontend calls it
  const raw = req.originalUrl;
  const key = raw.length > 1 && raw.endsWith('/') ? raw.slice(0, -1) : raw;

  try {
    // Check if we already have a cached response for this URL
    const cached = await redis.get(key);

    if (cached) {
      // Cache HIT — return the stored response immediately, DB never touched
      logger.debug(`Cache HIT: ${key}`);
      return res.status(200).json(cached);
    }

    // Cache MISS — no cached data found, we need to hit the DB
    // We intercept res.json() so we can save the response to Redis before sending it
    logger.debug(`Cache MISS: ${key}`);
    const originalJson = res.json.bind(res);

    res.json = async (data) => {
      // Only cache successful responses — no point caching errors
      if (res.statusCode === 200) {
        await redis.set(key, JSON.stringify(data), { ex: ttl });
      }
      // Call the original res.json to actually send the response to the client
      return originalJson(data);
    };

    next();
  } catch (error) {
    // If Redis is down, don't crash the app — just skip the cache and hit the DB

    logger.error("Cache error", { error: error.message });
    next();
  }
};

// Clears a specific cache key by exact URL
// Called after create/update/delete so users don't see stale data
// We use exact keys instead of pattern matching — Upstash free tier restricts the KEYS command
const clearCache = async (key) => {
  try {
    await redis.del(key);
    logger.info(`Cache cleared for: ${key}`);
  } catch (error) {
    logger.error("Clear cache error:", { error: error.message });
  }
};

module.exports = { cache, clearCache };