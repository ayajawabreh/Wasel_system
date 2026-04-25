# Performance Report — Feature 2: Crowdsourced Reporting & Voting

**Project:** Wasel System  
**Feature:** Feature 2 — Crowdsourced Reporting & Voting  
**Tool:** k6  
**Date:** April 2026  

---

## 1. Test Environment

| Item | Value |
|------|-------|
| Server | localhost:3000 |
| Framework | NestJS |
| Database | MySQL |
| API Base URL | /api/v1 |
| Tool | k6 |

---

## 2. Tested Endpoints

The following endpoints were tested:

- `GET /api/v1/report` → retrieve reports
- `POST /api/v1/report` → create a new report
- `PATCH /api/v1/report/:id/status` → update report status
- `DELETE /api/v1/report/:id` → delete report

These endpoints represent the full CRUD operations of the reporting system.

---

## 3. Executed Test Scenarios

### 3.1 Read-Heavy
GET `/api/v1/report`

### 3.2 Write-Heavy
POST `/api/v1/report`

### 3.3 Mixed Workload
GET + POST

### 3.4 Spike Testing
sudden load increase

### 3.5 Soak Testing
long repeated requests

---

## 4. Results Summary

| Scenario | Result | Notes |
|----------|--------|-------|
| Read-Heavy | 100% success | Stable |
| Write-Heavy | 100% success | 201 Created |
| Mixed | 100% success | Works correctly |
| Spike | Partial failures | Burst sensitivity |
| Soak | High failure rate | Throttling triggered |

---

## 5. Detailed Results

### Read
- 100% success
- HTTP 200

### Write
- 100% success
- HTTP 201

### Mixed
- GET → 200  
- POST → 201  

### Spike
- Some requests failed
- due to sudden load increase

### Soak
- Most requests failed after initial success
- due to sustained repeated requests

---

## 6. Bottleneck

### Rate Limiting (Throttling)

- system blocks excessive requests
- causes failures in spike & soak scenarios

---

## 7. Analysis

During initial testing, some requests failed due to server-side rate limiting (throttling).  
After adjusting the request rate in k6, the system achieved 100% success under controlled load.

However, under spike and soak scenarios, failures still occurred due to backend protection mechanisms.  
These failures do not indicate incorrect functionality, but rather intentional load control behavior.

---

## 8. Limitations

- failures under heavy load
- throttling affects throughput
- cannot measure full system capacity under unrestricted load

---

## 9. Fixes During Testing

- corrected API path `/api/v1/report`
- added required `status` field in POST requests
- adjusted request rate for stable validation
- separated functional testing from stress behavior

---

## 10. Conclusion

- Feature works correctly under normal conditions 

- Fast response times observed   
- Backend protection mechanisms function as expected 
- Performance under heavy load is limited by throttling 

Overall, the system is stable and responsive, with controlled behavior under high load conditions.