import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 1,
  iterations: 3,
};

export default function () {
  let res = http.get('http://localhost:3000/api/v1/report');

  console.log(`status=${res.status}`);
  console.log(`body=${res.body}`);

  check(res, {
    'soak GET status is 200': (r) => r.status === 200,
  });

  sleep(8);
}