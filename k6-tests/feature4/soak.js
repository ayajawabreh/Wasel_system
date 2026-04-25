import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '20s',
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
  const res2 = http.get(`${BASE_URL}/alert-subscription/my`, params);

  check(res1, {
    'GET /incidents status 200': (r) => r.status === 200,
  });

  check(res2, {
    'GET /alert-subscription/my status 200': (r) => r.status === 200,
  });

  sleep(3);
}