import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const BASE_URL = 'http://localhost:3000';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hZGlhX3Rlc3RAZXhhbXBsZS5jb20iLCJzdWIiOjksInJvbGUiOiIiLCJpYXQiOjE3NzYxMTcyMDcsImV4cCI6MTc3NjEyMDgwN30.ITIJQTPfiJ1hL0ZGev_kzjKRXONpZoJC09UFCVVn1Sc';

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

export default function () {
  const uniqueId = `${__VU}-${__ITER}`;

  const payload = JSON.stringify({
    region: `LoadTest-${uniqueId}`,
    category: 'Traffic',
  });

  const res = http.post(`${BASE_URL}/alert-subscription`, payload, params);

  check(res, {
    'POST /alert-subscription status 201 or 200': (r) =>
      r.status === 201 || r.status === 200,
  });

  sleep(1);
}