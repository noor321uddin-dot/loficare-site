// @ts-nocheck
/* The hero globe: a small world you drag, and a doctor who runs to stay on top of it. Plain three.js port of
   the Orbit Delivery hero motion (21st.dev), with the React and react-three-fiber layer removed so the site stays
   framework-free. Loaded lazily by HeroGlobe.astro. Models in /public/models: world.glb (Orbit Delivery asset,
   licence unconfirmed) and doctor.glb (Quaternius Doctor_Male_Young, CC0; see models-src/README.md).
   Pause and the doctor turns to the viewer and plays his Victory cheer. */
import {
  AmbientLight, AnimationClip, Box3, CylinderGeometry, DoubleSide, TorusGeometry, AnimationMixer, Bone, DirectionalLight, Euler, FrontSide, Group, HemisphereLight,
  LoopRepeat, MathUtils, Matrix4, Mesh, MeshStandardMaterial, NumberKeyframeTrack, OrthographicCamera, Quaternion,
  QuaternionKeyframeTrack, Scene, SkinnedMesh, Texture, Vector3, VectorKeyframeTrack, WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const damp = (v, t, l, dt) => v + (t - v) * (1 - Math.exp(-l * dt));
const smoothstep = (v, a, b) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const GAIT = 0.44;
const UP = new Vector3(0, 1, 0);

/* ---------- motion ---------- */
const createMotion = () => ({ planetAngle: 0, planetVelocity: 0, dragTarget: 0, characterTarget: 0, characterAngle: 0, characterVelocity: 0, phase: 0, activity: 0, direction: 1, time: 0, dragging: false, lastInteraction: 0, pitchAngle: 0, pitchVelocity: 0, pitchTarget: 0, heading: 0, cameraHeading: 0 });
function stepPlanet(m, dt, auto, reduced, autoRoll) {
  m.time += dt;
  if (!auto) { m.dragging = false; m.planetVelocity = m.pitchVelocity = 0; m.dragTarget = m.planetAngle; m.pitchTarget = m.pitchAngle; return; }
  if (m.dragging) m.planetVelocity += (90 * (m.dragTarget - m.planetAngle) - 18 * m.planetVelocity) * dt;
  else m.planetVelocity = damp(m.planetVelocity, !reduced && m.time - m.lastInteraction > 3.5 ? autoRoll : 0, reduced ? 12 : 5, dt);
  m.planetVelocity = clamp(m.planetVelocity, -1.15, 1.15);
  m.planetAngle += m.planetVelocity * dt;
}
const createGlobe = () => ({ delta: new Quaternion(), orientation: new Quaternion().setFromEuler(new Euler(0.1, 0.5, 0)), angular: new Vector3(), route: 0 });
function stepGlobe(g, m, dt, auto, reduced) {
  const roaming = auto && !reduced && !m.dragging && m.time - m.lastInteraction > 3.5;
  if (roaming) g.route += 0.24 * dt;
  stepPlanet(m, dt, auto, reduced, -0.24 * Math.cos(g.route));
  if (!auto) { g.angular.set(0, 0, 0); return; }
  if (m.dragging) m.pitchVelocity += (70 * (m.pitchTarget - m.pitchAngle) - 17 * m.pitchVelocity) * dt;
  else m.pitchVelocity = MathUtils.damp(m.pitchVelocity, roaming ? 0.24 * Math.sin(g.route) : 0, 6, dt);
  m.pitchVelocity = clamp(m.pitchVelocity, -0.55, 0.55);
  m.pitchAngle += m.pitchVelocity * dt;
  g.angular.set(m.pitchVelocity, m.planetVelocity * 0.45, -m.planetVelocity);
  const speed = g.angular.length();
  if (speed > 1e-8) { g.delta.setFromAxisAngle(g.angular.multiplyScalar(1 / speed), speed * dt); g.orientation.premultiply(g.delta).normalize(); }
}
const createSurface = () => ({ current: new Vector3(0, 1, 0), target: new Vector3(0, 1, 0), velocity: new Vector3(), error: new Vector3(), worldNormal: new Vector3(), worldVelocity: new Vector3(), inverse: new Quaternion(), init: false });
function stepSurface(s, m, rotation, screenUp, dt, reduced, paused) {
  s.inverse.copy(rotation).invert();
  s.target.copy(screenUp).applyQuaternion(s.inverse).normalize();
  if (!s.init) { s.current.copy(s.target); s.init = true; }
  if (paused) { s.velocity.set(0, 0, 0); s.worldVelocity.set(0, 0, 0); s.worldNormal.copy(s.current).applyQuaternion(rotation); m.characterVelocity = 0; m.activity = MathUtils.damp(m.activity, 0, 10, dt); return; }
  const cos = clamp(s.current.dot(s.target), -1, 1), angle = Math.acos(cos);
  s.error.copy(s.target).addScaledVector(s.current, -cos);
  if (s.error.lengthSq() > 1e-12) s.error.normalize().multiplyScalar(angle);
  const k = reduced ? 110 : 48, c = reduced ? 21 : 11;
  s.velocity.addScaledVector(s.error, k * dt).multiplyScalar(Math.exp(-c * dt));
  s.velocity.addScaledVector(s.current, -s.velocity.dot(s.current));
  s.current.addScaledVector(s.velocity, dt).normalize();
  s.velocity.addScaledVector(s.current, -s.velocity.dot(s.current));
  s.worldNormal.copy(s.current).applyQuaternion(rotation);
  s.worldVelocity.copy(s.velocity).applyQuaternion(rotation);
  const speed = s.velocity.length();
  if (Math.abs(s.worldVelocity.x) > 0.012) m.direction = Math.sign(s.worldVelocity.x);
  m.characterVelocity = speed * m.direction;
  m.activity = MathUtils.damp(m.activity, smoothstep(speed, 4e-3, 0.022), 9, dt);
  m.phase += (speed * 2.25) / GAIT * Math.PI * 2 * dt;
}
function surfaceRadius(sf, x, y, z) {
  const u = (((Math.atan2(x, z) / (2 * Math.PI)) % 1) + 1) % 1 * sf.width;
  const v = (Math.acos(clamp(y, -1, 1)) / Math.PI) * (sf.height - 1);
  const x0 = Math.floor(u) % sf.width, x1 = (x0 + 1) % sf.width, y0 = Math.floor(v), y1 = Math.min(y0 + 1, sf.height - 1);
  const tx = u - Math.floor(u), ty = v - y0, R = sf.radii, W = sf.width;
  const a = R[y0 * W + x0] * (1 - tx) + R[y0 * W + x1] * tx, b = R[y1 * W + x0] * (1 - tx) + R[y1 * W + x1] * tx;
  return a * (1 - ty) + b * ty;
}

/* ---------- character: Quaternius Doctor_Male_Young (CC0), native Idle / Run / Victory clips ---------- */
function dispose(root) {
  root.traverse((n) => {
    if (!(n instanceof Mesh)) return; n.geometry.dispose();
    for (const m of [].concat(n.material)) { for (const v of Object.values(m)) if (v instanceof Texture) v.dispose(); m.dispose(); }
  });
}

/* ---------- mount ---------- */
export async function mountGlobe(stage: HTMLElement, opts: { base?: string; onReady?: () => void; onState?: (moving: boolean) => void } = {}): Promise<any> {
  const { base = '/models/', onReady, onState } = opts;
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = reducedQuery.matches;
  const low = matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency || 4) <= 4;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: low ? 'low-power' : 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, low ? 1.25 : 2));
  renderer.domElement.className = 'globe-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  stage.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 30); camera.position.set(0, 0, 9);
  scene.add(new AmbientLight(0xffffff, 0.9), new HemisphereLight(0xf1fffd, 0x8ac5c0, 1.4));
  const key = new DirectionalLight(0xfff8f1, 2.6); key.position.set(-3, 5, 5); scene.add(key);
  const rim = new DirectionalLight(0xc5fff8, 1.8); rim.position.set(3, 2, -2); scene.add(rim);
  const root = new Group(), planet = new Group(), runner = new Group(), facing = new Group(), lean = new Group(), body = new Group();
  planet.scale.setScalar(2.25); facing.rotation.y = Math.PI / 2; 
  facing.add(lean); lean.add(body); runner.add(facing); root.add(planet, runner); scene.add(root);

  const loader = new GLTFLoader();
  const [world, doc, surface] = await Promise.all([
    loader.loadAsync(base + 'world.glb'), loader.loadAsync(base + 'doctor.glb'), fetch(base + 'world-surface.json').then((r) => r.json()),
  ]);
  world.scene.traverse((n) => { n.updateMatrix(); n.matrixAutoUpdate = false; if (n instanceof Mesh) for (const m of [].concat(n.material)) if (m instanceof MeshStandardMaterial) { m.side = FrontSide; m.metalness = 0; m.roughness = 0.86; m.normalScale.setScalar(0.65); if (m.map) m.map.anisotropy = 4; } });
  planet.add(world.scene);
  /* the source file ships a near-black Skin material and blond Hair; tone them for the audience */
  const tone = { Skin: 0xb5805a, Hair: 0x22160f };
  doc.scene.traverse((n) => { if (!(n instanceof Mesh)) return; if (n instanceof SkinnedMesh) n.frustumCulled = false; for (const m of [].concat(n.material)) if (m instanceof MeshStandardMaterial) { m.metalness = 0; m.roughness = 0.85; if (tone[m.name]) m.color.setHex(tone[m.name]); } });
  const box = new Box3().setFromObject(doc.scene); body.scale.setScalar(1.0 / Math.max(box.max.y - box.min.y, 1e-3));
  body.add(doc.scene);
  const mixer = new AnimationMixer(doc.scene);
  const clip = (name) => doc.animations.find((a) => a.name === name);
  const idle = mixer.clipAction(clip('Idle')).play(), run = mixer.clipAction(clip('Run')).setLoop(LoopRepeat, Infinity).play();
  const cheer = clip('Victory') ? mixer.clipAction(clip('Victory')).setLoop(LoopRepeat, Infinity).play() : null;
  const runPeriod = clip('Run').duration;
  run.setEffectiveWeight(0); cheer?.setEffectiveWeight(0); mixer.update(0);
  let greetW = 0;

  const m = createMotion(), globe = createGlobe(), surf = createSurface();
  const tmp = { up: new Vector3(), lv: new Vector3(), front: new Vector3(), inv: new Quaternion() };
  let radius = 2.2, auto = true, turnVel = 0, greetTurn = false, visible = true, raf = 0, last = 0, running = false, alive = true;

  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false);
    const zoom = w / (w < 520 ? 5.3 : 5.0);
    camera.left = -w / 2 / zoom; camera.right = w / 2 / zoom; camera.top = h / 2 / zoom; camera.bottom = -h / 2 / zoom; camera.updateProjectionMatrix();
    root.position.y = (h / zoom) * (w < 520 ? 0.1 : 0.16) - 2.17;
  };
  const ro = new ResizeObserver(resize); ro.observe(stage); resize();

  const frame = (ts) => {
    if (!running) return;
    const dt = Math.min(last ? (ts - last) / 1000 : 1 / 60, 0.05); last = ts;
    tmp.up.copy(UP).applyQuaternion(camera.quaternion);
    const n = Math.ceil(dt / (1 / 120));
    for (let i = 0; i < n; i++) { stepGlobe(globe, m, dt / n, auto, reduced); stepSurface(surf, m, globe.orientation, tmp.up, dt / n, reduced, !auto); }
    planet.quaternion.copy(globe.orientation);
    const r = surfaceRadius(surface, surf.current.x, surf.current.y, surf.current.z) * 2.25;
    radius = MathUtils.damp(radius, r + 8e-3, 25, dt);
    runner.position.copy(surf.worldNormal).multiplyScalar(radius);
    runner.quaternion.setFromUnitVectors(UP, surf.worldNormal);
    tmp.inv.copy(runner.quaternion).invert();
    tmp.front.set(0, 0, 1).applyQuaternion(camera.quaternion).applyQuaternion(tmp.inv);
    m.cameraHeading = Math.atan2(tmp.front.x, tmp.front.z);
    if (surf.velocity.lengthSq() > 1e-4) { tmp.lv.copy(surf.worldVelocity).applyQuaternion(tmp.inv); m.heading = Math.atan2(-tmp.lv.z, tmp.lv.x); }
    /* character: face the way he runs, stop and wave when paused */
    const paused = !auto;
    if (!paused) greetTurn = false; else if (m.activity < 0.06) greetTurn = true;
    const desired = paused ? (greetTurn ? m.cameraHeading : facing.rotation.y) : m.heading + Math.PI / 2;
    const turn = Math.atan2(Math.sin(desired - facing.rotation.y), Math.cos(desired - facing.rotation.y));
    if (paused) { turnVel = clamp(turnVel + clamp(18 * turn - 8.5 * turnVel, -5.5, 5.5) * dt, -2.2, 2.2); if (Math.abs(turn) < 3e-3 && Math.abs(turnVel) < 0.025) turnVel = 0; facing.rotation.y += turnVel * dt; }
    else { const rot = turn * (1 - Math.exp(-12 * dt)); facing.rotation.y += rot; turnVel = rot / dt; }
    const turning = paused && greetTurn && !reduced ? smoothstep(Math.abs(turnVel), 0.08, 1.2) : 0;
    const ready = paused && greetTurn && Math.abs(turn) < 0.055 && Math.abs(turnVel) < 0.13 && !reduced;
    greetW = MathUtils.damp(greetW, ready ? 1 : 0, ready ? 4 : 9, dt);
    lean.rotation.x = MathUtils.damp(lean.rotation.x, Math.min(Math.abs(m.characterVelocity) * 0.065, 0.09) * (reduced ? 0.35 : 1), 9, dt);
    const activity = Math.max(m.activity, turning * 0.3) * (1 - greetW);
    run.setEffectiveWeight(activity); cheer?.setEffectiveWeight(greetW); idle.setEffectiveWeight(Math.max(0, 1 - activity - greetW)); idle.paused = reduced;
    run.setEffectiveTimeScale(MathUtils.damp(run.timeScale, clamp(Math.max((Math.abs(m.characterVelocity) * 2.25) / GAIT * runPeriod, turning * 0.72), 0, 1.6), 10, dt));
    mixer.update(dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!running && alive && visible && !document.hidden) { running = true; last = 0; raf = requestAnimationFrame(frame); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  /* drag, keys */
  let drag = null;
  const release = (id) => { if (drag?.id !== id) return; drag = null; m.dragging = false; m.lastInteraction = m.time; stage.classList.remove('dragging'); };
  stage.addEventListener('pointerdown', (e) => {
    if (!auto || !e.isPrimary || e.button !== 0) return;
    stage.setPointerCapture(e.pointerId); drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
    m.dragTarget = m.planetAngle; m.pitchTarget = m.pitchAngle; m.dragging = true; m.lastInteraction = m.time; stage.classList.add('dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!auto || drag?.id !== e.pointerId) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y, k = 5 / Math.max(360, stage.clientWidth);
    m.dragTarget = clamp(m.dragTarget + dx * k, m.planetAngle - 0.5, m.planetAngle + 0.5);
    m.pitchTarget = clamp(m.pitchTarget + dy * k * 0.7, m.pitchAngle - 0.4, m.pitchAngle + 0.4);
    drag.x = e.clientX; drag.y = e.clientY; m.lastInteraction = m.time;
  });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) stage.addEventListener(t, (e) => release(e.pointerId));
  const nudge = (d) => { if (!auto) return; m.planetVelocity += d * 0.65; m.lastInteraction = m.time; };
  const toggle = () => {
    auto = !auto; m.dragging = false; drag = null; stage.classList.remove('dragging');
    m.planetVelocity = m.pitchVelocity = 0; m.dragTarget = m.planetAngle; m.pitchTarget = m.pitchAngle; if (auto) m.lastInteraction = m.time - 4;
    onState?.(auto);
  };
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); nudge(e.key === 'ArrowRight' ? 1 : -1); }
    if (auto && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); m.pitchVelocity += e.key === 'ArrowDown' ? 0.4 : -0.4; m.lastInteraction = m.time; }
    if (e.key === ' ') { e.preventDefault(); if (!e.repeat) toggle(); }
  });
  reducedQuery.addEventListener('change', () => { reduced = reducedQuery.matches; });
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop(); }, { threshold: 0.01 }); io.observe(stage);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  renderer.render(scene, camera);
  onReady?.();
  start();
  return {
    toggle, nudge,
    destroy() { alive = false; stop(); io.disconnect(); ro.disconnect(); mixer.stopAllAction(); dispose(world.scene); dispose(doc.scene); renderer.dispose(); renderer.domElement.remove(); },
  };
}
