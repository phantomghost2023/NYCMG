# Monitoring and Observability Guide

This document provides instructions for setting up monitoring and observability for the NYCMG application.

## Overview

The NYCMG application uses a comprehensive monitoring stack that includes:

1. **Application Performance Monitoring (APM)** - Tracks application performance and errors
2. **Infrastructure Monitoring** - Monitors system resources and container health
3. **Log Management** - Centralized logging with search and analysis capabilities
4. **Database Monitoring** - Tracks database performance and queries
5. **Business Metrics** - Tracks user engagement and business KPIs

## Monitoring Stack Components

### 1. Prometheus
- Time-series database for metrics collection
- Scrapes metrics from application endpoints
- Provides querying capabilities with PromQL

### 2. Grafana
- Visualization platform for metrics and logs
- Pre-built dashboards for application monitoring
- Alerting capabilities

### 3. Loki
- Log aggregation system
- Integrates with Grafana for log visualization
- Efficient log storage and querying

### 4. Tempo
- Distributed tracing system
- Tracks requests across microservices
- Integrates with Grafana

## Backend API Monitoring

### Metrics Collection

The backend API exposes metrics endpoints for Prometheus:

1. **Application Metrics**: Custom business metrics
2. **System Metrics**: Node.js runtime metrics
3. **Database Metrics**: PostgreSQL query performance
4. **HTTP Metrics**: Request latency and response codes

### Implementation

#### 1. Install Prometheus Client

```bash
npm install prom-client
```

#### 2. Configure Metrics Collection

Create `backend/src/utils/metrics.js`:

```javascript
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

// Register all metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestTotal);
register.registerMetric(userRegistrationsTotal);
register.registerMetric(trackUploadsTotal);

module.exports = {
  register,
  httpRequestDurationMicroseconds,
  httpRequestTotal,
  userRegistrationsTotal,
  trackUploadsTotal
};
```

#### 3. Middleware for Metrics Collection

Create `backend/src/middleware/metrics.middleware.js`:

```javascript
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
```

#### 4. Metrics Endpoint

Add to `backend/src/routes/metrics.routes.js`:

```javascript
const express = require('express');
const { register } = require('../utils/metrics');

const router = express.Router();

router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

module.exports = router;
```

## Web Frontend Monitoring

### Client-Side Metrics

#### 1. Install Monitoring Libraries

```bash
npm install @sentry/react @sentry/tracing
```

#### 2. Configure Sentry

Create `web/src/utils/monitoring.js`:

```javascript
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});

export default Sentry;
```

#### 3. Error Boundary

Create `web/src/components/ErrorBoundary.js`:

```javascript
import React from 'react';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Mobile App Monitoring

### React Native Monitoring

#### 1. Install Monitoring Libraries

```bash
npm install @sentry/react-native
```

#### 2. Configure Sentry

Create `mobile/src/utils/monitoring.js`:

```javascript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

export default Sentry;
```

## Docker Compose Monitoring Stack

Create `monitoring/docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'

  # Grafana
  grafana:
    image: grafana/grafana-enterprise
    ports:
      - "3003:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false

  # Loki
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml

  # Promtail
  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - ./promtail/promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml

  # Tempo
  tempo:
    image: grafana/tempo:latest
    command: [ "-config.file=/etc/tempo.yaml" ]
    volumes:
      - ./tempo/tempo.yaml:/etc/tempo.yaml
      - tempo_data:/tmp/tempo
    ports:
      - "14268:14268"  # jaeger ingest
      - "3200:3200"    # tempo
      - "4317:4317"    # otlp grpc
      - "4318:4318"    # otlp http

volumes:
  prometheus_data:
  grafana_data:
  tempo_data:
```

## Prometheus Configuration

Create `monitoring/prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'nycmg-backend'
    static_configs:
      - targets: ['backend:3000']
    metrics_path: '/api/metrics'

  - job_name: 'nycmg-web'
    static_configs:
      - targets: ['web:3000']

  - job_name: 'nycmg-database'
    static_configs:
      - targets: ['db:5432']
    metrics_path: '/metrics'
```

## Grafana Provisioning

Create `monitoring/grafana/provisioning/datasources/datasources.yml`:

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100

  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
```

## Log Management

### Backend Logging

Update `backend/src/utils/logger.js`:

```javascript
const winston = require('winston');
const LokiTransport = require('winston-loki');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'nycmg-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ]
});

// Add Loki transport if configured
if (process.env.LOKI_HOST) {
  logger.add(new LokiTransport({
    host: process.env.LOKI_HOST,
    labels: { job: 'nycmg-backend' },
    json: true,
    format: winston.format.json()
  }));
}

// If we're not in production, log to the console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;
```

## Health Checks

### Backend Health Endpoint

Create `backend/src/routes/health.routes.js`:

```javascript
const express = require('express');
const sequelize = require('../config/database');

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        api: 'healthy'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;
```

## Alerting

### Prometheus Alerts

Create `monitoring/prometheus/alerts.yml`:

```yaml
groups:
- name: nycmg-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{code=~"5.."}[5m]) > 0.05
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High error rate (instance {{ $labels.instance }})"
      description: "High error rate on {{ $labels.instance }}\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"

  - alert: HighLatency
    expr: histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m])) > 1000
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High latency (instance {{ $labels.instance }})"
      description: "High latency on {{ $labels.instance }}\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"

  - alert: DatabaseDown
    expr: up{job="nycmg-database"} == 0
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Database down (instance {{ $labels.instance }})"
      description: "Database is down on {{ $labels.instance }}\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"
```

## Monitoring Dashboard

### Grafana Dashboards

Create `monitoring/grafana/provisioning/dashboards/nycmg-dashboard.json`:

```json
{
  "dashboard": {
    "id": null,
    "title": "NYCMG Application Dashboard",
    "tags": ["nycmg"],
    "timezone": "browser",
    "schemaVersion": 16,
    "version": 0,
    "refresh": "25s",
    "rows": [
      {
        "title": "API Metrics",
        "panels": [
          {
            "title": "HTTP Requests Rate",
            "type": "graph",
            "datasource": "Prometheus",
            "targets": [
              {
                "expr": "rate(http_requests_total[5m])",
                "legendFormat": "{{method}} {{route}} {{code}}"
              }
            ]
          },
          {
            "title": "HTTP Request Duration",
            "type": "graph",
            "datasource": "Prometheus",
            "targets": [
              {
                "expr": "histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))",
                "legendFormat": "{{method}} {{route}}"
              }
            ]
          }
        ]
      },
      {
        "title": "Business Metrics",
        "panels": [
          {
            "title": "User Registrations",
            "type": "stat",
            "datasource": "Prometheus",
            "targets": [
              {
                "expr": "user_registrations_total",
                "legendFormat": "Total Registrations"
              }
            ]
          },
          {
            "title": "Track Uploads",
            "type": "stat",
            "datasource": "Prometheus",
            "targets": [
              {
                "expr": "track_uploads_total",
                "legendFormat": "Total Uploads"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## Monitoring Scripts

### Health Check Script

Create `scripts/health-check.sh`:

```bash
#!/bin/bash

# Health check script for NYCMG services

echo "🏥 Checking NYCMG service health..."

# Check backend health
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
if [ $BACKEND_HEALTH -eq 200 ]; then
  echo "✅ Backend is healthy"
else
  echo "❌ Backend is unhealthy (HTTP $BACKEND_HEALTH)"
fi

# Check web health
WEB_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health)
if [ $WEB_HEALTH -eq 200 ]; then
  echo "✅ Web frontend is healthy"
else
  echo "❌ Web frontend is unhealthy (HTTP $WEB_HEALTH)"
fi

# Check database connection
DB_HEALTH=$(docker exec nycmg-db pg_isready -U postgres -d nycmg 2>/dev/null; echo $?)
if [ $DB_HEALTH -eq 0 ]; then
  echo "✅ Database is healthy"
else
  echo "❌ Database is unhealthy"
fi

echo "📊 Monitoring stack status:"
docker-compose -f monitoring/docker-compose.yml ps
```

## Best Practices

### 1. Metric Naming
- Use descriptive names with units
- Follow consistent naming conventions
- Include relevant labels

### 2. Alerting
- Set appropriate thresholds
- Avoid alert fatigue
- Include actionable information

### 3. Logging
- Use structured logging
- Include correlation IDs
- Log at appropriate levels

### 4. Performance
- Sample high-frequency metrics
- Use efficient queries
- Monitor monitoring overhead

## Troubleshooting

### Common Issues

1. **Metrics Not Showing**
   - Check Prometheus target status
   - Verify metrics endpoint is accessible
   - Check for network issues

2. **Grafana Dashboards Not Loading**
   - Verify datasource configuration
   - Check Grafana logs
   - Ensure proper permissions

3. **Alerts Not Firing**
   - Check alert rule syntax
   - Verify evaluation intervals
   - Test alert conditions

### Debugging Tips

1. **Check Prometheus Targets**
   ```bash
   curl http://localhost:9090/api/v1/targets
   ```

2. **Query Prometheus Directly**
   ```bash
   curl 'http://localhost:9090/api/v1/query?query=http_requests_total'
   ```

3. **Check Grafana Logs**
   ```bash
   docker logs nycmg-grafana
   ```

## Security Considerations

1. **Metrics Endpoint Security**
   - Restrict access to metrics endpoints
   - Use authentication for production
   - Expose metrics only on internal networks

2. **Log Data Protection**
   - Avoid logging sensitive information
   - Encrypt logs in transit and at rest
   - Implement log retention policies

3. **Monitoring Stack Security**
   - Secure Grafana with strong passwords
   - Restrict access to monitoring interfaces
   - Regularly update monitoring components