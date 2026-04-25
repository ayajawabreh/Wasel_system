import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    read_reports: {
      executor: 'constant-vus',
      vus: 5,
      duration: '20s',
    },
  },
};

const BASE_URL = 'http://localhost:3000/api/v1';

export default function () {
  const res = http.get(`${BASE_URL}/report`);

  console.log(`status: ${res.status}`);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}