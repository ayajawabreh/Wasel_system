import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 1,
  iterations: 2,
};

export default function () {
  // GET
  let getRes = http.get('http://localhost:3000/api/v1/report');

  console.log(`GET status=${getRes.status}`);

  check(getRes, {
    'GET status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // POST
  const payload = JSON.stringify({
    user_id: 1,
    description: `k6 mixed test ${Date.now()}`,
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

  let postRes = http.post('http://localhost:3000/api/v1/report', payload, params);

  console.log(`POST status=${postRes.status}`);
  console.log(`POST body=${postRes.body}`);

  check(postRes, {
    'POST status is 201 or 200': (r) => r.status === 201 || r.status === 200,
  });

  sleep(1);
}