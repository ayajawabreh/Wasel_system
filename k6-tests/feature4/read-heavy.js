import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '10s',
};

const BASE_URL = 'http://localhost:3000/api/v1';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsImVtYWlsIjoibmFkaWFfdGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NzY0NjQ4MjMsImV4cCI6MTc3NjQ2ODQyM30.BdqvGsGRRzJlYrdml9fdNi-jWXUl4Mx6vIX77qxG_0U';
const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

export default function () {
  const res1 = http.get(`${BASE_URL}/incidents`, params);
  console.log(`incidents status: ${res1.status}`);
  console.log(`incidents body: ${res1.body}`);

  const res2 = http.get(`${BASE_URL}/alert/my`, params);
  console.log(`alert status: ${res2.status}`);
  console.log(`alert body: ${res2.body}`);

  const res3 = http.get(`${BASE_URL}/alert-subscription/my`, params);
  console.log(`subscription status: ${res3.status}`);
  console.log(`subscription body: ${res3.body}`);

  check(res1, {
    'GET /incidents status 200': (r) => r.status === 200,
  });

  check(res2, {
    'GET /alert/my status 200': (r) => r.status === 200,
  });

  check(res3, {
    'GET /alert-subscription/my status 200': (r) => r.status === 200,
  });

  sleep(2);
}