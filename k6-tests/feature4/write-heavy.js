import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '10s',
};

const BASE_URL = 'http://localhost:3000/api/v1';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsImVtYWlsIjoibmFkaWFfdGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiIiLCJpYXQiOjE3NzY0NjM0MjgsImV4cCI6MTc3NjQ2NzAyOH0.P8yq2dCifEuw-yGPIgqNhT17dnoFOdO_dPOy3wmhGb4';

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

export default function () {
  const uniqueId = `${__VU}-${__ITER}`;

  const payload = JSON.stringify({
    region: `LoadTest-${uniqueId}`,
    category: 'Traffic',
  });

  const res = http.post(`${BASE_URL}/alert-subscription`, payload, params);
console.log(`status: ${res.status}`);
console.log(`body: ${res.body}`);
  check(res, {
    'POST /alert-subscription status 201 or 200': (r) =>
      r.status === 201 || r.status === 200,
  });

  sleep(1);
}