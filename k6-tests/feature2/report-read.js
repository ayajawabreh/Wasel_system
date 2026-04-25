import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 1,
  duration: '20s',
};

export default function () {
  let res = http.get('http://localhost:3000/api/v1/report');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(6);
}