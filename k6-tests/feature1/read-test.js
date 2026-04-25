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

  const body = res.json();
  return { token: body.access_token };
}

function headers(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export default function (data) {
  const res1 = http.get(`${BASE_URL}/api/v1/incidents`, {
    headers: headers(data.token),
  });

  const res2 = http.get(`${BASE_URL}/api/v1/checkpoints`, {
    headers: headers(data.token),
  });

  check(res1, { 'incidents OK': r => r.status === 200 });
  check(res2, { 'checkpoints OK': r => r.status === 200 });

  if (res1.status !== 200) {
    console.log('INCIDENTS ERROR:', res1.status, res1.body);
  }

  if (res2.status !== 200) {
    console.log('CHECKPOINTS ERROR:', res2.status, res2.body);
  }

  sleep(1);
}