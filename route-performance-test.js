import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  const payload = JSON.stringify({
    startLatitude: 31.95,
    startLongitude: 35.93,
    endLatitude: 31.98,
    endLongitude: 35.96,
    avoidCheckpoints: true,
    avoidAreas: ['Area A'],
  });

  const res = http.post('http://localhost:3000/api/v1/routes/estimate', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  console.log(`status=${res.status}`);
  console.log(res.body);

  sleep(1);
}