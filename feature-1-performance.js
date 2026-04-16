import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// ---------------- TOKEN ----------------
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImVtYWlsIjoiYWRtYWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc2MjgwNTUwLCJleHAiOjE3NzYzNjY5NTB9.jNxCa7DcB9f1ZQPbzDKCAo_c1gYU7_CffFKDyYV_eCw';

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  };
}

// ---------------- PAYLOADS ----------------
function incidentPayload() {
  return JSON.stringify({
    type: 'hazard',
    severity: 'medium',
    description: 'k6 incident test',
  });
}

function checkpointPayload() {
  return JSON.stringify({
    name: 'k6 checkpoint',
    latitude: 31.95,
    longitude: 35.93,
    current_status: 'open',
  });
}

// ---------------- FUNCTIONS ----------------
export function readIncidents() {
  const res = http.get(`${BASE_URL}/api/v1/incidents`, {
    headers: headers(),
  });

  check(res, { 'read incidents 200': (r) => r.status === 200 });
  sleep(1);
}

export function readCheckpoints() {
  const res = http.get(`${BASE_URL}/api/v1/checkpoints`, {
    headers: headers(),
  });

  check(res, { 'read checkpoints 200': (r) => r.status === 200 });
  sleep(1);
}

export function writeIncident() {
  const res = http.post(
    `${BASE_URL}/api/v1/incidents`,
    incidentPayload(),
    { headers: headers() }
  );

  check(res, { 'write incident 201': (r) => r.status === 201 });
  sleep(1);
}

export function writeCheckpoint() {
  const res = http.post(
    `${BASE_URL}/api/v1/checkpoints`,
    checkpointPayload(),
    { headers: headers() }
  );

  check(res, { 'write checkpoint 201': (r) => r.status === 201 });
  sleep(1);
}

// ---------------- SCENARIOS (ONE ONLY) ----------------
export const options = {
  scenarios: {
    read: {
      executor: 'constant-vus',
      vus: 5,
      duration: '20s',
      exec: 'readIncidents',
    },

    read_cp: {
      executor: 'constant-vus',
      vus: 5,
      duration: '20s',
      exec: 'readCheckpoints',
    },

    write: {
      executor: 'constant-vus',
      vus: 3,
      duration: '20s',
      exec: 'writeIncident',
    },

    write_cp: {
      executor: 'constant-vus',
      vus: 2,
      duration: '20s',
      exec: 'writeCheckpoint',
    },

    // 🔥 Spike test
    spike: {
      executor: 'ramping-vus',
      stages: [
        { duration: '5s', target: 5 },
        { duration: '10s', target: 50 },
        { duration: '5s', target: 5 },
      ],
      exec: 'readIncidents',
    },

    // 🔥 Soak test
    soak: {
      executor: 'constant-vus',
      vus: 5,
      duration: '2m',
      exec: 'readIncidents',
    },
  },
};

// ---------------- MIXED DEFAULT ----------------
export default function () {
  const rand = Math.random();

  if (rand < 0.7) {
    readIncidents();
  } else {
    writeIncident();
  }
}