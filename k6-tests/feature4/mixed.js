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
  check(res1, {
    'GET /incidents status 200': (r) => r.status === 200,
  });

  const uniqueId = `${__VU}-${__ITER}`;
  const payload = JSON.stringify({
    region: `Mixed-${uniqueId}`,
    category: 'Traffic',
  });

  const res2 = http.post(`${BASE_URL}/alert-subscription`, payload, params);
  check(res2, {
    'POST /alert-subscription status 201 or 200': (r) =>
      r.status === 201 || r.status === 200,
  });

  const res3 = http.get(`${BASE_URL}/alert/my`, params);
  check(res3, {
    'GET /alert/my status 200': (r) => r.status === 200,
  });

  sleep(1);
}