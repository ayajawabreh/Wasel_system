# Wasel System Architecture

## System Overview
NestJS + TypeORM + MySQL + External APIs (OSRM, Open-Meteo)

## ERD (Database Schema)
```
User 1---* Report
Report 1---* ReportVote
Checkpoint 1---* CheckpointStatusHistory  
Checkpoint 1---* Incident
Area *---0 Route (avoid)
```

## External API Flow
```
Client → RouteService → OSRM (routing) 
               ↓
            Open-Meteo (weather)
               ↓
            Cache + DB checks → Response
```

## Tech Stack
```
Backend: NestJS 11, TypeScript
DB: MySQL, TypeORM
Cache: NestJS CacheManager
External: Axios + RxJS
Auth: JWT + RolesGuard
Rate Limit: ThrottlerModule
Testing: k6 + Jest
```

