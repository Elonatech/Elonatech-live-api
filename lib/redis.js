const { Redis } = require("@upstash/redis");

// Create a single Redis client instance using credentials from .env
// @upstash/redis communicates over HTTP so no persistent TCP connection needed
// This means it works perfectly on serverless and free-tier platforms like Render
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = redis;