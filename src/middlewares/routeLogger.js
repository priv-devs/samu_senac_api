module.exports = function routeLogger(opts = {}) {
  const { logger = console } = opts;

  return function (req, res, next) {
    const start = process.hrtime.bigint();
    const { method, originalUrl } = req;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
      const message = `${method} ${originalUrl} ${res.statusCode} - ${durationMs.toFixed(2)} ms - ${ip}`;
      if (logger && typeof logger.info === 'function') logger.info(message);
      else console.log(message);
    });

    next();
  };
};