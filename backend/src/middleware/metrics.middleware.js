const { httpRequestDurationMicroseconds, httpRequestTotal } = require('../utils/metrics');

const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    httpRequestDurationMicroseconds
      .labels(req.method, req.path, res.statusCode)
      .observe(duration);
      
    httpRequestTotal
      .labels(req.method, req.path, res.statusCode)
      .inc();
  });
  
  next();
};

module.exports = metricsMiddleware;