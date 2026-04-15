import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

export const routeDuration = new Trend('route_duration');
export const errorRate = new Rate('error_rate');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TOKEN = __ENV.JWT_TOKEN || '';

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2500'],
    route_duration: ['p(95)<2500'],
    http_req_failed: ['rate<0.05'],
    error_rate: ['rate<0.05'],
  },
};

export default function () {
  const payload = JSON.stringify({
    startLatitude: 31.95,
    startLongitude: 35.93,
    endLatitude: 31.98,
    endLongitude: 35.96,
    avoidCheckpoints: true,
    avoidAreas: ['Area A'],
  });

  const res = http.post(
    `${BASE_URL}/api/v1/routes/estimate`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );

  routeDuration.add(res.timings.duration);

  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
    'response has estimatedDistance': (r) => r.body.includes('estimatedDistance'),
    'response has estimatedDuration': (r) => r.body.includes('estimatedDuration'),
  });

  errorRate.add(!success);

  console.log(`status=${res.status}`);
  console.log(res.body);

  sleep(1);
}