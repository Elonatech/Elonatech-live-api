const isCrawler = (userAgent) => {
  const crawlers = [
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegrambot',
    'pinterest',
    'googlebot'
  ];
  return crawlers.some(crawler =>
    userAgent.toLowerCase().includes(crawler)
  );
};

const crawlerMiddleware = (req, res, next) => {
  req.isCrawler = isCrawler(req.headers['user-agent'] || '');
  next();
};

module.exports = crawlerMiddleware;