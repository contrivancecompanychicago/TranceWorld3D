const express = require('express');
const path = require('path');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 8080;
const API_VERSION = 'v1';
const FIREBASE_DATABASE_URL =
  process.env.FIREBASE_DATABASE_URL || 'https://yellowfitexercisemaps-default-rtdb.firebaseio.com';
const FIREBASE_SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || null;

let firebaseDb = null;

const triageStatus = {
  level: 'NORMAL',
  summary: 'Healthy progress with steady adherence to coaching goals.',
  actions: [
    'Maintain current activity rhythm',
    'Continue daily nutrition consistency',
    'Check in again in 7 days'
  ],
  pantry: 'Local community food hub',
  timestamp: new Date().toISOString()
};

const workouts = [
  {
    id: 'temple-rise',
    name: 'Temple Rise Ride',
    category: 'Cycling',
    duration: 30,
    intensity: 'High',
    intensityLevel: 8,
    coach: 'Astra',
    energy: '96%',
    description: 'A neon climb through the TRANCE temple with sprint intervals and breathwork.',
    badge: 'Legendary'
  },
  {
    id: 'core-echo',
    name: 'Core Echo',
    category: 'Strength',
    duration: 20,
    intensity: 'Moderate',
    intensityLevel: 6,
    coach: 'Milo',
    energy: '81%',
    description: 'Power the body-center ritual with controlled strength circuits and posture resets.',
    badge: 'Focused'
  },
  {
    id: 'void-flow',
    name: 'Void Flow',
    category: 'Mobility',
    duration: 18,
    intensity: 'Recovery',
    intensityLevel: 3,
    coach: 'Seraph',
    energy: '72%',
    description: 'Recover through guided mobility, recovery pacing, and a slow-tempo reset.',
    badge: 'Calm'
  }
];

const challenges = [
  {
    id: 'streak-7',
    name: '7-Day Temple Streak',
    reward: 'Unlock the Crystal Armor skin',
    progress: 68,
    goal: 7,
    status: 'In progress'
  },
  {
    id: 'power-doors',
    name: 'Power the Doors',
    reward: 'Boost XP +25%',
    progress: 83,
    goal: 100,
    status: 'Almost there'
  }
];

const leaderboard = [
  { rank: 1, name: 'Nova', score: 14800, streak: 12 },
  { rank: 2, name: 'Kite', score: 13750, streak: 9 },
  { rank: 3, name: 'Ari', score: 13220, streak: 7 },
  { rank: 4, name: 'Ren', score: 12930, streak: 6 }
];

const dashboard = {
  community: {
    members: 4287,
    classesToday: 142,
    liveNow: 216,
    avgEnergy: '89%'
  },
  coach: {
    name: 'Temple Guide',
    title: 'TRANCE Health Transformation Coach',
    mantra: 'Move. Breathe. Level up.'
  }
};

function buildVersionEnvelope(payload) {
  return {
    apiVersion: API_VERSION,
    generatedAt: new Date().toISOString(),
    ...payload
  };
}

function getWorkoutById(id) {
  return workouts.find((workout) => workout.id === id) || workouts[0];
}

function initializeFirebase() {
  try {
    if (!admin.apps.length) {
      if (FIREBASE_SERVICE_ACCOUNT_PATH) {
        const serviceAccount = require(path.resolve(FIREBASE_SERVICE_ACCOUNT_PATH));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: FIREBASE_DATABASE_URL
        });
      } else {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          databaseURL: FIREBASE_DATABASE_URL
        });
      }
    }

    firebaseDb = admin.database();
  } catch (error) {
    console.warn('Firebase initialization skipped:', error.message);
    firebaseDb = null;
  }
}

async function syncSessionState(userId, triageBadge, extraState = {}) {
  if (!firebaseDb) {
    return { ok: false, error: 'Firebase not initialized' };
  }

  const ref = firebaseDb.ref(`sessions/${userId}`);
  const payload = {
    triage_badge: triageBadge,
    updatedAt: new Date().toISOString(),
    ...extraState
  };

  await ref.set(payload);
  return { ok: true, path: `sessions/${userId}` };
}

initializeFirebase();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/version', (req, res) => {
  res.set('X-API-Version', API_VERSION);
  res.json(buildVersionEnvelope({ status: 'ok', service: 'TRANCE workout API' }));
});

app.get('/api/v1/version', (req, res) => {
  res.set('X-API-Version', API_VERSION);
  res.json(buildVersionEnvelope({ status: 'ok', service: 'TRANCE workout API' }));
});

app.get('/api/v1/health', (req, res) => {
  res.json(
    buildVersionEnvelope({
      status: 'healthy',
      service: 'TRANCE backend',
      uptimeSeconds: Math.round(process.uptime()),
      firebase: firebaseDb ? 'connected' : 'disabled'
    })
  );
});

app.get('/api/v1/dashboard', (req, res) => {
  res.json(
    buildVersionEnvelope({
      dashboard,
      workouts,
      challenges,
      leaderboard,
      triage: triageStatus
    })
  );
});

app.get('/api/v1/workouts', (req, res) => {
  res.json(buildVersionEnvelope({ workouts }));
});

app.get('/api/v1/workouts/:id', (req, res) => {
  const workout = getWorkoutById(req.params.id);
  if (!workout) {
    return res.status(404).json(
      buildVersionEnvelope({
        error: 'Workout not found',
        requestedId: req.params.id
      })
    );
  }

  res.json(buildVersionEnvelope({ workout }));
});

app.get('/api/v1/challenges', (req, res) => {
  res.json(buildVersionEnvelope({ challenges }));
});

app.get('/api/v1/leaderboard', (req, res) => {
  res.json(buildVersionEnvelope({ leaderboard }));
});

app.post('/api/v1/sessions', async (req, res) => {
  const { userId = 'guest-athlete', workoutId = 'temple-rise', duration = 30, intensity = 7 } = req.body || {};
  const workout = getWorkoutById(workoutId);
  const score = Math.max(500, Math.round((duration * intensity * 12) + (workout.intensityLevel || 5) * 100));

  const session = {
    id: `session-${Date.now()}`,
    userId,
    workoutId: workout.id,
    workoutName: workout.name,
    duration,
    intensity,
    score,
    xpAwarded: score,
    completedAt: new Date().toISOString()
  };

  leaderboard.unshift({
    rank: 1,
    name: userId,
    score,
    streak: 5
  });

  try {
    await syncSessionState(userId, triageStatus.level, {
      workoutId: workout.id,
      workoutName: workout.name,
      score,
      xpAwarded: score,
      intensity,
      duration
    });
  } catch (error) {
    console.error('Firebase sync failed:', error);
  }

  res.status(201).json(
    buildVersionEnvelope({
      session,
      nextGoal: 'Complete the next Temple Rise challenge to unlock a legendary boost',
      message: `${workout.name} completed. Energy restored to ${workout.energy}.`
    })
  );
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json(
      buildVersionEnvelope({
        error: 'API route not found',
        path: req.path
      })
    );
  }

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[TRANCE] API ${API_VERSION} listening on port ${PORT}`);
});

module.exports = app;
