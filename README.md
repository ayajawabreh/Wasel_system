<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Feature 4: Alerts & Regional Notifications

Overview

This feature allows users to subscribe to alerts based on geographic region and incident category.
When an incident is verified, the system automatically generates alerts for users whose subscriptions match the incident region and type.

The goal of this feature is to improve mobility awareness by notifying users about relevant incidents in their selected areas.

Endpoints
Authentication

POST /auth/register
POST /auth/login

Subscriptions

POST /alert-subscription
GET /alert-subscription/my
DELETE /alert-subscription/:id

Alerts
GET /alert/my

Incidents
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

Core Logic

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

All endpoints for this feature were documented and tested using API-Dog, including:

endpoint descriptions
authentication flow
request and response examples
error formats
Performance Testing

k6 performance testing was executed for this feature using different scenarios:

Read-heavy: tested GET /incident, GET /alert/my, and GET /alert-subscription/my
Write-heavy: tested POST /alert-subscription
Mixed workload: tested read and write endpoints together
Spike testing: tested sudden increase in users
Soak testing: tested stability over longer duration

The results showed stable performance with 0% error rate in the successful runs, and the system remained responsive under load.

Design Rationale

NestJS was used because it provides a modular structure, clean separation between controller and service layers, and easy integration with TypeORM and JWT authentication.

This makes the feature easier to maintain and extend in the future.

Notes
alerts are generated only after incident verification
subscriptions control which users receive alerts
the feature is ready for future integration with external notification services

 ## Feature 3: Route Estimation & Mobility Intelligence
Overview

This feature provides route estimation between two geographic locations and returns estimated distance, estimated duration, and explanatory metadata describing the factors that affected the route calculation. The implementation follows a heuristic-based approach, which is acceptable for this project as exact routing accuracy is not required.

The feature was designed to support real-world mobility conditions in Palestine by incorporating route intelligence from multiple sources, including checkpoints, incidents, weather conditions, and user-defined route constraints such as avoiding checkpoints or avoiding specific areas.

Endpoint

POST /api/v1/routes/estimate

Request Body
{
  "startLatitude": 31.95,
  "startLongitude": 35.93,
  "endLatitude": 31.98,
  "endLongitude": 35.96,
  "avoidCheckpoints": true,
  "avoidAreas": ["Area A"]
}
Request Fields
startLatitude: starting point latitude
startLongitude: starting point longitude
endLatitude: destination latitude
endLongitude: destination longitude
avoidCheckpoints: optional boolean flag indicating whether checkpoints should be avoided
avoidAreas: optional list of area names to avoid during route estimation
Response Example
{
  "estimatedDistance": 8.72,
  "estimatedDuration": 27.66,
  "metadata": {
    "factors": [
      "Base route estimated using OSRM external routing service",
      "Weather condition near route: cloudy",
      "Alternative path applied to avoid area: Area A",
      "Alternative path used to avoid busy checkpoint: Checkpoint C",
      "Low severity incident nearby: Theft",
      "High severity incident nearby: Fire"
    ],
    "avoidCheckpoints": true,
    "avoidAreas": ["Area A"],
    "routingSource": "OSRM",
    "weatherSource": "Open-Meteo"
  }
}
Core Logic

The route estimation process starts by requesting a base route from the OSRM routing service. The returned route distance and duration are then adjusted using internal heuristics based on several contextual factors:

current weather conditions
nearby checkpoints
active incidents
avoided areas
user preference to avoid checkpoints

This allows the system to generate a realistic estimated route while also explaining the reasoning behind the estimate.

External API Integration

This feature integrates with two external APIs as required by the project:

OSRM: used to estimate the base driving route, including raw distance and travel duration
Open-Meteo: used to retrieve current weather conditions near the route
Route Constraints Support

The feature supports the following constraints required by the project:

Avoid checkpoints: if enabled, the system applies smaller route penalties to simulate alternative paths around busy or closed checkpoints
Avoid specific areas: if area names are provided, the system loads matching areas from the database and applies additional duration and distance penalties when the route is affected by those areas
Database Usage

This feature uses the relational database in multiple ways:

reading checkpoints from the checkpoint table
reading active incidents from the incident table
reading avoidable areas from the area table

The area table was introduced to support dynamic area-based route avoidance instead of hardcoded values.

Reliability Enhancements

To improve system reliability and satisfy project requirements for external API integrations, the following mechanisms were added:

Timeout handling: external API requests to OSRM and Open-Meteo use request timeouts
Graceful error handling: if the weather API fails, route estimation still continues without weather adjustment
Caching: repeated route estimation requests are cached temporarily to reduce repeated external API calls
Rate limiting: the route estimation endpoint is protected using throttling to prevent abuse and excessive request bursts
Validation

Input validation is implemented using DTO validation decorators to ensure that:

latitude values are valid
longitude values are valid
avoidCheckpoints is a boolean if provided
avoidAreas is an array of strings if provided
Testing

Unit tests were added for the RouteService to validate core route estimation behavior. The tested scenarios include:

returning a cached result when available
applying avoid-area penalties using database records
continuing route estimation when the weather API fails

In addition, the endpoint was tested manually using HTTP requests and was also validated using k6-based performance testing.

Performance Testing

A focused k6 test was executed for the route estimation endpoint to verify its runtime behavior. The feature returned successful responses including estimated distance, estimated duration, and explanatory metadata. The test confirmed that the endpoint is operational and performs correctly under low-load validation.

It was also observed that under higher request bursts, throttling protection may reject excess requests, which is expected because rate limiting is intentionally enabled for this endpoint.

Design Rationale

NestJS was used to implement this feature because it offers a modular structure, strong support for dependency injection, clean controller-service separation, and maintainable integration with TypeORM, external HTTP services, caching, and throttling. This supports scalability, maintainability, and development efficiency, which align with the project requirements.

Notes
Route estimation is heuristic-based and not intended to provide exact turn-by-turn routing accuracy
Area avoidance is database-driven through the area table
Cached results help reduce external API usage
Weather failure does not stop route estimation
Excessive request rates may trigger throttling responses by design
