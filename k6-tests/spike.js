import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '10s', target: 50 },
    { duration: '10s', target: 5 },
  ],
};

const BASE_URL = 'http://localhost:3000';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hZGlhX3Rlc3RAZXhhbXBsZS5jb20iLCJzdWIiOjksInJvbGUiOiIiLCJpYXQiOjE3NzYxMjA4MjYsImV4cCI6MTc3NjEyNDQyNn0.muwhHpXR1zGj9rwtS3PAgcV6QRdYDH0x0y2P1SndMLY';

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

export default function () {
  const res1 = http.get(`${BASE_URL}/incident`, params);
  console.log(`incident status: ${res1.status}`);

  const res2 = http.get(`${BASE_URL}/alert/my`, params);
  console.log(`alert status: ${res2.status}`);

  check(res1, {
    'GET /incident status 200': (r) => r.status === 200,
  });

  check(res2, {
    'GET /alert/my status 200': (r) => r.status === 200,
  });

  sleep(1);
}