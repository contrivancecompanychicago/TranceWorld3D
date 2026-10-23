const state = {
  dashboard: null,
  workouts: [],
  challenges: [],
  leaderboard: []
};

async function fetchDashboard() {
  const response = await fetch('/api/v1/dashboard');
  const payload = await response.json();
  state.dashboard = payload.dashboard;
  state.workouts = payload.workouts;
  state.challenges = payload.challenges;
  state.leaderboard = payload.leaderboard;
  renderDashboard();
}

function renderDashboard() {
  if (!state.dashboard) return;

  document.getElementById('members').textContent = state.dashboard.community.members.toLocaleString();
  document.getElementById('classes-today').textContent = state.dashboard.community.classesToday.toLocaleString();
  document.getElementById('training-now').textContent = state.dashboard.community.liveNow.toLocaleString();
  document.getElementById('avg-energy').textContent = state.dashboard.community.avgEnergy;

  const workoutList = document.getElementById('workout-list');
  workoutList.innerHTML = state.workouts
    .map(
      (workout) => `
        <div class="card">
          <div class="card-head">
            <h4>${workout.name}</h4>
            <span class="badge">${workout.badge}</span>
          </div>
          <div class="meta">${workout.category} • ${workout.duration} min • ${workout.coach}</div>
          <div class="lesson">${workout.description}</div>
        </div>
      `
    )
    .join('');

  const challengeList = document.getElementById('challenge-list');
  challengeList.innerHTML = state.challenges
    .map(
      (challenge) => `
        <div class="card challenge-item">
          <div class="card-head">
            <h4>${challenge.name}</h4>
            <span class="badge">${challenge.status}</span>
          </div>
          <div class="meta">Reward: ${challenge.reward}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${Math.min(challenge.progress, 100)}%"></div>
          </div>
          <div class="meta">${challenge.progress}/${challenge.goal}</div>
        </div>
      `
    )
    .join('');

  const leaderboardContainer = document.getElementById('leaderboard');
  leaderboardContainer.innerHTML = state.leaderboard
    .map(
      (row) => `
        <div class="rank-row">
          <div class="rank-pill">#${row.rank}</div>
          <div>
            <div class="rank-name">${row.name}</div>
            <div class="meta">${row.streak}-session streak</div>
          </div>
          <div class="rank-score">${row.score.toLocaleString()}</div>
        </div>
      `
    )
    .join('');
}

async function launchWorkout() {
  const response = await fetch('/api/v1/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'Athena',
      workoutId: 'temple-rise',
      duration: 30,
      intensity: 9
    })
  });

  const data = await response.json();
  const result = data.session || { score: 0 };
  alert(`${result.workoutName} finished. XP earned: ${result.xpAwarded}.`);
  await fetchDashboard();
}

function setupThreeScene() {
  const container = document.getElementById('arena');
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#090d18', 8, 22);

  const camera = new THREE.PerspectiveCamera(48, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 2, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight('#9ae6ff', 1.4);
  scene.add(ambientLight);

  const spotLight = new THREE.PointLight('#8b5cf6', 18, 30, 2);
  spotLight.position.set(0, 6, 5);
  scene.add(spotLight);

  const geometry = new THREE.TorusKnotGeometry(1.2, 0.32, 180, 32);
  const material = new THREE.MeshStandardMaterial({
    color: '#7c3aed',
    emissive: '#312e81',
    metalness: 0.6,
    roughness: 0.22
  });

  const object = new THREE.Mesh(geometry, material);
  scene.add(object);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.04, 16, 100),
    new THREE.MeshBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.8 })
  );
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  const particles = new THREE.Group();
  for (let i = 0; i < 100; i += 1) {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 10, 10),
      new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? '#fbbf24' : '#67e8f9' })
    );
    dot.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 10
    );
    particles.add(dot);
  }
  scene.add(particles);

  function animate() {
    requestAnimationFrame(animate);
    object.rotation.x += 0.008;
    object.rotation.y += 0.012;
    ring.rotation.z += 0.01;
    particles.rotation.y += 0.002;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

document.getElementById('launch-workout').addEventListener('click', launchWorkout);
document.getElementById('refresh-data').addEventListener('click', fetchDashboard);

setupThreeScene();
fetchDashboard();
