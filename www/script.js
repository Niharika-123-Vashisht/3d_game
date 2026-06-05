const startScreen = document.getElementById('start-screen');
const characterScreen = document.getElementById('character-screen');
const tutorialScreen = document.getElementById('tutorial-screen');
const gameScreen = document.getElementById('game-screen');
const splashScreen = document.getElementById('splash-screen');
const loadingScreen = document.getElementById('loading-screen');
const npcSceneScreen = document.getElementById('npc-scene-screen');
const mainApp = document.getElementById('main-app');
const loadingBarFill = document.getElementById('loading-bar-fill');

const openCharactersButton = document.getElementById('open-characters-button');
const openSettingsButton = document.getElementById('open-settings-button');
const backToStartButton = document.getElementById('back-to-start-button');
const settingsBackButton = document.getElementById('settings-back-button');
const startGameButton = document.getElementById('start-game-button');
const homeButton = document.getElementById('home-button');
const restartButton = document.getElementById('restart-button');
const watchAdButton = document.getElementById('watch-ad-button');
const closeAdButton = document.getElementById('close-ad-button');
const sceneStartButton = document.getElementById('scene-start-button');
const pauseButton = document.getElementById('pause-button');
const pauseOverlay = document.getElementById('pause-overlay');
const pauseResumeButton = document.getElementById('pause-resume-button');
const pauseRestartButton = document.getElementById('pause-restart-button');
const pauseHomeButton = document.getElementById('pause-home-button');
const settingsScreen = document.getElementById('settings-screen');
const toggleSoundButton = document.getElementById('toggle-sound-button');
const toggleMusicButton = document.getElementById('toggle-music-button');
const toggleGraphicsButton = document.getElementById('toggle-graphics-button');

const scoreValue = document.getElementById('score-value');
const starValue = document.getElementById('star-value');
const magnetStatus = document.getElementById('magnet-status');
const magnetTime = document.getElementById('magnet-time');
const rewardText = document.getElementById('reward-text');
const nearMissText = document.getElementById('near-miss-text');
const comboText = document.getElementById('combo-text');
const speedVignette = document.getElementById('speed-vignette');
const gameOverMessage = document.getElementById('game-over-message');
const gameOverPopup = document.getElementById('game-over-popup');
const finalScoreValue = document.getElementById('final-score-value');
const instructionText = document.getElementById('instruction-text');
const feedbackText = document.getElementById('feedback-text');
const characterProgressText = document.getElementById('character-progress');
const selectedCharacterName = document.getElementById('selected-character-name');
const characterList = document.getElementById('character-list');
const adScreen = document.getElementById('ad-screen');
const adMessage = document.getElementById('ad-message');
const npcCharacters = document.querySelectorAll('.scene-character.npc');
const learningCommandOverlay = document.getElementById('learning-command-overlay');
const learningCommandText = document.getElementById('learning-command-text');
const diagnosticsOverlay = document.getElementById('dev-diagnostics');
const diagnosticsText = document.getElementById('dev-diagnostics-text');

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;

const threeState = {
  scene: null,
  camera: null,
  renderer: null,
  playerRoot: null,
  fallbackPlayer: null,
  testObstacle: null,
  playerModel: null,
  playerShadow: null,
  playerMixer: null,
  animationActions: {},
  animationState: 'run',
  sunLight: null,
  treeMeshes: [],
  roadDetailMeshes: [],
  dirtEdges: [],
  runAction: null,
  roadMesh: null,
  laneMarkers: [],
  obstacleMeshes: [],
  obstacleShadowMeshes: [],
  fireGlowLights: [],
  forceTestBox: null,
  cameraFollowTarget: null,
  cameraLookTarget: null,
  dustMeshes: [],
  sidePropMeshes: []
};


const PLAYER_MODEL_URL = window.__RUNNER_MODEL_URL__ || 'https://threejs.org/examples/models/gltf/Soldier.glb';

const STORAGE_KEY = 'funrun-rush-progress-v1';
const MAX_DELTA_SECONDS = 0.04;
const DEFAULT_SETTINGS = {
  soundEnabled: true,
  musicEnabled: true,
  graphicsQuality: 'high'
};
const LANE_WORLD_X = 2.55;
const ROAD_HALF_WIDTH = 6.6;
const ROAD_LENGTH = 140;
const ROAD_SURFACE_Y = 0.02;

const laneSystem = {
  currentIndex: 1,
  targetIndex: 1,
  currentFloat: 1,
  fromFloat: 1,
  moveProgress: 1,
  moveDuration: 0.2
};

const perspectiveRoad = {
  horizonY: 64,
  bottomY: canvas.height,
  topWidth: 170,
  bottomWidth: 590,
  laneCount: 3,
  segmentCount: 38,
  segmentDepthSize: 0.05,
  debug: false
};

const game = {
  running: false,
  gameOver: false,
  animationId: null,
  lastFrameTime: 0,
  score: 0,
  stars: 0,
  bestScore: 0,
  bestStars: 0,
  speed: 245,
  roadOffset: 0,
  sideOffset: 0,
  elapsedMs: 0,
  slideBoostMs: 0,
  smoothedDtSeconds: 1 / 60,
  combo: 0,
  comboTimerMs: 0
};

const hud = {
  displayScore: 0,
  displayStars: 0,
  lastStarsValue: 0,
  lastScoreValue: 0
};

const fx = {
  screenShakeMs: 0,
  screenShakeStrength: 0,
  powerPulseMs: 0,
  actionBounceMs: 0,
  landingBounceMs: 0,
  startZoomMs: 0,
  fightPopMs: 0,
  fightSparkMs: 0,
  pickupPopMs: 0,
  dustParticles: [],
  dustSpawnMs: 0,
  gameOverDramaMs: 0,
  gameOverFade: 0,
  gameOverCommitted: false
};

const player = {
  x: canvas.width * 0.5,
  baseY: canvas.height - 120,
  yOffset: 0,
  velocityY: 0,
  jumpStartTime: 0,
  landingSquashUntil: 0,
  onGround: true,
  pose: 'idle',
  poseTimerMs: 0,
  runCycle: 0,
  selectedCharacterId: 'buddy'
};

const traffic = {
  items: [],
  nextId: 1,
  spawnTimerMs: 1000,
  minSpawnMs: 720,
  maxSpawnMs: 1550,
  laneCooldownMs: 520,
  lastSpawnMsByLane: [-10000, -10000, -10000]
};

const sideEnvironment = {
  items: [],
  nextId: 1,
  spawnTimerMs: 360,
  minSpawnMs: 230,
  maxSpawnMs: 700
};

const power = {
  items: [],
  nextId: 1,
  spawnTimerMs: 4200,
  minSpawnMs: 8000,
  maxSpawnMs: 12000,
  active: false,
  timerMs: 0,
  durationMs: 4200,
  scoreMultiplier: 2,
  flyLift: 44
};

const learning = {
  commands: [
    { word: 'JUMP', action: 'jump' },
    { word: 'SLIDE', action: 'slide' },
    { word: 'LEFT', action: 'left' },
    { word: 'RIGHT', action: 'right' }
  ],
  current: null,
  timerMs: 0,
  nextTimerMs: 1300,
  minDurationMs: 2300,
  maxDurationMs: 3400,
  bonusScore: 8,
  penaltyScore: 2
};

const touch = {
  startX: 0,
  startY: 0,
  startTime: 0,
  active: false,
  minSwipeDistance: 22,
  maxTapDurationMs: 200
};

const calibration = {
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
  diagonal: Math.hypot(window.innerWidth, window.innerHeight),
  playerScale: 1,
  motionScale: 1,
  swipeDistance: 22,
  maxTapDurationMs: 200
};

const perf = {
  fpsEma: 60,
  lowFpsMs: 0,
  highFpsMs: 0,
  lowEffects: false
};

const diagnostics = {
  visible: false,
  nextUpdateTs: 0,
  tapCount: 0,
  lastTapTs: 0,
  longPressTimer: null,
  startX: 0,
  startY: 0,
  pressMoved: false,
  longPressTriggered: false
};

let audioContext = null;
const audioLayer = {
  ambienceStarted: false,
  ambienceGain: null,
  ambienceNodes: [],
  targetAmbience: 0,
  currentAmbience: 0,
  footstepTimerMs: 0
};

const immersive = {
  requested: false
};

const settings = {
  ...DEFAULT_SETTINGS
};

const runtime = {
  threeReady: false,
  triedThreeLoad: false,
  touchBound: false,
  keyControlsBound: false,
  keyCooldownUntil: 0,
  gameStarted: false,
  gamePaused: false
};
const FORCE_VISIBILITY_MODE = false;

const characters = [
  { id: 'buddy', name: 'Ari', shirt: '#5f7890', pants: '#2e3f5e', hair: '#1f2026', skin: '#b98e74', unlockScore: 0, unlockStars: 0, unlocked: true },
  { id: 'luna', name: 'Luna', shirt: '#6f879f', pants: '#2d455e', hair: '#242931', skin: '#d2ae90', unlockScore: 90, unlockStars: 18, unlocked: false },
  { id: 'zippy', name: 'Kian', shirt: '#5d746b', pants: '#365149', hair: '#2b2c2e', skin: '#8f654e', unlockScore: 170, unlockStars: 34, unlocked: false },
  { id: 'nova', name: 'Nova', shirt: '#6f6682', pants: '#3e3550', hair: '#2f2622', skin: '#ba8b70', unlockScore: 260, unlockStars: 50, unlocked: false },
  { id: 'rio', name: 'Rio', shirt: '#607f8d', pants: '#324c58', hair: '#1f1e1d', skin: '#8a5f44', unlockScore: 360, unlockStars: 68, unlocked: false },
  { id: 'mira', name: 'Mira', shirt: '#7b7a68', pants: '#4f4c3e', hair: '#2a251f', skin: '#cfac8f', unlockScore: 470, unlockStars: 86, unlocked: false },
  { id: 'dax', name: 'Dax', shirt: '#6d6f79', pants: '#3e404a', hair: '#1b1d21', skin: '#7d553f', unlockScore: 600, unlockStars: 110, unlocked: false },
  { id: 'sena', name: 'Sena', shirt: '#5f7377', pants: '#34484b', hair: '#2c2320', skin: '#a4785c', unlockScore: 760, unlockStars: 138, unlocked: false },
  { id: 'onyx', name: 'Onyx', shirt: '#60667a', pants: '#31374d', hair: '#131418', skin: '#9e7458', unlockScore: 940, unlockStars: 170, unlocked: false },
  { id: 'zen', name: 'Zen', shirt: '#7a615a', pants: '#4b352f', hair: '#201c1b', skin: '#d7b392', unlockScore: 1150, unlockStars: 205, unlocked: false }
];

function getAudioContext() {
  if (!settings.soundEnabled && !settings.musicEnabled) {
    return null;
  }
  const AudioContextRef = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextRef) {
    return null;
  }
  if (!audioContext) {
    audioContext = new AudioContextRef();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

function playSynthTone({ type, startHz, endHz, attack = 0.012, decay = 0.14, peak = 0.05 }) {
  if (!settings.soundEnabled) {
    return;
  }
  const context = getAudioContext();
  if (!context) {
    return;
  }
  const osc = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  osc.type = type;
  osc.frequency.setValueAtTime(startHz, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, endHz), now + decay);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(now);
  osc.stop(now + decay + 0.02);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

function depthScale(depth) {
  return 0.28 + Math.pow(clamp(depth, 0, 1), 1.08) * 1.5;
}

function spawnDustBurst(strength = 1) {
  if (perf.lowEffects) {
    return;
  }
  const count = Math.round(3 + strength * 4);
  const cx = getPlayerCenterX();
  const baseY = getPlayerTopY() + 78 * calibration.playerScale;
  for (let i = 0; i < count; i += 1) {
    fx.dustParticles.push({
      x: cx + randomBetween(-10, 10) * calibration.playerScale,
      y: baseY + randomBetween(-2, 3) * calibration.playerScale,
      vx: randomBetween(-22, 22) * strength,
      vy: randomBetween(-36, -10) * strength,
      size: randomBetween(1.8, 4.2) * calibration.playerScale,
      lifeMs: randomBetween(180, 330),
      maxLifeMs: 330
    });
  }
  if (fx.dustParticles.length > 120) {
    fx.dustParticles.splice(0, fx.dustParticles.length - 120);
  }
}

function detectAnimationClip(animations, patterns) {
  return animations.find((clip) => patterns.some((pattern) => pattern.test(clip.name))) || null;
}

function setAnimationState(nextState, fadeDuration = 0.2) {
  if (!threeState.playerMixer) {
    return;
  }
  const actions = threeState.animationActions;
  if (threeState.animationState === nextState || !actions[nextState]) {
    return;
  }
  const prevAction = actions[threeState.animationState] || null;
  const nextAction = actions[nextState];
  nextAction.enabled = true;
  nextAction.reset();
  nextAction.setEffectiveWeight(1);
  nextAction.play();
  if (prevAction && prevAction !== nextAction) {
    prevAction.crossFadeTo(nextAction, fadeDuration, false);
  }
  threeState.animationState = nextState;
}

function updateDeviceCalibration() {
  calibration.viewportWidth = window.innerWidth;
  calibration.viewportHeight = window.innerHeight;
  calibration.diagonal = Math.hypot(calibration.viewportWidth, calibration.viewportHeight);

  const widthFactor = clamp(calibration.viewportWidth / 390, 0.86, 1.28);
  calibration.playerScale = clamp(0.9 + (widthFactor - 1) * 0.45, 0.88, 1.12);

  // Normalize world velocity so large/tall screens do not feel too fast.
  calibration.motionScale = clamp(700 / calibration.viewportHeight, 0.82, 1.15);

  // Thumb-friendly swipe threshold scales with screen size.
  calibration.swipeDistance = Math.round(clamp(calibration.diagonal * 0.018, 20, 34));
  calibration.maxTapDurationMs = Math.round(clamp(180 + (widthFactor - 1) * 26, 170, 220));

  touch.minSwipeDistance = calibration.swipeDistance;
  touch.maxTapDurationMs = calibration.maxTapDurationMs;
}

function updatePerformanceProfile(rawDtSeconds, dtMs) {
  if (settings.graphicsQuality === 'low') {
    perf.lowEffects = true;
    gameScreen.classList.add('perf-low');
    return;
  }
  const instantFps = 1 / Math.max(rawDtSeconds, 0.001);
  perf.fpsEma += (instantFps - perf.fpsEma) * 0.1;

  if (perf.fpsEma < 52) {
    perf.lowFpsMs += dtMs;
    perf.highFpsMs = Math.max(0, perf.highFpsMs - dtMs * 0.5);
  } else if (perf.fpsEma > 58) {
    perf.highFpsMs += dtMs;
    perf.lowFpsMs = Math.max(0, perf.lowFpsMs - dtMs * 0.5);
  }

  if (!perf.lowEffects && perf.lowFpsMs > 1200) {
    perf.lowEffects = true;
    gameScreen.classList.add('perf-low');
  } else if (perf.lowEffects && perf.highFpsMs > 2600) {
    perf.lowEffects = false;
    gameScreen.classList.remove('perf-low');
  }
}

function createObstacleVisual() {
  const group = new THREE.Group();

  const fire = new THREE.Mesh(
    new THREE.SphereGeometry(0.46, 12, 10),
    new THREE.MeshStandardMaterial({
      color: 0xff7a2f,
      emissive: 0xff5a1f,
      emissiveIntensity: 0.9,
      roughness: 0.45,
      metalness: 0.02
    })
  );
  fire.visible = false;
  fire.castShadow = true;
  fire.position.y = 0.58;
  group.add(fire);

  const log = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.38, 1.95, 10),
    new THREE.MeshStandardMaterial({ color: 0x6a472a, roughness: 0.92, metalness: 0.02 })
  );
  log.visible = false;
  log.castShadow = true;
  log.receiveShadow = true;
  log.rotation.z = Math.PI / 2;
  log.position.y = 0.42;
  group.add(log);

  const branch = new THREE.Mesh(
    new THREE.BoxGeometry(1.95, 0.24, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x4f3823, roughness: 0.96, metalness: 0.01 })
  );
  branch.visible = false;
  branch.castShadow = true;
  branch.receiveShadow = true;
  branch.position.y = 1.9;
  group.add(branch);

  const spikes = new THREE.Group();
  spikes.visible = false;
  for (let i = 0; i < 4; i += 1) {
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.6 + (i % 2) * 0.08, 6),
      new THREE.MeshStandardMaterial({ color: 0x8f9293, roughness: 0.7, metalness: 0.14 })
    );
    spike.castShadow = true;
    spike.receiveShadow = true;
    spike.position.set(-0.42 + i * 0.28, 0.28, 0);
    spikes.add(spike);
  }
  group.add(spikes);

  group.userData = { fire, log, branch, spikes };
  return group;
}

function createSidePropVisual() {
  const group = new THREE.Group();

  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.28, 0),
    new THREE.MeshStandardMaterial({ color: 0x5f665c, roughness: 1, metalness: 0.02 })
  );
  rock.visible = false;
  rock.castShadow = true;
  rock.receiveShadow = true;
  rock.position.y = 0.18;
  group.add(rock);

  const bush = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0x2a6b47, roughness: 0.95, metalness: 0.01 })
  );
  bush.visible = false;
  bush.castShadow = true;
  bush.receiveShadow = true;
  bush.position.y = 0.34;
  group.add(bush);

  group.userData = { rock, bush };
  return group;
}

function initThreeScene() {
  console.log('INIT THREE CALLED');
  if (!window.THREE) {
    throw new Error('THREE JS NOT LOADED');
  }
  if (threeState.renderer) {
    return Boolean(threeState.renderer);
  }
  console.log('THREE INIT');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1f1a);
  scene.fog = new THREE.Fog(0x0b1f1a, 8, 50);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 6);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  if (!renderer) {
    throw new Error('RENDERER FAILED');
  }
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.className = 'three-renderer';
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100vw';
  renderer.domElement.style.height = '100vh';
  renderer.domElement.style.zIndex = FORCE_VISIBILITY_MODE ? '9999' : '1';
  renderer.domElement.style.pointerEvents = FORCE_VISIBILITY_MODE ? 'auto' : 'none';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.visibility = 'visible';
  renderer.domElement.style.opacity = '1';
  document.body.appendChild(renderer.domElement);
  if (FORCE_VISIBILITY_MODE) {
    hideAllUiForForceVisibility(renderer.domElement);
  }

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(5, 10, 5);
  sun.castShadow = true;
  scene.add(sun);
  threeState.sunLight = sun;

  let road = threeState.roadMesh;
  if (!road) {
    const roadGeo = new THREE.PlaneGeometry(ROAD_HALF_WIDTH * 2, ROAD_LENGTH);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x27251f, roughness: 0.98, metalness: 0.01 });
    road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -24);
    road.receiveShadow = true;
    scene.add(road);
  }

  const leftDirt = new THREE.Mesh(
    new THREE.PlaneGeometry(6.2, ROAD_LENGTH + 14),
    new THREE.MeshStandardMaterial({ color: 0x153b2c, roughness: 1, metalness: 0 })
  );
  leftDirt.rotation.x = -Math.PI / 2;
  leftDirt.position.set(-(ROAD_HALF_WIDTH + 3.4), 0, -24);
  leftDirt.receiveShadow = true;
  scene.add(leftDirt);
  const rightDirt = leftDirt.clone();
  rightDirt.position.x = ROAD_HALF_WIDTH + 3.4;
  scene.add(rightDirt);
  threeState.dirtEdges.push(leftDirt, rightDirt);

  for (let i = 0; i < 26; i += 1) {
    const patch = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9 + Math.random() * 1.2, 1.8 + Math.random() * 2.2),
      new THREE.MeshStandardMaterial({
        color: Math.random() < 0.5 ? 0x312d26 : 0x1f1c18,
        roughness: 1,
        metalness: 0,
        emissive: 0x0b0907,
        emissiveIntensity: 0.08
      })
    );
    patch.rotation.x = -Math.PI / 2;
    patch.position.set(randomBetween(-(ROAD_HALF_WIDTH - 1.1), ROAD_HALF_WIDTH - 1.1), 0.011, -8 - i * 5.2);
    patch.receiveShadow = true;
    patch.userData.baseScaleX = 0.9 + Math.random() * 1.2;
    patch.userData.baseScaleY = 1.8 + Math.random() * 2.2;
    scene.add(patch);
    threeState.roadDetailMeshes.push(patch);
  }

  const laneMat = new THREE.MeshStandardMaterial({ color: 0xe7e0b9, roughness: 0.66, metalness: 0.04, emissive: 0x6a6137, emissiveIntensity: 0.12 });
  const markerGeom = new THREE.BoxGeometry(0.14, 0.03, 1.8);
  const markerOffsets = [-LANE_WORLD_X * 0.5, LANE_WORLD_X * 0.5];
  for (const laneX of markerOffsets) {
    for (let i = 0; i < 22; i += 1) {
      const marker = new THREE.Mesh(markerGeom, laneMat);
      marker.position.set(laneX, ROAD_SURFACE_Y + 0.015, -i * 6.4);
      marker.receiveShadow = true;
      scene.add(marker);
      threeState.laneMarkers.push(marker);
    }
  }

  const playerRoot = new THREE.Group();
  playerRoot.position.set(0, ROAD_SURFACE_Y, 0);
  playerRoot.position.z = 0;
  playerRoot.visible = false;
  scene.add(playerRoot);
  camera.position.set(0, 3, 6);
  camera.lookAt(playerRoot.position);

  const fallbackGeo = new THREE.BoxGeometry(1, 2, 1);
  const fallbackMat = new THREE.MeshStandardMaterial({ color: 0x5f7890, roughness: 0.9, metalness: 0.02 });
  const fallbackPlayer = new THREE.Mesh(fallbackGeo, fallbackMat);
  fallbackPlayer.position.set(0, 1, 0);
  fallbackPlayer.castShadow = true;
  fallbackPlayer.visible = false;
  playerRoot.add(fallbackPlayer);
  threeState.fallbackPlayer = fallbackPlayer;

  const playerShadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.52, 20),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.24 })
  );
  playerShadow.rotation.x = -Math.PI / 2;
  playerShadow.position.set(0, ROAD_SURFACE_Y + 0.01, 0.2);
  scene.add(playerShadow);
  threeState.playerShadow = playerShadow;

  for (let i = 0; i < 36; i += 1) {
    const dust = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xb59a78, transparent: true, opacity: 0 })
    );
    dust.visible = false;
    scene.add(dust);
    threeState.dustMeshes.push(dust);
  }

  for (let i = 0; i < 22; i += 1) {
    const mesh = createObstacleVisual();
    mesh.visible = false;
    scene.add(mesh);
    threeState.obstacleMeshes.push(mesh);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.55, 14),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.visible = false;
    scene.add(shadow);
    threeState.obstacleShadowMeshes.push(shadow);

    const glow = new THREE.PointLight(0xff5f2a, 0, 5.5, 2);
    glow.visible = false;
    scene.add(glow);
    threeState.fireGlowLights.push(glow);
  }

  threeState.testObstacle = null;
  threeState.forceTestBox = null;

  for (let i = 0; i < 36; i += 1) {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.14, 1.4, 6),
      new THREE.MeshStandardMaterial({ color: 0x3b2a1d, roughness: 1, metalness: 0 })
    );
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    const crown = new THREE.Mesh(
      new THREE.SphereGeometry(0.78, 10, 8),
      new THREE.MeshStandardMaterial({ color: 0x234d35, roughness: 0.96, metalness: 0.01 })
    );
    crown.castShadow = true;
    const tree = new THREE.Group();
    trunk.position.y = 0.7;
    crown.position.y = 1.85;
    tree.add(trunk);
    tree.add(crown);
    tree.visible = false;
    scene.add(tree);
    threeState.treeMeshes.push(tree);
  }

  for (let i = 0; i < 24; i += 1) {
    const prop = createSidePropVisual();
    prop.visible = false;
    scene.add(prop);
    threeState.sidePropMeshes.push(prop);
  }

  threeState.scene = scene;
  threeState.camera = camera;
  threeState.renderer = renderer;
  threeState.playerRoot = playerRoot;
  threeState.roadMesh = road;
  threeState.cameraFollowTarget = new THREE.Vector3(0, 3, 6);
  threeState.cameraLookTarget = new THREE.Vector3(0, 1, 0);

  if (THREE.GLTFLoader) {
    const loader = new THREE.GLTFLoader();
    loader.load(
      PLAYER_MODEL_URL,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        model.rotation.y = Math.PI;
        model.rotation.x = 0;
        model.rotation.z = 0;
        model.scale.set(1.2, 1.2, 1.2);
        model.position.set(0, 0.02, 0);
        playerRoot.add(model);
        model.visible = true;
        playerRoot.visible = true;
        if (threeState.fallbackPlayer) {
          threeState.fallbackPlayer.visible = false;
        }
        threeState.playerModel = model;

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          const runClip = detectAnimationClip(gltf.animations, [/run/i, /jog/i, /walk/i]) || gltf.animations[0];
          const jumpClip = detectAnimationClip(gltf.animations, [/jump/i, /leap/i, /air/i]);
          const idleClip = detectAnimationClip(gltf.animations, [/idle/i, /breath/i]) || runClip;
          const slideClip = detectAnimationClip(gltf.animations, [/slide/i, /crouch/i, /roll/i, /duck/i]);
          const hitClip = detectAnimationClip(gltf.animations, [/hit/i, /hurt/i, /death/i, /fall/i]);

          const runAction = mixer.clipAction(runClip);
          const idleAction = mixer.clipAction(idleClip);
          const jumpAction = jumpClip ? mixer.clipAction(jumpClip) : null;
          const slideAction = slideClip ? mixer.clipAction(slideClip) : null;
          const hitAction = hitClip ? mixer.clipAction(hitClip) : null;

          if (jumpAction) {
            jumpAction.loop = THREE.LoopOnce;
            jumpAction.clampWhenFinished = true;
          }
          if (slideAction) {
            slideAction.loop = THREE.LoopOnce;
            slideAction.clampWhenFinished = true;
          }
          if (hitAction) {
            hitAction.loop = THREE.LoopOnce;
            hitAction.clampWhenFinished = true;
          }

          threeState.animationActions = {
            run: runAction,
            idle: idleAction,
            jump: jumpAction || runAction,
            slide: slideAction || runAction,
            hit: hitAction || jumpAction || runAction
          };
          threeState.animationState = 'run';

          runAction.enabled = true;
          runAction.play();
          threeState.playerMixer = mixer;
          threeState.runAction = runAction;
        }
      },
      undefined,
      (error) => {
        console.error('MODEL FAILED', error);
        if (threeState.fallbackPlayer) {
          threeState.fallbackPlayer.visible = true;
        }
        playerRoot.visible = true;
      }
    );
  }
  return true;
}

function setRendererInputEnabled(isEnabled) {
  if (!threeState.renderer) {
    return;
  }
  threeState.renderer.domElement.style.pointerEvents = isEnabled ? 'auto' : 'none';
}

function syncThreeScene() {
  if (!threeState.scene || !threeState.playerRoot) {
    return;
  }
  if (!threeState.scene.children.includes(threeState.playerRoot)) {
    threeState.scene.add(threeState.playerRoot);
  }
  if (threeState.roadMesh && !threeState.scene.children.includes(threeState.roadMesh)) {
    threeState.scene.add(threeState.roadMesh);
  }
  threeState.playerRoot.visible = true;
  if (threeState.playerModel) {
    threeState.playerModel.visible = true;
    if (threeState.fallbackPlayer) {
      threeState.fallbackPlayer.visible = false;
    }
  } else if (threeState.fallbackPlayer && threeState.playerRoot.visible) {
    threeState.fallbackPlayer.visible = true;
  }

  const laneX = (laneSystem.currentFloat - 1) * LANE_WORLD_X;
  const landingBounce = fx.landingBounceMs > 0
    ? Math.sin((1 - fx.landingBounceMs / 150) * Math.PI) * 0.12
    : 0;
  const jumpHeight = Math.min(2.5, Math.max(0, player.yOffset));
  const playerY = ROAD_SURFACE_Y + jumpHeight - landingBounce;
  const pickupPhase = 1 - fx.pickupPopMs / 240;
  const pickupScale = fx.pickupPopMs > 0 ? 1 + Math.sin(clamp(pickupPhase, 0, 1) * Math.PI) * 0.08 : 1;
  const speedNorm = clamp((game.speed - 220) / 260, 0, 1);
  threeState.playerRoot.position.x += (laneX - threeState.playerRoot.position.x) * 0.22;
  threeState.playerRoot.position.y += (playerY - threeState.playerRoot.position.y) * 0.34;
  threeState.playerRoot.position.z = 0;
  const laneTilt = (laneSystem.targetIndex - laneSystem.currentFloat) * 0.08;
  threeState.playerRoot.rotation.x = -0.08;
  threeState.playerRoot.rotation.z = laneTilt;
  const landingStretch = fx.landingBounceMs > 0
    ? Math.sin((1 - fx.landingBounceMs / 150) * Math.PI) * 0.08
    : 0;
  const squashScaleY = performance.now() < player.landingSquashUntil ? 0.95 : 1;
  threeState.playerRoot.scale.set(
    pickupScale * (1 + landingStretch * 0.2),
    pickupScale * Math.max(0.86, 1 - landingStretch) * squashScaleY,
    pickupScale * (1 + landingStretch * 0.2)
  );
  if (threeState.playerModel) {
    // If slide clip is missing, simulate crouch with model transform.
    const hasRealSlide = threeState.animationActions.slide && threeState.animationActions.slide !== threeState.animationActions.run;
    const slideBlend = player.pose === 'slide' ? clamp(player.poseTimerMs / 360, 0, 1) : 0;
    if (!hasRealSlide) {
      const crouchScale = 1 - slideBlend * 0.28;
      threeState.playerModel.scale.setScalar(1.2 * crouchScale);
      threeState.playerModel.position.y = 0.02 + slideBlend * -0.28;
      threeState.playerModel.rotation.x = slideBlend * -0.24;
      threeState.playerModel.rotation.z = 0;
    } else {
      threeState.playerModel.scale.setScalar(1.2);
      threeState.playerModel.position.y = 0.02;
      threeState.playerModel.rotation.x = 0;
      threeState.playerModel.rotation.z = 0;
    }
  }
  if (threeState.playerMixer && threeState.runAction) {
    const speed = clamp(game.speed / 250, 0.8, 1.8);
    threeState.runAction.timeScale = speed * 0.5;
  }

  const cameraTarget = threeState.cameraFollowTarget || new THREE.Vector3();
  cameraTarget.set(
    threeState.playerRoot.position.x,
    threeState.playerRoot.position.y + 4,
    threeState.playerRoot.position.z + 10
  );
  threeState.camera.position.lerp(cameraTarget, 0.1);
  const lookTarget = threeState.cameraLookTarget || new THREE.Vector3();
  lookTarget.set(
    threeState.playerRoot.position.x,
    threeState.playerRoot.position.y + 1,
    threeState.playerRoot.position.z - 10
  );
  threeState.camera.lookAt(lookTarget);
  threeState.camera.rotation.z = laneTilt * 0.12;
  const targetFov = 75 + speedNorm * 5 + (fx.startZoomMs > 0 ? (fx.startZoomMs / 500) * 3 : 0);
  if (Math.abs(threeState.camera.fov - targetFov) > 0.05) {
    threeState.camera.fov += (targetFov - threeState.camera.fov) * 0.08;
    threeState.camera.updateProjectionMatrix();
  }
  if (threeState.sunLight) {
    threeState.sunLight.intensity = 1.02 + Math.sin(performance.now() * 0.0009) * 0.06 + Math.sin(performance.now() * 0.0042) * 0.04;
  }

  if (threeState.playerShadow) {
    threeState.playerShadow.position.x = threeState.playerRoot.position.x;
    threeState.playerShadow.position.z = threeState.playerRoot.position.z;
    threeState.playerShadow.scale.setScalar(1 + speedNorm * 0.08);
    threeState.playerShadow.material.opacity = 0.2 + speedNorm * 0.08;
  }

  let markerIndex = 0;
  const scroll = (game.roadOffset / 52) * 6.4;
  for (const marker of threeState.laneMarkers) {
    const zBase = -((markerIndex % 22) * 6.4);
    marker.position.z = zBase + scroll;
    marker.material.emissiveIntensity = 0.08 + Math.max(0, 1 - Math.abs(marker.position.z) / 55) * 0.14;
    while (marker.position.z > 4) {
      marker.position.z -= 140;
    }
    markerIndex += 1;
  }

  for (let i = 0; i < threeState.roadDetailMeshes.length; i += 1) {
    const patch = threeState.roadDetailMeshes[i];
    patch.position.z += (game.speed / 250) * 0.22;
    const depthShade = Math.max(0.12, 1 - Math.abs(patch.position.z + 8) / 120);
    patch.material.emissiveIntensity = 0.02 + depthShade * 0.06;
    if (patch.position.z > 4) {
      patch.position.z = -112 - Math.random() * 10;
      patch.position.x = randomBetween(-(ROAD_HALF_WIDTH - 1.1), ROAD_HALF_WIDTH - 1.1);
      patch.rotation.z = randomBetween(-0.18, 0.18);
      const scaleX = 0.8 + Math.random() * 1.4;
      const scaleY = 1.2 + Math.random() * 2.6;
      patch.scale.set(scaleX, scaleY, 1);
    }
  }

  for (let i = 0; i < threeState.dustMeshes.length; i += 1) {
    const mesh = threeState.dustMeshes[i];
    const p = fx.dustParticles[i];
    if (!p) {
      mesh.visible = false;
      continue;
    }
    const alpha = clamp(p.lifeMs / p.maxLifeMs, 0, 1);
    const pxOffset = (p.x - getPlayerCenterX()) / Math.max(22, calibration.playerScale * 26);
    const zTrail = 0.2 + (1 - alpha) * (0.9 + speedNorm * 0.5);
    mesh.visible = true;
    mesh.position.set(
      threeState.playerRoot.position.x + pxOffset,
      ROAD_SURFACE_Y + 0.05 + (1 - alpha) * 0.2,
      threeState.playerRoot.position.z + zTrail
    );
    mesh.scale.setScalar(0.5 + (p.size / Math.max(1, calibration.playerScale)) * 0.035);
    mesh.material.opacity = alpha * 0.28;
  }

  for (let i = 0; i < threeState.treeMeshes.length; i += 1) {
    const treeMesh = threeState.treeMeshes[i];
    const item = sideEnvironment.items[i];
    if (!item) {
      treeMesh.visible = false;
      continue;
    }
    const z = -34 + item.depth * 44;
    const sideOffset = ROAD_HALF_WIDTH + 1.5 + item.depth * 2.4;
    treeMesh.visible = true;
    treeMesh.position.set(item.side * sideOffset, 0, z);
    const tScale = (item.scale || 1) * (0.38 + item.depth * 1.26);
    treeMesh.scale.set(0.9 * tScale, tScale, 0.9 * tScale);
    treeMesh.rotation.y = (item.yaw || 0) + Math.sin(performance.now() * 0.0017 + item.swaySeed) * 0.08;
  }

  for (let i = 0; i < threeState.sidePropMeshes.length; i += 1) {
    const propMesh = threeState.sidePropMeshes[i];
    const item = sideEnvironment.items[i];
    if (!item) {
      propMesh.visible = false;
      continue;
    }
    const z = -30 + item.depth * 40;
    const sideOffset = ROAD_HALF_WIDTH + 0.9 + item.depth * 1.8;
    const scale = (item.scale || 1) * (0.32 + item.depth * 0.7);
    propMesh.visible = true;
    propMesh.position.set(item.side * sideOffset, 0, z);
    propMesh.rotation.y = (item.yaw || 0) * 0.8;
    propMesh.scale.setScalar(scale);
    const visuals = propMesh.userData;
    const isBush = (i + Math.round((item.swaySeed || 0) * 10)) % 2 === 0;
    visuals.rock.visible = !isBush;
    visuals.bush.visible = isBush;
  }

  for (let i = 0; i < threeState.obstacleMeshes.length; i += 1) {
    const mesh = threeState.obstacleMeshes[i];
    const shadow = threeState.obstacleShadowMeshes[i];
    const glow = threeState.fireGlowLights[i];
    const item = traffic.items[i];
    if (!item) {
      mesh.visible = false;
      if (shadow) {
        shadow.visible = false;
      }
      if (glow) {
        glow.visible = false;
      }
      continue;
    }
    mesh.visible = true;
    const z = clamp(-50 + item.depth * 52 * 0.9, -50, 2);
    const x = (item.laneIndex - 1) * LANE_WORLD_X;
    const visuals = mesh.userData;
    mesh.userData.type = item.type === 'low_branch' ? 'high' : 'ground';
    visuals.fire.visible = item.type === 'fire';
    visuals.log.visible = item.type === 'rolling_log';
    visuals.branch.visible = item.type === 'low_branch';
    visuals.spikes.visible = item.type === 'spikes';
    mesh.position.set(x, 0, z);
    mesh.rotation.set(0, 0, 0);
    mesh.scale.setScalar(1);
    if (item.type === 'fire') {
      visuals.fire.scale.setScalar(0.92 + Math.sin(performance.now() * 0.013 + i) * 0.08);
    } else if (item.type === 'rolling_log') {
      visuals.log.rotation.x = performance.now() * 0.006;
    } else {
      visuals.log.rotation.x = 0;
    }
    if (shadow) {
      shadow.visible = true;
      shadow.position.set(x, 0.02, z + 0.08);
      const indicatorStrength = clamp(item.depth, 0.15, 1);
      shadow.scale.setScalar((item.type === 'low_branch' ? 1.5 : item.type === 'rolling_log' ? 1.2 : 0.95) + indicatorStrength * 0.18);
      shadow.material.opacity = (item.type === 'fire' ? 0.26 : 0.19) + indicatorStrength * 0.12;
    }
    if (glow) {
      if (item.type === 'fire') {
        glow.visible = true;
        glow.position.set(x, 0.95, z);
        glow.intensity = 0.7 + Math.sin(performance.now() * 0.012 + i) * 0.22;
      } else {
        glow.visible = false;
      }
    }
  }

}

function setDiagnosticsVisible(isVisible) {
  diagnostics.visible = isVisible;
  diagnostics.nextUpdateTs = 0;
  diagnosticsOverlay?.classList.toggle('hidden', !isVisible);
}

function toggleDiagnosticsOverlay() {
  setDiagnosticsVisible(!diagnostics.visible);
}

function clearLongPressTimer() {
  if (diagnostics.longPressTimer) {
    window.clearTimeout(diagnostics.longPressTimer);
    diagnostics.longPressTimer = null;
  }
}

function registerTripleTap(nowTs) {
  if (nowTs - diagnostics.lastTapTs <= 520) {
    diagnostics.tapCount += 1;
  } else {
    diagnostics.tapCount = 1;
  }
  diagnostics.lastTapTs = nowTs;
  if (diagnostics.tapCount >= 3) {
    diagnostics.tapCount = 0;
    toggleDiagnosticsOverlay();
    return true;
  }
  return false;
}

function updateDiagnosticsOverlay(timestamp, dtSeconds) {
  if (!diagnostics.visible || !diagnosticsText) {
    return;
  }
  if (timestamp < diagnostics.nextUpdateTs) {
    return;
  }
  diagnostics.nextUpdateTs = timestamp + 250;
  const dtMs = dtSeconds * 1000;
  diagnosticsText.textContent = [
    `FPS: ${perf.fpsEma.toFixed(1)}`,
    `dt: ${dtMs.toFixed(2)}ms`,
    `speed: ${game.speed.toFixed(1)}`,
    `pScale: ${calibration.playerScale.toFixed(3)}`,
    `mScale: ${calibration.motionScale.toFixed(3)}`,
    `swipe: ${touch.minSwipeDistance}px`,
    `vp: ${calibration.viewportWidth}x${calibration.viewportHeight}`
  ].join('\n');
}

function setupZoomPreventionGuards() {
  const preventMultiTouchZoom = (event) => {
    if (event.touches && event.touches.length > 1) {
      event.preventDefault();
    }
  };
  document.addEventListener('touchstart', preventMultiTouchZoom, { passive: false });
  document.addEventListener('touchmove', preventMultiTouchZoom, { passive: false });
  document.addEventListener('gesturestart', (event) => event.preventDefault(), { passive: false });
  document.addEventListener('wheel', (event) => {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }, { passive: false });
}

function hideAllUiForForceVisibility(rendererElement) {
  const allNodes = document.body.querySelectorAll('*');
  for (const node of allNodes) {
    if (node !== rendererElement) {
      node.style.display = 'none';
    }
  }
}

async function ensureThreeRuntime() {
  if (runtime.triedThreeLoad) {
    if (!runtime.threeReady) {
      throw new Error('THREE JS NOT LOADED');
    }
    return runtime.threeReady;
  }
  runtime.triedThreeLoad = true;
  if (!window.THREE) {
    throw new Error('THREE JS NOT LOADED');
  }
  runtime.threeReady = Boolean(window.THREE);
  return runtime.threeReady;
}

async function enableImmersiveMobileMode() {
  if (immersive.requested) {
    return;
  }
  immersive.requested = true;
  try {
    const root = document.documentElement;
    if (!document.fullscreenElement && root.requestFullscreen) {
      await root.requestFullscreen({ navigationUI: 'hide' });
    }
  } catch (_error) {
    // Some browsers block fullscreen; continue with best effort.
  }
  try {
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock('portrait');
    }
  } catch (_error) {
    // Orientation lock is not available in all browsers.
  }
}

function animateScreen(screenElement) {
  screenElement.classList.remove('screen-pop');
  void screenElement.offsetWidth;
  screenElement.classList.add('screen-pop');
}

function hideAllScreens() {
  startScreen.classList.add('hidden');
  characterScreen.classList.add('hidden');
  settingsScreen?.classList.add('hidden');
  tutorialScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
}

function showBootScreen(targetScreen) {
  for (const screen of [splashScreen, loadingScreen, npcSceneScreen]) {
    if (!screen) {
      continue;
    }
    screen.classList.toggle('hidden', screen !== targetScreen);
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function runIntroSequence() {
  showBootScreen(splashScreen);
  await wait(1300);
  splashScreen.classList.add('hidden');
  loadingScreen.classList.add('hidden');
  npcSceneScreen.classList.add('hidden');
  mainApp.classList.remove('hidden');
  showStartScreen();
}

function setFeedback(text) {
  if (feedbackText) {
    feedbackText.textContent = text;
  }
}

function setInstruction(text) {
  if (instructionText) {
    instructionText.textContent = text;
  }
}

function setLearningCommandOverlay(text) {
  if (!learningCommandOverlay || !learningCommandText) {
    return;
  }
  if (!text) {
    learningCommandOverlay.classList.add('hidden');
    return;
  }
  learningCommandText.textContent = text;
  learningCommandOverlay.classList.remove('hidden');
}

function showGameOverMessage() {
  gameScreen.classList.add('game-over-active');
  gameOverPopup.classList.remove('hidden');
  gameOverPopup.classList.remove('popup-enter');
  void gameOverPopup.offsetWidth;
  gameOverPopup.classList.add('popup-enter');
  finalScoreValue.textContent = Math.floor(game.score).toString();
  gameOverMessage.classList.remove('hidden');
}

function hideGameOverMessage() {
  gameScreen.classList.remove('game-over-active');
  gameOverPopup.classList.add('hidden');
  gameOverPopup.classList.remove('popup-enter');
  gameOverMessage.classList.add('hidden');
}

function showRestartButton() {
  restartButton.classList.remove('hidden');
}

function hideRestartButton() {
  restartButton.classList.add('hidden');
}

function showAdScreen() {
  if (adScreen) {
    adScreen.classList.remove('hidden');
  }
}

function hideAdScreen() {
  if (adScreen) {
    adScreen.classList.add('hidden');
  }
}

function setRendererVisibility(isVisible) {
  if (!threeState.renderer) {
    return;
  }
  threeState.renderer.domElement.style.display = isVisible ? 'block' : 'none';
}

function hidePauseOverlay() {
  pauseOverlay?.classList.add('hidden');
}

function showPauseOverlay() {
  pauseOverlay?.classList.remove('hidden');
}

function applySettings() {
  if (settings.graphicsQuality === 'low') {
    perf.lowEffects = true;
    gameScreen.classList.add('perf-low');
  } else if (perf.fpsEma >= 58 || !game.running) {
    perf.lowEffects = false;
    gameScreen.classList.remove('perf-low');
  }
  if (!settings.musicEnabled) {
    audioLayer.targetAmbience = 0;
    audioLayer.currentAmbience = 0;
    if (audioLayer.ambienceGain && audioContext) {
      audioLayer.ambienceGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.05);
    }
  }
}

function renderSettingsUI() {
  if (toggleSoundButton) {
    toggleSoundButton.textContent = settings.soundEnabled ? 'ON' : 'OFF';
  }
  if (toggleMusicButton) {
    toggleMusicButton.textContent = settings.musicEnabled ? 'ON' : 'OFF';
  }
  if (toggleGraphicsButton) {
    toggleGraphicsButton.textContent = settings.graphicsQuality.toUpperCase();
  }
}

function updateScoreText() {
  scoreValue.textContent = Math.floor(hud.displayScore).toString();
}

function updateStarText() {
  starValue.textContent = Math.floor(hud.displayStars).toString();
}

function popStarsHud() {
  const starChip = starValue?.parentElement;
  if (!starChip) {
    return;
  }
  starChip.classList.remove('star-pop');
  void starChip.offsetWidth;
  starChip.classList.add('star-pop');
}

function popScoreHud() {
  const scoreChip = scoreValue?.parentElement;
  if (!scoreChip) {
    return;
  }
  scoreChip.classList.remove('score-pop');
  void scoreChip.offsetWidth;
  scoreChip.classList.add('score-pop');
}

function updateHudAnimation(dtSeconds) {
  const scoreGap = game.score - hud.displayScore;
  hud.displayScore += scoreGap * Math.min(1, dtSeconds * 10.5);

  const starGap = game.stars - hud.displayStars;
  hud.displayStars += starGap * Math.min(1, dtSeconds * 14);

  const roundedStars = Math.floor(hud.displayStars);
  if (roundedStars > hud.lastStarsValue) {
    popStarsHud();
    hud.lastStarsValue = roundedStars;
  }

  const roundedScore = Math.floor(hud.displayScore);
  if (roundedScore > hud.lastScoreValue) {
    popScoreHud();
    hud.lastScoreValue = roundedScore;
  }

  updateScoreText();
  updateStarText();
}

function getSelectedCharacter() {
  return characters.find((character) => character.id === player.selectedCharacterId) || characters[0];
}

function saveProgress() {
  const data = {
    bestScore: game.bestScore,
    bestStars: game.bestStars,
    selectedCharacterId: player.selectedCharacterId,
    unlockedIds: characters.filter((character) => character.unlocked).map((character) => character.id),
    settings
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    const saved = JSON.parse(raw);
    game.bestScore = Number(saved.bestScore) || 0;
    game.bestStars = Number(saved.bestStars) || Math.floor(game.bestScore / 40);
    const unlockedIds = new Set(saved.unlockedIds || []);
    for (const character of characters) {
      character.unlocked = character.unlockScore === 0 || unlockedIds.has(character.id);
    }
    if (saved.selectedCharacterId && characters.some((character) => character.id === saved.selectedCharacterId)) {
      player.selectedCharacterId = saved.selectedCharacterId;
    }
    Object.assign(settings, DEFAULT_SETTINGS, saved.settings || {});
  } catch (_error) {
    // Keep defaults on invalid saved data.
  }
  applySettings();
  renderSettingsUI();
}

function unlockCharactersByScore() {
  for (const character of characters) {
    const scoreUnlocked = game.bestScore >= character.unlockScore;
    const starsUnlocked = game.bestStars >= (character.unlockStars || 0);
    if (!character.unlocked && (scoreUnlocked || starsUnlocked)) {
      character.unlocked = true;
      setFeedback(`Unlocked ${character.name}!`);
    }
  }
}

function renderCharacterList() {
  characterList.innerHTML = '';
  for (const character of characters) {
    const card = document.createElement('div');
    const isSelected = character.id === player.selectedCharacterId;
    card.className = `character-card ${character.unlocked ? '' : 'locked'}`;
    card.innerHTML = `
      <div class="character-avatar" style="background: linear-gradient(180deg, ${character.shirt} 0%, ${character.pants} 100%);"></div>
      <p>${character.unlocked ? '' : '🔒 '}${character.name}</p>
      <button class="button ${isSelected ? 'button--ghost' : ''}" type="button">
        ${character.unlocked ? (isSelected ? 'Selected' : 'Select') : `Locked (${character.unlockScore} score / ${character.unlockStars} stars)`}
      </button>
    `;
    const button = card.querySelector('button');
    button.disabled = !character.unlocked;
    button.addEventListener('click', () => {
      player.selectedCharacterId = character.id;
      selectedCharacterName.textContent = character.name;
      saveProgress();
      renderCharacterList();
    });
    characterList.appendChild(card);
  }
  characterProgressText.textContent = `Best score: ${Math.floor(game.bestScore)} | Best stars: ${Math.floor(game.bestStars)}`;
}

function showStartScreen() {
  runtime.gameStarted = false;
  runtime.gamePaused = false;
  setRendererInputEnabled(false);
  hideAllScreens();
  hidePauseOverlay();
  setRendererVisibility(false);
  gameScreen.style.display = 'none';
  startScreen.classList.remove('hidden');
  startScreen.style.display = 'block';
  animateScreen(startScreen);
  stopGameLoop();
  if (pauseButton) {
    pauseButton.textContent = 'Pause';
  }
  setAmbienceTarget(0.004);
}

function showCharacterScreen() {
  runtime.gamePaused = false;
  setRendererInputEnabled(false);
  if (!characterScreen) {
    return;
  }
  hideAllScreens();
  setRendererVisibility(false);
  characterScreen.classList.remove('hidden');
  renderCharacterList();
  animateScreen(characterScreen);
}

function showSettingsScreen() {
  runtime.gamePaused = false;
  setRendererInputEnabled(false);
  if (!settingsScreen) {
    return;
  }
  hideAllScreens();
  setRendererVisibility(false);
  renderSettingsUI();
  settingsScreen.classList.remove('hidden');
  animateScreen(settingsScreen);
}

function toggleSoundSetting() {
  settings.soundEnabled = !settings.soundEnabled;
  applySettings();
  renderSettingsUI();
  saveProgress();
}

function toggleMusicSetting() {
  settings.musicEnabled = !settings.musicEnabled;
  applySettings();
  renderSettingsUI();
  saveProgress();
}

function toggleGraphicsSetting() {
  settings.graphicsQuality = settings.graphicsQuality === 'high' ? 'low' : 'high';
  applySettings();
  renderSettingsUI();
  saveProgress();
}

function returnHomeFromPause() {
  runtime.gameStarted = false;
  runtime.gamePaused = false;
  hidePauseOverlay();
  showStartScreen();
}

function showTutorialScreen() {
  if (!tutorialScreen) {
    showGameScreen();
    return;
  }
  hideAllScreens();
  tutorialScreen.classList.remove('hidden');
  animateScreen(tutorialScreen);
}

function enterMainGameFromScene() {
  splashScreen.classList.add('hidden');
  loadingScreen.classList.add('hidden');
  npcSceneScreen.classList.add('hidden');
  mainApp.classList.remove('hidden');
  showStartScreen();
}

function playTinyTone(isPositive) {
  playSynthTone({
    type: isPositive ? 'triangle' : 'sawtooth',
    startHz: isPositive ? 720 : 290,
    endHz: isPositive ? 920 : 210,
    peak: 0.04,
    decay: 0.16
  });
}

function playJumpSound() {
  playSynthTone({
    type: 'triangle',
    startHz: 420,
    endHz: 650,
    peak: 0.022,
    decay: 0.12
  });
}

function playCollectSound() {
  playSynthTone({
    type: 'sine',
    startHz: 640,
    endHz: 980,
    peak: 0.026,
    decay: 0.19
  });
}

function playGameOverSound() {
  playSynthTone({
    type: 'triangle',
    startHz: 260,
    endHz: 170,
    peak: 0.028,
    decay: 0.22
  });
}

function playHitSound() {
  playSynthTone({
    type: 'sawtooth',
    startHz: 210,
    endHz: 120,
    peak: 0.018,
    decay: 0.12
  });
}

function playFootstepSound() {
  playSynthTone({
    type: 'triangle',
    startHz: 180,
    endHz: 120,
    peak: 0.008,
    decay: 0.06
  });
}

function ensureAmbienceStarted() {
  if (!settings.musicEnabled) {
    return;
  }
  if (audioLayer.ambienceStarted) {
    return;
  }
  const context = getAudioContext();
  if (!context) {
    return;
  }
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.connect(context.destination);

  const lowPad = context.createOscillator();
  lowPad.type = 'sine';
  lowPad.frequency.setValueAtTime(88, context.currentTime);
  const lowFilter = context.createBiquadFilter();
  lowFilter.type = 'lowpass';
  lowFilter.frequency.setValueAtTime(240, context.currentTime);
  lowPad.connect(lowFilter);
  lowFilter.connect(gain);
  lowPad.start();

  const airPad = context.createOscillator();
  airPad.type = 'triangle';
  airPad.frequency.setValueAtTime(210, context.currentTime);
  const airFilter = context.createBiquadFilter();
  airFilter.type = 'bandpass';
  airFilter.frequency.setValueAtTime(620, context.currentTime);
  airPad.connect(airFilter);
  airFilter.connect(gain);
  airPad.start();

  audioLayer.ambienceGain = gain;
  audioLayer.ambienceNodes = [lowPad, airPad];
  audioLayer.ambienceStarted = true;
}

function setAmbienceTarget(level) {
  audioLayer.targetAmbience = settings.musicEnabled ? clamp(level, 0, 0.03) : 0;
}

function updateAudioLayer(dtMs) {
  ensureAmbienceStarted();
  const context = getAudioContext();
  if (audioLayer.ambienceGain && context) {
    audioLayer.currentAmbience += (audioLayer.targetAmbience - audioLayer.currentAmbience) * Math.min(1, dtMs / 240);
    audioLayer.ambienceGain.gain.setTargetAtTime(Math.max(0.0001, audioLayer.currentAmbience), context.currentTime, 0.09);
  }

  if (!game.running || game.gameOver || !player.onGround || player.pose !== 'idle') {
    return;
  }
  audioLayer.footstepTimerMs -= dtMs;
  if (audioLayer.footstepTimerMs <= 0) {
    playFootstepSound();
    const speedNorm = clamp((game.speed - 220) / 220, 0, 1);
    audioLayer.footstepTimerMs = 300 - speedNorm * 120;
  }
}

function showFlashText(element, text, durationMs = 420) {
  if (!element) {
    return;
  }
  element.textContent = text;
  element.classList.remove('hidden');
  element.classList.remove('flash-pop');
  void element.offsetWidth;
  element.classList.add('flash-pop');
  window.setTimeout(() => {
    element.classList.add('hidden');
    element.classList.remove('flash-pop');
  }, durationMs);
}

function triggerNearMissFeedback(bonus = 5) {
  gameScreen.classList.remove('near-hit-flash');
  void gameScreen.offsetWidth;
  gameScreen.classList.add('near-hit-flash');
  window.setTimeout(() => gameScreen.classList.remove('near-hit-flash'), 190);
  game.score += bonus;
  showFlashText(nearMissText, `Near Miss +${bonus}`, 460);
}

function addComboSuccess() {
  game.combo = Math.min(99, game.combo + 1);
  game.comboTimerMs = 2200;
  const bonus = Math.max(0, game.combo - 1);
  if (bonus > 0) {
    game.score += bonus;
  }
  showFlashText(comboText, `Combo x${game.combo}`, 520);
}

function setupNpcInteractions() {
  const lines = ['You can win!', "Let's go!", 'Try your best!', 'Have fun!'];
  for (const npcElement of npcCharacters) {
    const onCheer = () => {
      const bubble = npcElement.querySelector('.bubble');
      if (bubble) {
        bubble.textContent = lines[Math.floor(Math.random() * lines.length)];
      }
      npcElement.classList.remove('npc-tap');
      void npcElement.offsetWidth;
      npcElement.classList.add('npc-tap');
      playTinyTone(true);
    };
    npcElement.addEventListener('click', onCheer);
    npcElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onCheer();
      }
    });
  }
}

function resetLaneState() {
  laneSystem.currentIndex = 1;
  laneSystem.targetIndex = 1;
  laneSystem.currentFloat = 1;
  laneSystem.fromFloat = 1;
  laneSystem.moveProgress = 1;
}

function resetGameState() {
  game.score = 0;
  game.stars = 0;
  game.gameOver = false;
  game.lastFrameTime = 0;
  game.speed = 245;
  game.roadOffset = 0;
  game.sideOffset = 0;
  game.elapsedMs = 0;
  game.slideBoostMs = 0;
  game.smoothedDtSeconds = 1 / 60;
  game.combo = 0;
  game.comboTimerMs = 0;
  traffic.items = [];
  traffic.spawnTimerMs = 800;
  traffic.lastSpawnMsByLane = [-10000, -10000, -10000];
  power.items = [];
  power.spawnTimerMs = 3000;
  power.active = false;
  power.timerMs = 0;
  learning.current = null;
  learning.timerMs = 0;
  learning.nextTimerMs = 1200;
  player.yOffset = 0;
  player.velocityY = 0;
  player.jumpStartTime = 0;
  player.landingSquashUntil = 0;
  player.onGround = true;
  player.pose = 'idle';
  player.poseTimerMs = 0;
  player.runCycle = 0;
  if (threeState.runAction) {
    threeState.runAction.reset();
    threeState.runAction.play();
  }
  if (threeState.playerMixer) {
    threeState.animationState = 'run';
    setAnimationState('run', 0.08);
  }
  hud.displayScore = 0;
  hud.displayStars = 0;
  hud.lastStarsValue = 0;
  hud.lastScoreValue = 0;
  fx.screenShakeMs = 0;
  fx.screenShakeStrength = 0;
  fx.powerPulseMs = 0;
  fx.actionBounceMs = 0;
  fx.landingBounceMs = 0;
  fx.startZoomMs = 500;
  fx.fightPopMs = 0;
  fx.fightSparkMs = 0;
  fx.pickupPopMs = 0;
  fx.dustParticles = [];
  fx.dustSpawnMs = 0;
  fx.gameOverDramaMs = 0;
  fx.gameOverFade = 0;
  fx.gameOverCommitted = false;
  perf.fpsEma = 60;
  perf.lowFpsMs = 0;
  perf.highFpsMs = 0;
  perf.lowEffects = false;
  gameScreen.classList.remove('perf-low');
  gameScreen.classList.remove('near-hit-flash');
  setFeedback('Swipe to move. Follow the command!');
  setInstruction('Get Ready');
  setLearningCommandOverlay('');
  hideGameOverMessage();
  hideRestartButton();
  hideAdScreen();
  rewardText.classList.add('hidden');
  nearMissText?.classList.add('hidden');
  comboText?.classList.add('hidden');
  magnetStatus.classList.add('hidden');
  if (speedVignette) {
    speedVignette.style.opacity = '0';
  }
  audioLayer.footstepTimerMs = 0;
  setAmbienceTarget(0.018);
  updateScoreText();
  updateStarText();
  selectedCharacterName.textContent = getSelectedCharacter().name;
  resetLaneState();
}

function resizeGameCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'none';
  updateDeviceCalibration();
  perspectiveRoad.bottomY = canvas.height;
  perspectiveRoad.horizonY = Math.max(56, canvas.height * 0.155);
  const roadWidthFactor = clamp(calibration.viewportWidth / 420, 0.95, 1.08);
  perspectiveRoad.bottomWidth = canvas.width * clamp(0.9 + (roadWidthFactor - 1) * 0.12, 0.9, 0.97);
  perspectiveRoad.topWidth = canvas.width * clamp(0.25 + (roadWidthFactor - 1) * 0.05, 0.24, 0.31);
  if (threeState.renderer && threeState.camera) {
    threeState.renderer.setSize(window.innerWidth, window.innerHeight);
    threeState.camera.aspect = window.innerWidth / window.innerHeight;
    threeState.camera.updateProjectionMatrix();
  }
}

function stopGameLoop() {
  game.running = false;
  runtime.gamePaused = false;
  if (game.animationId !== null) {
    cancelAnimationFrame(game.animationId);
  }
  game.animationId = null;
}

function startGameLoop() {
  if (game.running) {
    return;
  }
  if (!threeState.renderer || !threeState.scene || !threeState.camera) {
    throw new Error('RENDERER FAILED');
  }
  runtime.gamePaused = false;
  game.running = true;
  console.log('RENDER LOOP RUNNING');
  game.animationId = requestAnimationFrame(gameLoop);
}

function jump() {
  if (!player.onGround) {
    return false;
  }
  player.velocityY = 0.35;
  player.yOffset = 0;
  player.jumpStartTime = performance.now();
  player.onGround = false;
  player.pose = 'jump';
  setAnimationState('jump', 0.2);
  playJumpSound();
  return true;
}

function slide() {
  player.pose = 'slide';
  player.poseTimerMs = 360;
  game.slideBoostMs = Math.max(game.slideBoostMs, 180);
  setAnimationState('slide', 0.12);
  return true;
}

function fight() {
  player.pose = 'fight';
  player.poseTimerMs = 200;
  game.slideBoostMs = Math.max(game.slideBoostMs, 90);
  fx.fightPopMs = 200;
  fx.fightSparkMs = 90;
  fx.screenShakeMs = 120;
  fx.screenShakeStrength = 2.4;
  setAnimationState('hit', 0.1);
  return true;
}

function moveLane(direction) {
  const nextIndex = clamp(laneSystem.targetIndex + direction, 0, 2);
  if (nextIndex === laneSystem.targetIndex) {
    return false;
  }
  laneSystem.currentIndex = nextIndex;
  laneSystem.targetIndex = nextIndex;
  laneSystem.fromFloat = laneSystem.currentFloat;
  laneSystem.moveProgress = 0;
  spawnDustBurst(1.25);
  return true;
}

function moveLeft() {
  return moveLane(-1);
}

function moveRight() {
  return moveLane(1);
}

function isSliding() {
  return player.pose === 'slide' && player.poseTimerMs > 0;
}

function isJumping() {
  return !player.onGround;
}

// English learning system checks if player used the right action for current word.
function handleLearningAction(action) {
  if (!learning.current || game.gameOver) {
    return;
  }
  if (action === learning.current.action) {
    setFeedback(Math.random() < 0.5 ? 'Great!' : 'Excellent!');
    playTinyTone(true);
    game.score += learning.bonusScore;
    learning.current = null;
    learning.timerMs = 0;
    learning.nextTimerMs = randomBetween(900, 1800);
  } else {
    setFeedback('Try Again!');
    playTinyTone(false);
    game.score = Math.max(0, game.score - 1);
  }
}

function performAction(action) {
  let worked = false;
  const wasCorrectLearningAction = Boolean(learning.current && action === learning.current.action);
  if (action === 'jump') {
    worked = jump();
  } else if (action === 'slide') {
    worked = slide();
  } else if (action === 'left') {
    worked = moveLane(-1);
  } else if (action === 'right') {
    worked = moveLane(1);
  } else if (action === 'fight') {
    worked = fight();
  }

  if (worked) {
    if (action === 'jump' || action === 'slide' || action === 'left' || action === 'right') {
      handleLearningAction(action);
    }
    if (wasCorrectLearningAction) {
      fx.actionBounceMs = 180;
    }
  }
}

function handleKeyControls(e) {
  if (!game.running || game.gameOver || e.repeat) {
    return;
  }
  const now = performance.now();
  if (now < runtime.keyCooldownUntil) {
    return;
  }

  let worked = false;
  switch (e.key) {
    case 'ArrowLeft':
      console.log('LEFT');
      worked = moveLeft();
      if (worked) {
        handleLearningAction('left');
      }
      break;
    case 'ArrowRight':
      console.log('RIGHT');
      worked = moveRight();
      if (worked) {
        handleLearningAction('right');
      }
      break;
    case 'ArrowUp':
      console.log('JUMP');
      worked = jump();
      if (worked) {
        handleLearningAction('jump');
      }
      break;
    case 'ArrowDown':
      console.log('SLIDE');
      worked = slide();
      if (worked) {
        handleLearningAction('slide');
      }
      break;
    default:
      return;
  }

  e.preventDefault();
  runtime.keyCooldownUntil = now + 100;
}

function setupKeyboardControls() {
  if (runtime.keyControlsBound) {
    return;
  }
  runtime.keyControlsBound = true;
  window.addEventListener('keydown', handleKeyControls);
}

function setupTouchControls() {
  if (runtime.touchBound) {
    return;
  }
  runtime.touchBound = true;
  const inputSurface = threeState.renderer?.domElement || canvas;
  const onTouchStart = (event) => {
    const touchPoint = event.changedTouches[0];
    if (!touchPoint) {
      return;
    }
    diagnostics.startX = touchPoint.clientX;
    diagnostics.startY = touchPoint.clientY;
    diagnostics.pressMoved = false;
    diagnostics.longPressTriggered = false;
    clearLongPressTimer();
    diagnostics.longPressTimer = window.setTimeout(() => {
      if (touch.active && !diagnostics.pressMoved) {
        diagnostics.longPressTriggered = true;
        toggleDiagnosticsOverlay();
      }
    }, 2000);
    touch.startX = touchPoint.clientX;
    touch.startY = touchPoint.clientY;
    touch.startTime = performance.now();
    touch.active = true;
  };

  const onTouchMove = (event) => {
    if (!touch.active) {
      return;
    }
    const touchPoint = event.changedTouches[0];
    if (!touchPoint) {
      return;
    }
    const movedX = Math.abs(touchPoint.clientX - diagnostics.startX);
    const movedY = Math.abs(touchPoint.clientY - diagnostics.startY);
    if (movedX > 12 || movedY > 12) {
      diagnostics.pressMoved = true;
      clearLongPressTimer();
    }
  };

  const onTouchEnd = (event) => {
    if (!touch.active) {
      touch.active = false;
      clearLongPressTimer();
      return;
    }
    const touchPoint = event.changedTouches[0];
    if (!touchPoint) {
      touch.active = false;
      clearLongPressTimer();
      return;
    }
    clearLongPressTimer();
    if (diagnostics.longPressTriggered) {
      diagnostics.longPressTriggered = false;
      touch.active = false;
      return;
    }

    const dx = touchPoint.clientX - touch.startX;
    const dy = touchPoint.clientY - touch.startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const elapsed = performance.now() - touch.startTime;
    let consumedBySecret = false;

    if (absX < 14 && absY < 14 && elapsed <= touch.maxTapDurationMs) {
      consumedBySecret = registerTripleTap(performance.now());
    }

    if (consumedBySecret) {
      touch.active = false;
      return;
    }
    if (!game.running || game.gameOver) {
      touch.active = false;
      return;
    }

    if (absX > absY && absX >= touch.minSwipeDistance) {
      performAction(dx > 0 ? 'right' : 'left');
    } else if (absY >= touch.minSwipeDistance) {
      performAction(dy > 0 ? 'slide' : 'jump');
    } else if (elapsed <= touch.maxTapDurationMs) {
      // Quick tap triggers fight action.
      performAction('fight');
    }
    touch.active = false;
  };

  inputSurface.addEventListener('touchstart', onTouchStart, { passive: true });
  inputSurface.addEventListener('touchmove', onTouchMove, { passive: true });
  inputSurface.addEventListener('touchend', onTouchEnd, { passive: true });
  inputSurface.addEventListener('touchcancel', () => {
    touch.active = false;
    diagnostics.longPressTriggered = false;
    clearLongPressTimer();
  }, { passive: true });
}

function spawnTraffic() {
  const roll = Math.random();
  const type = roll < 0.28
    ? 'rolling_log'
    : roll < 0.5
      ? 'low_branch'
      : roll < 0.73
        ? 'spikes'
        : 'fire';
  const requiresAction = true;
  let laneIndex = Math.floor(Math.random() * perspectiveRoad.laneCount);
  let attempts = 0;
  while (attempts < 4) {
    const laneGap = game.elapsedMs - traffic.lastSpawnMsByLane[laneIndex];
    if (!requiresAction || laneGap >= traffic.laneCooldownMs) {
      break;
    }
    laneIndex = Math.floor(Math.random() * perspectiveRoad.laneCount);
    attempts += 1;
  }
  traffic.lastSpawnMsByLane[laneIndex] = game.elapsedMs;
  traffic.items.push({
    id: traffic.nextId++,
    type,
    laneIndex,
    depth: randomBetween(0.03, 0.1),
    wobbleSeed: Math.random() * Math.PI * 2,
    wobbleAmp: randomBetween(0.4, 1.8),
    hintShown: false,
    passed: false
  });
}

function spawnPowerItem() {
  const laneIndex = Math.floor(Math.random() * perspectiveRoad.laneCount);
  power.items.push({
    id: power.nextId++,
    laneIndex,
    depth: randomBetween(0.05, 0.2),
    size: 18
  });
}

function spawnSideEnvironment() {
  sideEnvironment.items.push({
    id: sideEnvironment.nextId++,
    type: 'tree',
    side: Math.random() < 0.5 ? -1 : 1,
    depth: randomBetween(0.02, 0.2),
    swaySeed: Math.random() * Math.PI * 2,
    scale: randomBetween(0.75, 1.45),
    yaw: randomBetween(-0.45, 0.45)
  });
}

function depthToY(depth) {
  const curvedDepth = Math.pow(clamp(depth, 0, 1), 1.45);
  return perspectiveRoad.horizonY + curvedDepth * (perspectiveRoad.bottomY - perspectiveRoad.horizonY);
}

function depthToRoadWidth(depth) {
  return perspectiveRoad.topWidth + clamp(depth, 0, 1) * (perspectiveRoad.bottomWidth - perspectiveRoad.topWidth);
}

function getRoadEdgesAtDepth(depth) {
  const y = depthToY(depth);
  const width = depthToRoadWidth(depth);
  const centerX = canvas.width * 0.5;
  return {
    y,
    left: centerX - width * 0.5,
    right: centerX + width * 0.5,
    width
  };
}

function laneCenterAtDepth(laneIndex, depth) {
  const edges = getRoadEdgesAtDepth(depth);
  const laneWidth = edges.width / perspectiveRoad.laneCount;
  return edges.left + laneWidth * (laneIndex + 0.5);
}

function getPlayerDepth() {
  return 0.94;
}

function getPlayerCenterX() {
  const laneFloat = laneSystem.currentFloat;
  const lowLane = Math.floor(clamp(laneFloat, 0, 2));
  const highLane = Math.min(2, lowLane + 1);
  const blend = laneFloat - lowLane;
  const xLow = laneCenterAtDepth(lowLane, getPlayerDepth());
  const xHigh = laneCenterAtDepth(highLane, getPlayerDepth());
  return xLow + (xHigh - xLow) * blend;
}

function getPlayerTopY() {
  const roadY = depthToY(getPlayerDepth());
  return roadY - 98 * calibration.playerScale + player.yOffset - (power.active ? power.flyLift * calibration.playerScale : 0);
}

function getPlayerHitbox() {
  const topY = getPlayerTopY();
  const centerX = getPlayerCenterX();
  const s = calibration.playerScale;
  if (isSliding()) {
    return {
      x: centerX - 20 * s,
      y: topY + 34 * s,
      width: 40 * s,
      height: 32 * s
    };
  }
  return {
    x: centerX - 20 * s,
    y: topY + 8 * s,
    width: 40 * s,
    height: 58 * s
  };
}

function rectanglesOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function rectanglesNear(a, b, padding) {
  return (
    a.x < b.x + b.width + padding
    && a.x + a.width > b.x - padding
    && a.y < b.y + b.height + padding
    && a.y + a.height > b.y - padding
  );
}

function canAvoidObstacle(type) {
  if (type === 'fire' || type === 'spikes') {
    return isJumping();
  }
  if (type === 'low_branch') {
    return isSliding();
  }
  return false;
}

function updateLearning(dtMs) {
  if (learning.current) {
    learning.timerMs -= dtMs;
    setInstruction(learning.current.word);
    setLearningCommandOverlay(learning.current.word);
    if (learning.timerMs <= 0) {
      setFeedback('Try Again!');
      playTinyTone(false);
      game.score = Math.max(0, game.score - learning.penaltyScore);
      learning.current = null;
      learning.nextTimerMs = randomBetween(900, 1800);
      setLearningCommandOverlay('');
    }
  } else {
    learning.nextTimerMs -= dtMs;
    setInstruction('Swipe to Dodge');
    setLearningCommandOverlay('');
    if (learning.nextTimerMs <= 0) {
      const nextCommand = learning.commands[Math.floor(Math.random() * learning.commands.length)];
      learning.current = nextCommand;
      learning.timerMs = randomBetween(learning.minDurationMs, learning.maxDurationMs);
      setLearningCommandOverlay(nextCommand.word);
    }
  }
}

function updatePlayer(dtSeconds, dtMs) {
  if (!player.onGround) {
    const frameScale = dtMs / 16.6667;
    player.velocityY -= 0.02 * frameScale;
    player.yOffset += player.velocityY * frameScale;
    player.yOffset = Math.min(2.5, player.yOffset);
    if (player.velocityY < 0) {
      player.pose = 'fall';
    }
    if (player.yOffset <= 0) {
      player.yOffset = THREE.MathUtils.lerp(player.yOffset, 0, 0.3);
      if (player.yOffset <= 0.02) {
        player.yOffset = 0;
      }
      player.velocityY = 0;
      player.onGround = true;
      fx.landingBounceMs = 150;
      player.landingSquashUntil = performance.now() + 80;
      if (player.pose !== 'slide' && player.pose !== 'fight') {
        player.pose = 'idle';
      }
      if (player.pose !== 'slide' && player.pose !== 'fight') {
        setAnimationState('run', 0.18);
      }
    }
  }

  if (player.poseTimerMs > 0) {
    player.poseTimerMs -= dtMs;
    if (player.poseTimerMs <= 0 && player.onGround) {
      player.pose = 'idle';
      player.poseTimerMs = 0;
      setAnimationState('run', 0.15);
    }
  }

  if (laneSystem.moveProgress < 1) {
    laneSystem.moveProgress = Math.min(1, laneSystem.moveProgress + dtSeconds / laneSystem.moveDuration);
    const eased = easeOutCubic(laneSystem.moveProgress);
    laneSystem.currentFloat = laneSystem.fromFloat + (laneSystem.targetIndex - laneSystem.fromFloat) * eased;
  } else {
    laneSystem.currentFloat = laneSystem.targetIndex;
  }

  if (player.onGround && player.pose === 'idle') {
    player.runCycle += dtSeconds * 10;
    fx.dustSpawnMs -= dtMs;
    if (fx.dustSpawnMs <= 0) {
      spawnDustBurst(0.65);
      fx.dustSpawnMs = randomBetween(65, 115);
    }
  }
  if (!game.gameOver && player.onGround && player.pose === 'idle') {
    setAnimationState('run', 0.1);
  }

  if (fx.powerPulseMs > 0) {
    fx.powerPulseMs = Math.max(0, fx.powerPulseMs - dtMs);
  }
  if (fx.actionBounceMs > 0) {
    fx.actionBounceMs = Math.max(0, fx.actionBounceMs - dtMs);
  }
  if (fx.landingBounceMs > 0) {
    fx.landingBounceMs = Math.max(0, fx.landingBounceMs - dtMs);
  }
  if (fx.screenShakeMs > 0) {
    fx.screenShakeMs = Math.max(0, fx.screenShakeMs - dtMs);
  }
  if (fx.startZoomMs > 0) {
    fx.startZoomMs = Math.max(0, fx.startZoomMs - dtMs);
  }
  if (fx.fightPopMs > 0) {
    fx.fightPopMs = Math.max(0, fx.fightPopMs - dtMs);
  }
  if (fx.fightSparkMs > 0) {
    fx.fightSparkMs = Math.max(0, fx.fightSparkMs - dtMs);
  }
  if (fx.pickupPopMs > 0) {
    fx.pickupPopMs = Math.max(0, fx.pickupPopMs - dtMs);
  }
  if (fx.gameOverDramaMs > 0) {
    fx.gameOverDramaMs = Math.max(0, fx.gameOverDramaMs - dtMs);
    fx.gameOverFade = clamp(1 - fx.gameOverDramaMs / 260, 0, 1);
  }

  for (let i = fx.dustParticles.length - 1; i >= 0; i -= 1) {
    const p = fx.dustParticles[i];
    p.lifeMs -= dtMs;
    p.x += p.vx * dtSeconds;
    p.y += p.vy * dtSeconds;
    p.vy += 95 * dtSeconds;
    p.size *= 0.992;
    if (p.lifeMs <= 0 || p.size < 0.4) {
      fx.dustParticles.splice(i, 1);
    }
  }
}

// Road + traffic logic runs inside the same game loop (no extra loops).
function updateWorld(dtSeconds, dtMs) {
  let baseSpeed = 220;
  if (game.score < 220) {
    baseSpeed = 220 + game.score * 0.08;
  } else if (game.score < 900) {
    baseSpeed = 237.6 + (game.score - 220) * 0.16;
  } else {
    baseSpeed = 346.4 + Math.min(85, (game.score - 900) * 0.07);
  }
  const boostFactor = game.slideBoostMs > 0 ? game.slideBoostMs / 180 : 0;
  game.speed = (baseSpeed + boostFactor * 28) * calibration.motionScale;
  game.slideBoostMs = Math.max(0, game.slideBoostMs - dtMs);

  game.roadOffset = (game.roadOffset + game.speed * dtSeconds * 0.6) % 52;
  game.sideOffset = (game.sideOffset + game.speed * dtSeconds * 0.28) % 80;

  const density = clamp((baseSpeed - 220) / 210, 0, 1);
  traffic.minSpawnMs = 900 - density * 340;
  traffic.maxSpawnMs = 1600 - density * 520;

  traffic.spawnTimerMs -= dtMs;
  if (traffic.spawnTimerMs <= 0) {
    spawnTraffic();
    traffic.spawnTimerMs = randomBetween(traffic.minSpawnMs, traffic.maxSpawnMs);
  }

  sideEnvironment.spawnTimerMs -= dtMs;
  if (sideEnvironment.spawnTimerMs <= 0) {
    spawnSideEnvironment();
    sideEnvironment.spawnTimerMs = randomBetween(sideEnvironment.minSpawnMs, sideEnvironment.maxSpawnMs);
  }

  power.spawnTimerMs -= dtMs;
  if (power.spawnTimerMs <= 0) {
    spawnPowerItem();
    power.spawnTimerMs = randomBetween(power.minSpawnMs, power.maxSpawnMs);
  }

  const playerBox = getPlayerHitbox();
  const playerLaneNear = Math.round(laneSystem.currentFloat);
  const playerWorldX = threeState.playerRoot ? threeState.playerRoot.position.x : (laneSystem.currentFloat - 1) * LANE_WORLD_X;
  const playerWorldY = threeState.playerRoot ? threeState.playerRoot.position.y : ROAD_SURFACE_Y + Math.min(2.5, Math.max(0, player.yOffset));
  const playerWorldZ = threeState.playerRoot ? threeState.playerRoot.position.z : 0;
  const timeSinceJump = performance.now() - player.jumpStartTime;
  const canCollide = player.onGround || timeSinceJump > 120;

  for (let i = traffic.items.length - 1; i >= 0; i -= 1) {
    const item = traffic.items[i];
    // Depth-based movement: near objects move faster to mimic camera motion.
    const depthVelocity = (0.22 + item.depth * 1.6) * (game.speed / 250);
    item.depth += dtSeconds * depthVelocity;

    const depth = item.depth;
    const centerX = laneCenterAtDepth(item.laneIndex, depth)
      + Math.sin(performance.now() * 0.002 + item.wobbleSeed) * item.wobbleAmp * depth * 8;
    const scale = depthScale(depth);
    let width = 64 * scale;
    let height = 56 * scale;
    if (item.type === 'low_branch') {
      width = 102 * scale;
      height = 30 * scale;
    } else if (item.type === 'fire') {
      width = 60 * scale;
      height = 45 * scale;
    } else if (item.type === 'spikes') {
      width = 86 * scale;
      height = 34 * scale;
    } else if (item.type === 'rolling_log') {
      width = 90 * scale;
      height = 44 * scale;
    }
    const yBottom = depthToY(depth);
    const box = { x: centerX - width / 2, y: yBottom - height, width, height };
    const nearEnough = depth > 0.78;
    const sameLane = Math.abs(item.laneIndex - playerLaneNear) <= 0;
    const collided = rectanglesOverlap(playerBox, box);
    const almostCollided = rectanglesNear(playerBox, box, 14 * calibration.playerScale);

    if (!item.hintShown && sameLane && nearEnough) {
      if (item.type === 'fire') {
        setFeedback('Jump!');
      } else if (item.type === 'spikes') {
        setFeedback('Jump!');
      } else if (item.type === 'low_branch') {
        setFeedback('Slide!');
      } else if (item.type === 'rolling_log') {
        setFeedback('Move Lane!');
      }
      item.hintShown = true;
    }

    const requiresAction = item.type === 'spikes' || item.type === 'low_branch' || item.type === 'fire';
    if (!item.nearMissAwarded && !collided && almostCollided && depth > 0.9 && (sameLane || requiresAction)) {
      item.nearMissAwarded = true;
      triggerNearMissFeedback(5);
    }

    const obstacleMesh = threeState.obstacleMeshes[i];
    if (obstacleMesh) {
      obstacleMesh.userData.type = item.type === 'low_branch' ? 'high' : 'ground';
    }
    const obstacleLane = obstacleMesh ? obstacleMesh.position.x / LANE_WORLD_X : item.laneIndex - 1;
    const obstacleZ = obstacleMesh ? obstacleMesh.position.z : clamp(-50 + item.depth * 52 * 0.9, -50, 2);
    const playerLane = playerWorldX / LANE_WORLD_X;
    const laneMatch = Math.abs(playerLane - obstacleLane) < 0.5;
    const zClose = Math.abs(obstacleZ - playerWorldZ) < 0.8;
    const isJumpingHigh = playerWorldY > 1.8;
    let hitIn3D = false;
    if (canCollide && laneMatch && zClose) {
      if (obstacleMesh?.userData.type === 'high') {
        hitIn3D = !isSliding();
      } else if ((obstacleMesh?.userData.type || 'ground') === 'ground') {
        hitIn3D = !isJumpingHigh;
      } else {
        hitIn3D = !isJumpingHigh;
      }
    }

    if (!power.active && hitIn3D) {
      endGame();
      return;
    }

    if (obstacleZ > 2 || item.depth > 1.15) {
      traffic.items.splice(i, 1);
      if (!item.passed) {
        item.passed = true;
        game.score += 2;
        if (requiresAction && (item.nearMissAwarded || item.hintShown)) {
          addComboSuccess();
        } else {
          game.combo = 0;
          game.comboTimerMs = 0;
        }
      }
    }
  }

  for (let i = power.items.length - 1; i >= 0; i -= 1) {
    const item = power.items[i];
    item.depth += dtSeconds * (0.2 + item.depth * 1.35) * (game.speed / 260);
    const centerX = laneCenterAtDepth(item.laneIndex, item.depth);
    const scale = 0.25 + item.depth * 1.4;
    const size = item.size * scale;
    const y = depthToY(item.depth);
    const box = { x: centerX - size, y: y - size, width: size * 2, height: size * 2 };
    if (rectanglesOverlap(playerBox, box)) {
      power.active = true;
      power.timerMs = power.durationMs;
      fx.powerPulseMs = 340;
      fx.pickupPopMs = 240;
      magnetStatus.classList.remove('hidden');
      rewardText.textContent = 'Flying Power!';
      rewardText.classList.remove('hidden');
      showFlashText(rewardText, 'Flying Power!', 520);
      playCollectSound();
      power.items.splice(i, 1);
      continue;
    }
    if (item.depth > 1.12) {
      power.items.splice(i, 1);
    }
  }

  for (let i = sideEnvironment.items.length - 1; i >= 0; i -= 1) {
    const item = sideEnvironment.items[i];
    item.depth += dtSeconds * (0.17 + item.depth * 1.2) * (game.speed / 280);
    if (item.depth > 1.18) {
      sideEnvironment.items.splice(i, 1);
    }
  }

  if (power.active) {
    power.timerMs -= dtMs;
    magnetTime.textContent = `${Math.max(0, power.timerMs / 1000).toFixed(1)}`;
    if (power.timerMs <= 0) {
      power.active = false;
      magnetStatus.classList.add('hidden');
      rewardText.classList.add('hidden');
    }
  }
}

function drawRoad() {
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, '#12271f');
  skyGradient.addColorStop(0.55, '#1a3a2f');
  skyGradient.addColorStop(1, '#0d1f18');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw pseudo-3D road slices (trapezoid perspective).
  for (let i = 0; i < perspectiveRoad.segmentCount; i += 1) {
    const offset = (i / perspectiveRoad.segmentCount + game.roadOffset / 360) % 1;
    const d0 = offset;
    const d1 = clamp(offset + perspectiveRoad.segmentDepthSize, 0, 1);
    const e0 = getRoadEdgesAtDepth(d0);
    const e1 = getRoadEdgesAtDepth(d1);

    ctx.fillStyle = i % 2 === 0 ? '#35362f' : '#2d2e27';
    ctx.beginPath();
    ctx.moveTo(e0.left, e0.y);
    ctx.lineTo(e0.right, e0.y);
    ctx.lineTo(e1.right, e1.y);
    ctx.lineTo(e1.left, e1.y);
    ctx.closePath();
    ctx.fill();

    // Jungle roadside strips.
    ctx.fillStyle = i % 2 === 0 ? '#1d4b34' : '#1a4230';
    ctx.beginPath();
    ctx.moveTo(e0.left, e0.y);
    ctx.lineTo(e0.left - 20, e0.y);
    ctx.lineTo(e1.left - 24, e1.y);
    ctx.lineTo(e1.left, e1.y);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(e0.right, e0.y);
    ctx.lineTo(e0.right + 20, e0.y);
    ctx.lineTo(e1.right + 24, e1.y);
    ctx.lineTo(e1.right, e1.y);
    ctx.closePath();
    ctx.fill();

    // Lane markings with depth and scrolling.
    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(216, 222, 185, 0.78)';
      for (let lane = 1; lane < perspectiveRoad.laneCount; lane += 1) {
        const x0 = e0.left + (e0.width / perspectiveRoad.laneCount) * lane;
        const x1 = e1.left + (e1.width / perspectiveRoad.laneCount) * lane;
        ctx.beginPath();
        ctx.moveTo(x0 - 2, e0.y);
        ctx.lineTo(x0 + 2, e0.y);
        ctx.lineTo(x1 + 2, e1.y);
        ctx.lineTo(x1 - 2, e1.y);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  // Side environment with parallax depth.
  for (const item of sideEnvironment.items) {
    const edge = getRoadEdgesAtDepth(item.depth);
    const scale = 0.3 + item.depth * 1.25;
    const sway = Math.sin(performance.now() * 0.002 + item.swaySeed) * 3 * item.depth;
    const x = item.side < 0 ? edge.left - 30 - 20 * scale + sway : edge.right + 30 + 20 * scale + sway;
    const y = depthToY(item.depth);

    ctx.fillStyle = '#3a2d1f';
    ctx.fillRect(x - 5 * scale, y - 44 * scale, 10 * scale, 44 * scale);
    ctx.fillStyle = '#24563d';
    ctx.beginPath();
    ctx.arc(x, y - 54 * scale, 21 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2f6a4b';
    ctx.beginPath();
    ctx.arc(x - 12 * scale, y - 48 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 12 * scale, y - 46 * scale, 11 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Jungle fog / danger darkness.
  const fog = ctx.createLinearGradient(0, 0, 0, canvas.height);
  fog.addColorStop(0, 'rgba(5, 14, 10, 0.08)');
  fog.addColorStop(0.65, 'rgba(8, 18, 12, 0.2)');
  fog.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
  ctx.fillStyle = fog;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (perspectiveRoad.debug) {
    // Debug lane guides + depth lines.
    ctx.strokeStyle = 'rgba(255, 80, 80, 0.35)';
    ctx.lineWidth = 1;
    for (let lane = 0; lane < perspectiveRoad.laneCount; lane += 1) {
      ctx.beginPath();
      for (let d = 0; d <= 1; d += 0.04) {
        const x = laneCenterAtDepth(lane, d);
        const y = depthToY(d);
        if (d === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(70, 170, 255, 0.35)';
    for (let d = 0.1; d < 1; d += 0.1) {
      const edges = getRoadEdgesAtDepth(d);
      ctx.beginPath();
      ctx.moveTo(edges.left, edges.y);
      ctx.lineTo(edges.right, edges.y);
      ctx.stroke();
    }
  }
}

function drawTraffic() {
  for (const item of traffic.items) {
    const centerX = laneCenterAtDepth(item.laneIndex, item.depth)
      + (perf.lowEffects ? 0 : Math.sin(performance.now() * 0.002 + item.wobbleSeed) * item.wobbleAmp * item.depth * 8);
    const scale = depthScale(item.depth);
    const yBottom = depthToY(item.depth);
    if (item.depth > 0.56 && item.depth < 0.9) {
      const warnAlpha = clamp((item.depth - 0.56) / 0.34, 0, 1) * 0.24;
      ctx.fillStyle = item.type === 'fire'
        ? `rgba(255, 74, 54, ${warnAlpha})`
        : `rgba(0, 0, 0, ${warnAlpha})`;
      const shadowWidth = (26 + scale * 36) * (item.type === 'rolling_log' ? 1.2 : 1);
      const shadowHeight = 5 + scale * 7;
      ctx.beginPath();
      ctx.ellipse(centerX, yBottom + 1.5 * scale, shadowWidth, shadowHeight, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (item.type === 'spikes') {
      ctx.fillStyle = '#8f9293';
      const baseY = yBottom;
      for (let i = -2; i <= 2; i += 1) {
        const sx = centerX + i * 16 * scale;
        ctx.beginPath();
        ctx.moveTo(sx, baseY - 30 * scale);
        ctx.lineTo(sx + 9 * scale, baseY);
        ctx.lineTo(sx - 9 * scale, baseY);
        ctx.closePath();
        ctx.fill();
      }
      continue;
    }
    if (item.type === 'low_branch') {
      ctx.fillStyle = '#4f3823';
      ctx.fillRect(centerX - 50 * scale, yBottom - 34 * scale, 100 * scale, 13 * scale);
      ctx.fillStyle = '#2e5b34';
      ctx.beginPath();
      ctx.arc(centerX - 38 * scale, yBottom - 34 * scale, 9 * scale, 0, Math.PI * 2);
      ctx.arc(centerX + 34 * scale, yBottom - 34 * scale, 10 * scale, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    if (item.type === 'fire') {
      ctx.fillStyle = 'rgba(255, 78, 30, 0.28)';
      ctx.beginPath();
      ctx.arc(centerX, yBottom - 14 * scale, 28 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff6d46';
      ctx.beginPath();
      ctx.moveTo(centerX, yBottom - 52 * scale);
      ctx.lineTo(centerX + 28 * scale, yBottom);
      ctx.lineTo(centerX - 28 * scale, yBottom);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffd45d';
      ctx.beginPath();
      ctx.arc(centerX, yBottom - 8 * scale, 10 * scale, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    // Rolling log
    ctx.fillStyle = '#6a472a';
    ctx.beginPath();
    ctx.ellipse(centerX, yBottom - 18 * scale, 46 * scale, 18 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4f341d';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.arc(centerX - 18 * scale, yBottom - 18 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.arc(centerX + 15 * scale, yBottom - 18 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#7f5a35';
    ctx.beginPath();
    ctx.ellipse(centerX, yBottom - 18 * scale, 34 * scale, 12 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPowerItems() {
  for (const item of power.items) {
    const cx = laneCenterAtDepth(item.laneIndex, item.depth);
    const cy = depthToY(item.depth) - 26 * (0.28 + item.depth * 1.3);
    const scale = 0.3 + Math.pow(clamp(item.depth, 0, 1), 1.1) * 1.4;
    ctx.fillStyle = '#ffd64e';
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const radius = (i % 2 === 0 ? item.size : item.size * 0.46) * scale;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }
}

function drawDustParticles() {
  if (fx.dustParticles.length === 0) {
    return;
  }
  for (const p of fx.dustParticles) {
    const alpha = clamp(p.lifeMs / p.maxLifeMs, 0, 1) * 0.42;
    ctx.fillStyle = `rgba(126, 108, 84, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRunner() {
  const selected = getSelectedCharacter();
  const cx = getPlayerCenterX();
  const topY = getPlayerTopY();
  const s = calibration.playerScale;
  const fightActive = player.pose === 'fight' && player.poseTimerMs > 0;
  const fightDurationMs = 200;
  const fightProgress = fightActive ? clamp(1 - player.poseTimerMs / fightDurationMs, 0, 1) : 0;
  const punchForward = fightProgress < 0.4
    ? fightProgress / 0.4
    : 1 - (fightProgress - 0.4) / 0.6;
  const bodyTilt = ((player.pose === 'slide' ? 7 : 0) + (fightActive ? 6 * punchForward : 0)) * s;
  const torsoX = cx + (fightActive ? 6 * punchForward * s : 0);
  const running = player.onGround && !isSliding() && !fightActive;
  const runPhaseSpeed = clamp(game.speed / 250, 0.8, 1.8);
  const stride = Math.sin(player.runCycle * runPhaseSpeed) * (running ? 7 : 0);
  const torsoBob = running ? Math.abs(Math.sin(player.runCycle * runPhaseSpeed)) * 2.5 * s : 0;
  const bounceProgress = 1 - fx.actionBounceMs / 180;
  const actionScale = fx.actionBounceMs > 0 && !perf.lowEffects ? 1 + Math.sin(clamp(bounceProgress, 0, 1) * Math.PI) * 0.06 : 1;
  const fightPopProgress = 1 - fx.fightPopMs / 200;
  const fightPopScale = fx.fightPopMs > 0 && !perf.lowEffects ? 1 + Math.sin(clamp(fightPopProgress, 0, 1) * Math.PI) * 0.08 : 1;
  const cameraScale = 1.1 * actionScale * fightPopScale;

  ctx.save();
  ctx.translate(cx, topY + 34);
  ctx.scale(cameraScale, cameraScale);
  ctx.translate(-cx, -(topY + 34));

  if (power.active) {
    const powerPulse = perf.lowEffects ? 1 : (fx.powerPulseMs > 0 ? 1 + (fx.powerPulseMs / 340) * 0.4 : 1);
    ctx.fillStyle = 'rgba(255, 244, 133, 0.35)';
    ctx.beginPath();
    ctx.arc(cx, topY + 24 * s, (34 + Math.sin(performance.now() * 0.01) * 3) * s * powerPulse, 0, Math.PI * 2);
    ctx.fill();
  }

  // Human-like runner body (head, torso, limbs) with simple state changes.
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.beginPath();
  ctx.ellipse(cx, topY + 82 * s, 20 * s, 6 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f6cfb2';
  ctx.beginPath();
  const skinTone = selected.skin || '#c79c7f';
  ctx.fillStyle = skinTone;
  ctx.arc(torsoX, topY + 14 * s + bodyTilt - torsoBob, 12 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = selected.hair;
  ctx.beginPath();
  ctx.arc(torsoX, topY + 9 * s + bodyTilt - torsoBob, 11 * s, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = selected.shirt;
  ctx.fillRect(torsoX - 12 * s, topY + 24 * s + bodyTilt - torsoBob, 24 * s, 24 * s);

  ctx.strokeStyle = skinTone;
  ctx.lineWidth = 5 * s;
  ctx.lineCap = 'round';
  const punchReach = fightActive ? (22 + 26 * punchForward) * s : (player.pose === 'fall' ? 18 : 22) * s;
  const punchLift = fightActive ? 10 * punchForward * s : 0;
  ctx.beginPath();
  ctx.moveTo(torsoX - 10 * s, topY + 32 * s + bodyTilt - torsoBob);
  ctx.lineTo(torsoX - 20 * s, topY + (46 - 3 * punchForward - stride * 0.35) * s + bodyTilt - torsoBob);
  ctx.moveTo(torsoX + 10 * s, topY + 32 * s + bodyTilt - torsoBob);
  ctx.lineTo(torsoX + punchReach, topY + (46 + stride * 0.35) * s + bodyTilt - punchLift - torsoBob);
  ctx.stroke();

  ctx.fillStyle = selected.pants;
  if (isSliding()) {
    ctx.fillRect(torsoX - 12 * s, topY + 47 * s, 24 * s, 12 * s);
  } else {
    ctx.fillRect(torsoX - 12 * s, topY + 47 * s - torsoBob * 0.35, 24 * s, 20 * s);
  }

  ctx.fillStyle = '#2a3647';
  if (isSliding()) {
    ctx.fillRect(torsoX - 13 * s, topY + 58 * s, 26 * s, 7 * s);
  } else {
    const leftStride = stride * s;
    const rightStride = -stride * s;
    ctx.fillRect(torsoX - 11 * s, topY + 60 * s - leftStride * 0.28 - torsoBob * 0.2, 9 * s, 20 * s + leftStride * 0.25);
    ctx.fillRect(torsoX + 2 * s, topY + 60 * s - rightStride * 0.28 - torsoBob * 0.2, 9 * s, 20 * s + rightStride * 0.25);
  }

  if (fightActive && fx.fightSparkMs > 0 && !perf.lowEffects) {
    const sparkX = torsoX + (34 + 20 * punchForward) * s;
    const sparkY = topY + (34 - 8 * punchForward) * s + bodyTilt;
    const sparkAlpha = clamp(fx.fightSparkMs / 90, 0, 1);
    const sparkSize = (5 + 5 * punchForward) * s;
    ctx.save();
    ctx.globalAlpha = sparkAlpha;
    ctx.strokeStyle = '#ffe47b';
    ctx.lineWidth = 2 * s;
    for (let i = 0; i < 5; i += 1) {
      const angle = (i / 5) * Math.PI * 2;
      const inner = sparkSize * 0.35;
      const outer = sparkSize;
      ctx.beginPath();
      ctx.moveTo(sparkX + Math.cos(angle) * inner, sparkY + Math.sin(angle) * inner);
      ctx.lineTo(sparkX + Math.cos(angle) * outer, sparkY + Math.sin(angle) * outer);
      ctx.stroke();
    }
    ctx.fillStyle = '#fff2bd';
    ctx.beginPath();
    ctx.arc(sparkX, sparkY, 2.2 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawLearningCommand() {
  if (!learning.current) {
    return;
  }
  const pulse = 1 + Math.sin(performance.now() * 0.01) * 0.03;
  ctx.save();
  ctx.translate(canvas.width * 0.5, 54);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = 'rgba(255, 94, 132, 0.9)';
  ctx.fillRect(-90, -22, 180, 44);
  ctx.fillStyle = '#fff8d8';
  ctx.font = 'bold 24px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(learning.current.word, 0, 0);
  ctx.restore();
}

function endGame() {
  if (game.gameOver) {
    return;
  }
  game.gameOver = true;
  game.combo = 0;
  game.comboTimerMs = 0;
  comboText?.classList.add('hidden');
  setAnimationState('hit', 0.08);
  fx.gameOverDramaMs = 260;
  fx.gameOverFade = 0;
  fx.gameOverCommitted = false;
  setFeedback('Game Over! Tap Restart.');
  gameScreen.classList.remove('shake-hit');
  void gameScreen.offsetWidth;
  gameScreen.classList.add('shake-hit');
  window.setTimeout(() => gameScreen.classList.remove('shake-hit'), 130);
  playHitSound();
  playGameOverSound();
}

function commitGameOverUI() {
  if (fx.gameOverCommitted) {
    return;
  }
  fx.gameOverCommitted = true;
  game.running = false;
  game.bestScore = Math.max(game.bestScore, Math.floor(game.score));
  game.bestStars = Math.max(game.bestStars, game.stars);
  unlockCharactersByScore();
  saveProgress();
  renderCharacterList();
  showGameOverMessage();
  showRestartButton();
  showAdScreen();
}

function updateGame(dtSeconds, dtMs) {
  if (threeState.playerMixer) {
    threeState.playerMixer.update(dtSeconds);
  }
  updateAudioLayer(dtMs);
  if (game.gameOver && fx.gameOverDramaMs <= 0) {
    commitGameOverUI();
    return;
  }
  if (game.gameOver) {
    // Short cinematic slowdown before showing game-over popup.
    updatePlayer(dtSeconds * 0.24, dtMs * 0.24);
    setAmbienceTarget(0.008);
    return;
  }
  if (game.comboTimerMs > 0) {
    game.comboTimerMs = Math.max(0, game.comboTimerMs - dtMs);
    if (game.comboTimerMs === 0) {
      game.combo = 0;
      comboText?.classList.add('hidden');
    }
  }
  game.elapsedMs += dtMs;
  updatePlayer(dtSeconds, dtMs);
  updateLearning(dtMs);
  updateWorld(dtSeconds, dtMs);
  const multiplier = power.active ? power.scoreMultiplier : 1;
  game.score += dtSeconds * 11 * multiplier;
  game.stars = Math.floor(game.score / 40);
  const speedNorm = clamp((game.speed - 220) / 250, 0, 1);
  if (speedVignette) {
    speedVignette.style.opacity = `${0.06 + speedNorm * 0.34}`;
  }
  setAmbienceTarget(0.014 + speedNorm * 0.01);
  updateHudAnimation(dtSeconds);
}

function drawFallback2D() {
  throw new Error('2D fallback disabled');
}

function gameLoop(timestamp) {
  if (FORCE_VISIBILITY_MODE) {
    if (threeState.camera) {
      threeState.camera.position.set(0, 0, 5);
      threeState.camera.lookAt(0, 0, 0);
    }
    if (threeState.renderer && threeState.scene && threeState.camera) {
      threeState.renderer.render(threeState.scene, threeState.camera);
    }
    game.animationId = requestAnimationFrame(gameLoop);
    return;
  }
  if (!runtime.gameStarted) {
    game.animationId = null;
    return;
  }
  if (runtime.gamePaused) {
    game.animationId = null;
    return;
  }
  if (!game.running) {
    game.animationId = null;
    return;
  }
  if (!game.lastFrameTime) {
    game.lastFrameTime = timestamp;
  }
  const rawDtSeconds = Math.min((timestamp - game.lastFrameTime) / 1000, MAX_DELTA_SECONDS);
  game.smoothedDtSeconds += (rawDtSeconds - game.smoothedDtSeconds) * 0.18;
  const dtSeconds = clamp(game.smoothedDtSeconds, 1 / 144, 1 / 42);
  const dtMs = dtSeconds * 1000;
  game.lastFrameTime = timestamp;
  updatePerformanceProfile(rawDtSeconds, dtMs);
  updateGame(dtSeconds, dtMs);
  const renderer = threeState.renderer;
  const scene = threeState.scene;
  const camera = threeState.camera;
  if (!renderer) {
    throw new Error('RENDERER FAILED');
  }
  if (!scene || !camera) {
    throw new Error('THREE SCENE NOT READY');
  }
  syncThreeScene();
  renderer.render(scene, camera);
  updateDiagnosticsOverlay(timestamp, dtSeconds);
  game.animationId = requestAnimationFrame(gameLoop);
}

function showGameScreen() {
  enableImmersiveMobileMode();
  runtime.gamePaused = false;
  setRendererInputEnabled(true);
  hideAllScreens();
  setRendererVisibility(true);
  hidePauseOverlay();
  startScreen.style.display = 'none';
  gameScreen.classList.remove('hidden');
  gameScreen.style.display = 'block';
  animateScreen(gameScreen);
  hideAdScreen();
  resetGameState();
  gameScreen.classList.remove('hud-enter');
  void gameScreen.offsetWidth;
  gameScreen.classList.add('hud-enter');
  if (pauseButton) {
    pauseButton.textContent = 'Pause';
  }
  hideGameOverMessage();
  startGameLoop();
}

function restartGame() {
  runtime.gameStarted = true;
  runtime.gamePaused = false;
  setRendererInputEnabled(true);
  hidePauseOverlay();
  resetGameState();
  gameScreen.classList.remove('hud-enter');
  void gameScreen.offsetWidth;
  gameScreen.classList.add('hud-enter');
  if (pauseButton) {
    pauseButton.textContent = 'Pause';
  }
  startGameLoop();
}

function togglePause() {
  if (!runtime.gameStarted) {
    return;
  }
  if (game.gameOver) {
    return;
  }
  runtime.gamePaused = !runtime.gamePaused;
  if (runtime.gamePaused) {
    game.running = false;
    if (game.animationId !== null) {
      cancelAnimationFrame(game.animationId);
      game.animationId = null;
    }
    setRendererInputEnabled(false);
    showPauseOverlay();
    setFeedback('Paused');
    setAnimationState('idle', 0.2);
    setAmbienceTarget(0.006);
  } else {
    hidePauseOverlay();
    setRendererInputEnabled(true);
    if (pauseButton) {
      pauseButton.textContent = 'Pause';
    }
    setAnimationState('run', 0.18);
    setAmbienceTarget(0.016);
    startGameLoop();
  }
}

function unlockNextCharacterFromAd() {
  const nextLocked = characters.find((character) => !character.unlocked);
  if (!nextLocked) {
    adMessage.textContent = 'All characters are unlocked!';
    return;
  }
  adMessage.textContent = 'Watching ad...';
  watchAdButton.disabled = true;
  window.setTimeout(() => {
    nextLocked.unlocked = true;
    adMessage.textContent = `${nextLocked.name} unlocked!`;
    watchAdButton.disabled = false;
    saveProgress();
    renderCharacterList();
  }, 1100);
}

function startGame() {
  console.log('GAME STARTED');
  runtime.gameStarted = true;
  runtime.gamePaused = false;
  initThreeScene();
  if (!runtime.touchBound) {
    setupTouchControls();
  }
  resizeGameCanvas();
  showGameScreen();
}

function bindPlayButtonAfterDomReady() {
  const playBtn = document.getElementById('play-btn');
  if (!playBtn) {
    return;
  }
  playBtn.onclick = () => {
    console.log('PLAY CLICKED');
    startGame();
  };
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bindPlayButtonAfterDomReady);
} else {
  bindPlayButtonAfterDomReady();
}

openCharactersButton?.addEventListener('click', showCharacterScreen);
openSettingsButton?.addEventListener('click', showSettingsScreen);
backToStartButton?.addEventListener('click', showStartScreen);
settingsBackButton?.addEventListener('click', showStartScreen);
startGameButton?.addEventListener('click', startGame);
homeButton?.addEventListener('click', showStartScreen);
sceneStartButton?.addEventListener('click', enterMainGameFromScene);
restartButton?.addEventListener('click', restartGame);
watchAdButton?.addEventListener('click', unlockNextCharacterFromAd);
closeAdButton?.addEventListener('click', hideAdScreen);
pauseButton?.addEventListener('click', togglePause);
pauseResumeButton?.addEventListener('click', togglePause);
pauseRestartButton?.addEventListener('click', restartGame);
pauseHomeButton?.addEventListener('click', returnHomeFromPause);
toggleSoundButton?.addEventListener('click', toggleSoundSetting);
toggleMusicButton?.addEventListener('click', toggleMusicSetting);
toggleGraphicsButton?.addEventListener('click', toggleGraphicsSetting);

async function bootstrapGame() {
  loadProgress();
  setupNpcInteractions();
  setupZoomPreventionGuards();
  setupKeyboardControls();
  await ensureThreeRuntime();
  resizeGameCanvas();
  window.addEventListener('resize', resizeGameCanvas);
  renderCharacterList();
  selectedCharacterName.textContent = getSelectedCharacter().name;
  resetGameState();
  showStartScreen();
  mainApp.classList.add('hidden');
  runIntroSequence();
}

bootstrapGame();
