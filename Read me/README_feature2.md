# Wasel System — Feature 2: Crowdsourced Reporting & Moderation 
Wasel System is a crowdsourced reporting platform that allows users to submit reports, vote on them, and enables moderators to verify and manage reports with full transparency.

The system ensures data reliability through voting, moderation control, and full logging of actions.

---

## Technology Stack

- Backend: NestJS (Node.js)
- Database: MySQL + TypeORM
- Validation: class-validator
- Testing: API-Dog

---

## System Architecture

Client (Web / Mobile) → NestJS API → MySQL Database

Modules:
- Report Module
- ReportVote Module
- ModerationLog Module

---

## Database Tables

### report
- id (Primary Key)
- user_id
- description
- category
- latitude
- longitude
- timestamp
- status (pending, verified, rejected)

### reportvote
- id (Primary Key)
- user_id
- report_id
- vote_type (upvote, downvote)

### moderationlog
- id (Primary Key)
- moderator_id
- action_type
- target_type
- target_id
- reason
- created_at

---

## API Endpoints

### Reports
- GET /api/v1/report → Get all reports
- GET /api/v1/report/:id → Get report by ID
- POST /api/v1/report → Create report
- PATCH /api/v1/report/:id/status → Update report status
- POST /api/v1/report/:id/approve → Approve report
- DELETE /api/v1/report/:id → Delete report

### Voting
- POST /api/v1/report-vote → Add vote
- GET /api/v1/report-vote → Get all votes

### Score
- GET /api/v1/report/:id/score → Get report score

---

## System Logic

- Duplicate reports are prevented based on description, category, and location
- Each user can vote only once per report
- Voting system:
  - upvote = +1
  - downvote = -1
- Score is calculated dynamically from votes
- Approving or deleting a report creates a log in moderationlog
- Deleting a report also deletes its related votes

---

## Example Requests

### Create Report
{
  "user_id": 3,
  "description": "There is a car accident",
  "category": "ACCIDENT",
  "latitude": 31.9,
  "longitude": 35.2,
  "status": "pending"
}

### Vote
{
  "user_id": 3,
  "report_id": 8,
  "vote_type": "upvote"
}

---

## API Testing

All endpoints were tested using API-Dog.

API-Dog export files are included in:
apidog/

---

## Error Format

{
  "statusCode": 404,
  "message": "Not Found",
  "error": "Not Found"
}

---

## Running the Project

1. Install dependencies:
npm install

2. Run the server:
npm run start

3. Server URL:
http://localhost:3000/api/v1

