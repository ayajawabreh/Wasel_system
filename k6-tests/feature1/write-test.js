import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export function setup() {
  const res = http.post(
    `${BASE_URL}/api/v1/auth/login`,
    JSON.stringify({
      email: 'admain@example.com',
      password: '123',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (res.status !== 200 && res.status !== 201) {
    console.log('LOGIN FAILED:', res.status, res.body);
    throw new Error('Login failed');
  }

  return { token: res.json('access_token') };
}

function headers(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export default function (data) {

  const res1 = http.post(
    `${BASE_URL}/api/v1/incidents`,
    JSON.stringify({
      type: 'hazard',
      severity: 'medium',
      description: `test ${__VU}-${__ITER}`,
    }),
    { headers: headers(data.token) }
  );

  const res2 = http.post(
    `${BASE_URL}/api/v1/checkpoints`,
    JSON.stringify({
      name: `test ${__VU}-${__ITER}`,
      latitude: 31.95,
      longitude: 35.93,
      current_status: 'open',
    }),
    { headers: headers(data.token) }
  );

  check(res1, { 'incident created': r => r.status === 201 });
  check(res2, { 'checkpoint created': r => r.status === 201 });

  if (res1.status !== 201) {
    console.log('WRITE INCIDENT ERROR:', res1.status, res1.body);
  }

  if (res2.status !== 201) {
    console.log('WRITE CHECKPOINT ERROR:', res2.status, res2.body);
  }

  sleep(1);
}