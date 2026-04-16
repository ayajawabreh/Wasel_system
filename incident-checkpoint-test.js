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
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
    checks: ['rate>0.99'],
  },
  stages: [
    { duration: '10s', target: 10 },   // ramp up
    { duration: '30s', target: 10 },   // sustain
    { duration: '10s', target: 0 },    // ramp down
  ],
};

function makeCheckpointPayload() {
  return JSON.stringify({
    name: `Test Checkpoint ${Date.now()}`,
    latitude: 31.952,
    longitude: 35.934,
    current_status: 'open'
  });
}

function makeIncidentPayload() {
  return JSON.stringify({
    type: 'closure',
    severity: 'high',
    description: `Test incident ${Date.now()}`,
    latitude: 31.952,
    longitude: 35.934,
    reported_by: 1
  });
}

export default function () {
  const checkpointReq = http.post(
    `${BASE_URL}/api/v1/checkpoints`,
    makeCheckpointPayload(),
    { headers: commonHeaders, tags: { name: 'POST /checkpoints' } }
  );

  check(checkpointReq, {
    'checkpoint create 201': (r) => r.status === 201,
  });

  // GET all checkpoints with pagination/filter
  const checkpointsList = http.get(
    `${BASE_URL}/api/v1/checkpoints?status=closed&page=1&limit=10`,
    { headers: commonHeaders, tags: { name: 'GET /checkpoints filtered' } }
  );

  check(checkpointsList, {
    'checkpoints list 200': (r) => r.status === 200,
  });

  // Create incident
  const incidentReq = http.post(
    `${BASE_URL}/api/v1/incidents`,
    makeIncidentPayload(),
    { headers: commonHeaders, tags: { name: 'POST /incidents' } }
  );

  check(incidentReq, {
    'incident create 201': (r) => r.status === 201,
  });

  // GET incidents with filtering
  const incidentsList = http.get(
    `${BASE_URL}/api/v1/incidents?type=closure&severity=high&status=open&page=1&limit=5`,
    { headers: commonHeaders, tags: { name: 'GET /incidents filtered+pagination' } }
  );

  check(incidentsList, {
    'incidents filtered 200': (r) => r.status === 200,
  });

  // Simulate moderator verify/close
  if (__VU === 1) {  // Only VU 1 does mutations
    sleep(0.5);
    
    // Get recent incident ID from response (mock for demo)
    const verifyReq = http.patch(
      `${BASE_URL}/api/v1/incidents/1/verify`,
      {},
      { headers: commonHeaders, tags: { name: 'PATCH /incidents/verify' } }
    );

    check(verifyReq, {
      'incident verify 200': (r) => r.status === 200,
    });
  }

  // GET checkpoint history
  const historyReq = http.get(
    `${BASE_URL}/api/v1/checkpoints/1/history`,
    { headers: commonHeaders, tags: { name: 'GET /checkpoints/history' } }
  );

  check(historyReq, {
    'checkpoint history 200': (r) => r.status === 200,
  });

  sleep(0.1);
}

export function handleSummary(data) {
  return {
    'feature1-performance.json': JSON.stringify(data),
    'feature1-performance.html': `<html><body><pre>${JSON.stringify(data, null, 2)}</pre></body></html>`,
    stdout: JSON.stringify({
      test: 'Feature 1: Road Incidents & Checkpoints',
      scenarios: 'CRUD + Filter + Pagination + History',
      pass_rate: `${Math.round((1 - data.metrics.http_req_failed.rate)*100)}%`,
      p95_latency: `${data.metrics.http_req_duration.p(95).toFixed(0)}ms`,
      rps: data.metrics.iterations.rate,
    }, null, 2)
  };
}
