import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// Custom metrics
export const routeDuration = new Trend('route_duration');
export const routeErrors = new Rate('route_errors');
export const routeSuccess = new Rate('route_success');
export const routeRequests = new Counter('route_requests');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  scenarios: {
    // 1) Read-heavy style for route estimation endpoint
    read_heavy_routes: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 10 },
        { duration: '40s', target: 20 },
        { duration: '20s', target: 0 },
      ],
      exec: 'readHeavyRoutes',
    },

    // 2) Write-heavy simulation using same endpoint with diverse inputs
    write_heavy_routes: {
      executor: 'constant-vus',
      vus: 2,
      duration: '30s',
      startTime: '1m30s',
      exec: 'writeHeavyRoutes',
    },

    // 3) Mixed workload
    mixed_workload_routes: {
      executor: 'constant-arrival-rate',
      rate: 12,
      timeUnit: '1s',
      duration: '45s',
      preAllocatedVUs: 20,
      maxVUs: 40,
      startTime: '2m20s',
      exec: 'mixedRoutes',
    },

    // 4) Spike test
    spike_routes: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 5 },
        { duration: '10s', target: 50 },
        { duration: '20s', target: 50 },
        { duration: '10s', target: 5 },
        { duration: '10s', target: 0 },
      ],
      startTime: '3m15s',
      exec: 'spikeRoutes',
    },

    // 5) Soak / sustained load
    soak_routes: {
      executor: 'constant-vus',
      vus: 8,
      duration: '2m',
      startTime: '4m10s',
      exec: 'soakRoutes',
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.1'],
    http_req_duration: ['p(95)<2000'],
    route_errors: ['rate<0.1'],
    route_success: ['rate>0.9'],
  },
};

function buildPayload() {
  const samples = [
    {
      startLatitude: 31.5326,
      startLongitude: 35.0998,
      endLatitude: 31.5204,
      endLongitude: 35.0938,
      avoidCheckpoints: true,
      avoidAreas: ['Area A'],
    },
    {
      startLatitude: 31.5330,
      startLongitude: 35.1005,
      endLatitude: 31.5185,
      endLongitude: 35.0950,
      avoidCheckpoints: false,
      avoidAreas: [],
    },
    {
      startLatitude: 31.5401,
      startLongitude: 35.1101,
      endLatitude: 31.5152,
      endLongitude: 35.0814,
      avoidCheckpoints: true,
      avoidAreas: ['Area B'],
    },
    {
      startLatitude: 31.5288,
      startLongitude: 35.0877,
      endLatitude: 31.5122,
      endLongitude: 35.1010,
      avoidCheckpoints: true,
      avoidAreas: ['Area A', 'Area C'],
    },
  ];

  return samples[Math.floor(Math.random() * samples.length)];
}

function sendRouteRequest(tagName = 'route_estimate') {
  const payload = JSON.stringify(buildPayload());

  const params = {
    headers: {
      'Content-Type': 'application/json',
     
    },
    tags: {
      name: tagName,
    },
  };

  const res = http.post(`${BASE_URL}/api/v1/routes/estimate`, payload, params);

  routeRequests.add(1);
  routeDuration.add(res.timings.duration);

  const ok = check(res, {
    'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'response has estimatedDistance': (r) => {
      try {
        const body = r.json();
        return body.estimatedDistance !== undefined;
      } catch {
        return false;
      }
    },
    'response has estimatedDuration': (r) => {
      try {
        const body = r.json();
        return body.estimatedDuration !== undefined;
      } catch {
        return false;
      }
    },
  });

  routeSuccess.add(ok);
  routeErrors.add(!ok);

  if (!ok) {
    console.log(`Failed response: status=${res.status}, body=${res.body}`);
  }

  return res;
}

export function readHeavyRoutes() {
  sendRouteRequest('read_heavy_routes');
  sleep(1);
}

export function writeHeavyRoutes() {
  sendRouteRequest('write_heavy_routes');
  sleep(0.5);
}

export function mixedRoutes() {
  sendRouteRequest('mixed_routes');
  sleep(Math.random() * 2);
}

export function spikeRoutes() {
  sendRouteRequest('spike_routes');
  sleep(0.2);
}

export function soakRoutes() {
  sendRouteRequest('soak_routes');
  sleep(1);
}