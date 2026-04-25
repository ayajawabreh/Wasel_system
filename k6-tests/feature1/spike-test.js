import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '10s', target: 3 },
    { duration: '10s', target: 8 },
    { duration: '10s', target: 3 },
  ],
};

export default function () {

  // 🔥 نفس فكرة read test (GET requests)

  const res1 = http.get(`${BASE_URL}/api/v1/incidents`);

  const res2 = http.get(`${BASE_URL}/api/v1/checkpoints`);

  check(res1, {
    'incidents OK': (r) => r.status === 200,
  });

  check(res2, {
    'checkpoints OK': (r) => r.status === 200,
  });

  sleep(1);
}