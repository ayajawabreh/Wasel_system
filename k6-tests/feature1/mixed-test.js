import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {

  const rand = Math.random();

  if (rand < 0.7) {

    // 🔵 READ logic (from read-test.js)
    const res1 = http.get(`${BASE_URL}/api/v1/incidents`);
    const res2 = http.get(`${BASE_URL}/api/v1/checkpoints`);

    check(res1, { 'incidents OK': r => r.status === 200 });
    check(res2, { 'checkpoints OK': r => r.status === 200 });

  } else {

    // 🔴 WRITE logic (from write-test.js)
    const res1 = http.post(`${BASE_URL}/api/v1/incidents`,
      JSON.stringify({
        type: 'hazard',
        severity: 'medium',
        description: `test`,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );

    check(res1, { 'incident created': r => r.status === 201 });
  }

  sleep(1);
}