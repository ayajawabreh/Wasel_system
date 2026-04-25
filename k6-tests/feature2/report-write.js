import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 1,
  iterations: 2,
};

export default function () {
  const payload = JSON.stringify({
    user_id: 1,
    description: `k6 test report ${Date.now()}`,
    category: 'ACCIDENT',
    latitude: 31.95,
    longitude: 35.21,
    status: 'pending'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post('http://localhost:3000/api/v1/report', payload, params);

  console.log(`status=${res.status}`);
  console.log(`body=${res.body}`);

  check(res, {
    'status is 201 or 200': (r) => r.status === 201 || r.status === 200,
  });

  sleep(1);
}