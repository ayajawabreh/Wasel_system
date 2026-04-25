
## Feature 4: Alerts & Regional Notifications

# Overview

This feature allows users to subscribe to alerts based on geographic region and incident category.
When an incident is verified, the system automatically generates alerts for users whose subscriptions match the incident region and type.

The goal of this feature is to improve mobility awareness by notifying users about relevant incidents in their selected areas.

# Endpoints
- Authentication

POST /auth/register
POST /auth/login

- Subscriptions

POST /alert-subscription
GET /alert-subscription/my
DELETE /alert-subscription/:id

- Alerts
GET /alert/my

- Incidents
GET /incident
PATCH /incident/:id/verify

Request Example
{
  "region": "Nablus",
  "category": "Traffic"
}

Response Example
{
  "id": 7,
  "user_id": 9,
  "region": "Nablus",
  "category": "Traffic",
  "created_at": "2026-04-03T16:20:48.000Z"
}

Alert Response Example
[
  {
    "id": 6,
    "user_id": 9,
    "incident_id": 3,
    "subscription_id": 7,
    "message": "Alert: Traffic incident in Nablus",
    "created_at": "2026-04-03T16:20:48.000Z"
  }
]

# Core Logic

The feature works in two main steps:

users create subscriptions based on region and category
when an incident is verified, the system checks matching subscriptions and creates alerts automatically

Alerts are only created for users whose subscriptions match:
the same region
the same incident category
Database Usage

This feature uses the relational database to:
store user subscriptions in the alertsubscription table
store generated alerts in the alert table
read incidents from the incident table

The alert table is linked to:

user_id
incident_id
subscription_id
Authentication Flow

Authentication is handled using JWT.

POST /auth/login returns an access_token
protected endpoints require:
Authorization: Bearer <token>
Validation

Input validation ensures that:

region is not empty
category is valid
duplicate subscriptions are prevented
only authenticated users can access protected endpoints
API Documentation & Testing

>> All endpoints for this feature were documented and tested using API-Dog, including:

endpoint descriptions
authentication flow
request and response examples
error formats
Performance Testing

>> k6 performance testing was executed for this feature using different scenarios:

Read-heavy: tested GET /incident, GET /alert/my, and GET /alert-subscription/my
Write-heavy: tested POST /alert-subscription
Mixed workload: tested read and write endpoints together
Spike testing: tested sudden increase in users
Soak testing: tested stability over longer duration

The results showed stable performance with 0% error rate in the successful runs, and the system remained responsive under load.

Design Rationale

NestJS was used because it provides a modular structure, clean separation between controller and service layers, and easy integration with TypeORM and JWT authentication.

This makes the feature easier to maintain and extend in the future.

# Notes
alerts are generated only after incident verification
subscriptions control which users receive alerts
the feature is ready for future integration with external notification services
