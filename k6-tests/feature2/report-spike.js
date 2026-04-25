import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '5s', target: 1 },
    { duration: '5s', target: 2 },
    { duration: '5s', target: 1 },
  ],
};

export default function () {
  let res = http.get('http://localhost:3000/api/v1/report');

  check(res, {
    'spike GET status is 200': (r) => r.status === 200,
  });

  sleep(5);
}