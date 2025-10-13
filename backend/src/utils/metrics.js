const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'nycmg-backend'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code']
});

const userRegistrationsTotal = new client.Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations'
});

const trackUploadsTotal = new client.Counter({
  name: 'track_uploads_total',
  help: 'Total number of track uploads'
});

const activeUsers = new client.Gauge({
  name: 'active_users',
  help: 'Number of active users'
});

const databaseQueryDuration = new client.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5]
});

// Register all metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestTotal);
register.registerMetric(userRegistrationsTotal);
register.registerMetric(trackUploadsTotal);
register.registerMetric(activeUsers);
register.registerMetric(databaseQueryDuration);

module.exports = {
  register,
  httpRequestDurationMicroseconds,
  httpRequestTotal,
  userRegistrationsTotal,
  trackUploadsTotal,
  activeUsers,
  databaseQueryDuration
};