import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const ACCESS_TOKEN = __ENV.ACCESS_TOKEN || '';

const commonHeaders = {
  'Content-Type': 'application/json',
  ...(ACCESS_TOKEN ? { Authorization: `Bearer ${ACCESS_TOKEN}` } : {}),
};

export const options = {
  discardResponseBodies: false,
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1500'],
    checks: ['rate>0.95'],
  },
  scenarios: {
    read_heavy_incidents: {
      executor: 'constant-vus',
      exec: 'readHeavyIncidents',
      vus: 15,
      duration: '30s',
      tags: { scenario: 'read-heavy' },
    },

    write_heavy_reports: {
      executor: 'constant-vus',
      exec: 'writeHeavyReports',
      vus: 8,
      duration: '30s',
      tags: { scenario: 'write-heavy' },
    },

    mixed_workload: {
      executor: 'constant-vus',
      exec: 'mixedWorkload',
      vus: 10,
      duration: '30s',
      tags: { scenario: 'mixed' },
    },

    spike_routes: {
      executor: 'ramping-vus',
      exec: 'spikeRoutes',
      stages: [
        { duration: '10s', target: 5 },
        { duration: '10s', target: 40 },
        { duration: '20s', target: 40 },
        { duration: '10s', target: 5 },
      ],
      gracefulRampDown: '0s',
      tags: { scenario: 'spike' },
    },

    soak_routes: {
      executor: 'constant-vus',
      exec: 'soakRoutes',
      vus: 5,
      duration: '2m',
      tags: { scenario: 'soak' },
    },
  },
};

function makeRoutePayload() {
  return JSON.stringify({
    startLatitude: 31.95,
    startLongitude: 35.93,
    endLatitude: 31.98,
    endLongitude: 35.96,
    avoidCheckpoints: true,
    avoidAreas: ['Area A'],
  });
}

function makeReportPayload() {
  return JSON.stringify({
    category: 'checkpoint_delay',
    description: `k6 generated report ${Date.now()}`,
    latitude: 31.952,
    longitude: 35.934,
  });
}

export function readHeavyIncidents() {
  const res = http.get(
    `${BASE_URL}/api/v1/incidents?page=1&limit=10&sortBy=createdAt&order=DESC`,
    { headers: commonHeaders, tags: { name: 'GET /incidents' } },
  );

  check(res, {
    'read-heavy incidents status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

export function writeHeavyReports() {
  const res = http.post(
   `${BASE_URL}/report`,
    makeReportPayload(),
    { headers: commonHeaders, tags: { name: 'POST /reports' } },
  );

  check(res, {
    'write-heavy reports status is 201 or 200': (r) =>
      r.status === 201 || r.status === 200,
  });

  sleep(1);
}

export function mixedWorkload() {
  const pick = Math.random();

  if (pick < 0.5) {
    const incidentsRes = http.get(
      `${BASE_URL}/api/v1/incidents?page=1&limit=5`,
      { headers: commonHeaders, tags: { name: 'GET /incidents' } },
    );

    check(incidentsRes, {
      'mixed incidents status is 200': (r) => r.status === 200,
    });
  } else if (pick < 0.8) {
    const routeRes = http.post(
      `${BASE_URL}/api/v1/routes/estimate`,
      makeRoutePayload(),
      { headers: commonHeaders, tags: { name: 'POST /routes/estimate' } },
    );

    check(routeRes, {
      'mixed routes status is 200': (r) => r.status === 200,
    });
  } else {
    const reportRes = http.post(
      `${BASE_URL}/api/v1/reports`,
      makeReportPayload(),
      { headers: commonHeaders, tags: { name: 'POST /reports' } },
    );

    check(reportRes, {
      'mixed reports status is 201 or 200': (r) =>
        r.status === 201 || r.status === 200,
    });
  }

  sleep(1);
}

export function spikeRoutes() {
  const res = http.post(
    `${BASE_URL}/api/v1/routes/estimate`,
    makeRoutePayload(),
    { headers: commonHeaders, tags: { name: 'POST /routes/estimate' } },
  );

  check(res, {
    'spike routes status is 200': (r) => r.status === 200,
  });

  sleep(0.5);
}

export function soakRoutes() {
  const res = http.post(
    `${BASE_URL}/api/v1/routes/estimate`,
    makeRoutePayload(),
    { headers: commonHeaders, tags: { name: 'POST /routes/estimate' } },
  );

  check(res, {
    'soak routes status is 200': (r) => r.status === 200,
  });

  sleep(2);
}