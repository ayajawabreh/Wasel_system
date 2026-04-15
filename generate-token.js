const http = require('k6/http');
const { check } = require('k6');

// استبدل ببيانات user موجود في DB
const USER_CREDENTIALS = {
  username: 'admin@example.com',  // أو أي user موجود
  password: 'password123'
};

export default function() {
  const loginRes = http.post('http://localhost:3000/api/v1/auth/login', 
    JSON.stringify(USER_CREDENTIALS),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  check(loginRes, {
    'login success': (r) => r.status === 201 || r.status === 200
  });

  if (loginRes.status === 200 || loginRes.status === 201) {
    const token = loginRes.json('access_token');
    console.log(`✅ TOKEN: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`);
    console.log(`📋 Copy this: export ACCESS_TOKEN="Bearer ${token}"`);
  }
}

// تشغيل: k6 run generate-token.js

