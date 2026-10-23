# TranceWorld3D

The 3(rd) Dimension of Public Nuisance City and Quality of Life Games.

This repository now includes a versioned backend for a TRANCE-inspired, Peleton-like workout platform that is framed as a gamified 3D experience. It exposes a V1 API for dashboard data, workout classes, challenges, leaderboard, and session creation.

## What is included

- Express backend with API versioning (`/api/v1/...`)
- 3D neon arena rendered in the browser with Three.js
- Peleton-like workout catalog and challenge system
- Gamified dashboard and leaderboard
- Static frontend served from `public/index.html`

## Run the app

```bash
npm install
npm start
```

Then open:

- http://localhost:8080

## API examples

```bash
curl http://localhost:8080/api/v1/health
curl http://localhost:8080/api/v1/workouts
curl http://localhost:8080/api/v1/dashboard
```

## Knowledge base alignment

This implementation follows the Temple of TRANCE Health Transformation Coach concept: movement, breath, ritual, and progression. It is intentionally designed as a fitness backend with a gamified, 3D, high-energy user experience.
