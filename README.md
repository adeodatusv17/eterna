# Meme Coin Dashboard

A lightweight real-time meme coin aggregation backend with multi-DEX fetching, merging, caching, filtering, and WebSocket updates.

## Overview

This service aggregates meme token data from public DEX APIs (DexScreener, Jupiter), merges duplicates, caches results in Redis, and exposes:

- REST: `/api/tokens`
- Realtime WebSocket: `tokens:update`

Supports filtering, sorting, pagination, and configurable cache TTL/refresh intervals.

## Tech Stack
- Node.js + TypeScript  
- Fastify  
- Redis (ioredis)  
- Socket.IO  
- Jest + Supertest  

## Unit test coverage
List of All 14 Tests 
## 1. API Route Tests:

a) returns token data for a valid address

b) handles missing/invalid address parameter

c) returns an error when service layer throws

## 2. Cache Layer Tests:

a) sets and retrieves values from Redis mock

b) returns null on missing keys

## 3. Aggregator Service Tests:

a) merges data from multiple fetchers

b) handles upstream fetcher failure gracefully

c) returns empty structure when all adapters fail

## 4. Merge Logic Tests:

a) merges token fields correctly

b) handles partial objects while merging

c) gives precedence order to DEX sources

## 5. Utility Tests :

a) filters + sorts token list correctly

b) pagination utility returns correct window

c) retry utility retries specified number of times

## Major Design Decisions

### Fastify Instead of Express  
Chosen for higher throughput and built‑in structured logging, ideal for frequently queried endpoints.

### Redis Caching  
External DEX APIs are rate-limited. Results are cached by query with a configurable TTL (default 30s), reducing latency and external usage.

### Token Merge Strategy  
Tokens from multiple DEXs may overlap. They are merged by normalized token address. Missing fields are filled without overwriting existing valid data, and sources are combined.

### Cursor‑Based Pagination  
Chosen for stability in fast‑changing datasets. Pagination is based on encoded array index instead of offset/limit to avoid inconsistency.

### WebSockets for Live Data  
Instead of polling, the server pushes updates at a fixed interval (5 seconds by default). Keeps clients synchronized efficiently.

### Safe Sorting + Filtering  
Sorting is restricted to predefined fields (price, volume, market_cap, change). Filtering supports defined periods (1h, 24h, 7d). Prevents unsafe or undefined queries.

### Retry Logic for External APIs  
`p-retry` is used around fetchers to stabilize API calls that may intermittently fail.

## REST Endpoint

GET `/api/tokens?q=SOL&sort=volume&order=desc&period=24h&limit=20`

Returns merged, filtered, sorted, paginated data.

## Environment Variables

```
PORT=3000
REDIS_HOST=...
REDIS_PORT=...
REDIS_PASSWORD=...
DEXSCREENER_SEARCH_BASE=https://api.dexscreener.com/latest/dex/search?q=
JUPITER_SEARCH_BASE=https://lite-api.jup.ag/tokens/v2/search?query=
CACHE_TTL_SECONDS=30(configurable)
REFRESH_INTERVAL_MS=5000(configurable)
```

## Running Locally

```
npm install
npm run dev
```

Redis is required(cloud or local , I used a cloud instance).

## Testing

```
npm test
```

Includes unit + integration tests.

## Deployment (Render)

- Install: `npm install`  
- Build: `npm run build`  
- Start: `npm run start`  
- Add environment variables  
- Deploy as a Web Service  

