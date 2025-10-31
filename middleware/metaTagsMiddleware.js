const cache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const metaTagsMiddleware = (req, res, next) => {
  res.locals.getMetaTags = (product) => {
    const baseUrl = process.env.FRONTEND_URL;
    return {
      'og:title': product.title,
      'og:description': product.description,
      'og:image': product.image,
      'og:url': `${baseUrl}/product/${product._id}`,
      'og:type': 'product',
      'og:site_name': 'Elonatech',
      'twitter:card': 'summary_large_image',
      'twitter:title': product.title,
      'twitter:description': product.description,
      'twitter:image': product.image
    };
  };

  res.locals.cache = {
    get: (key) => {
      const cached = cache.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.html;
      }
      return null;
    },
    set: (key, html) => {
      cache.set(key, { html, timestamp: Date.now() });
    }
  };

  next();
};

module.exports = metaTagsMiddleware;