/* The WebGL tier of the hero assembly (decision D3). Loaded lazily on capable desktops only; the SVG tier
   stays the first paint and the fallback. Same geometry as the SVG (the mark's 1000-unit box), rendered with
   an orthographic camera so the assembled state matches the vector mark exactly, with depth only in the flight.
   One InstancedMesh for the seventeen tiles, one for their outlines, one extruded cross, one additive glow
   sprite: five draw calls, no post-processing. */
import {
  WebGLRenderer, Scene, OrthographicCamera, InstancedMesh, MeshStandardMaterial, MeshBasicMaterial, Color, Object3D,
  AmbientLight, DirectionalLight, Group, Sprite, SpriteMaterial, CanvasTexture, AdditiveBlending, Shape, ExtrudeGeometry,
  Mesh, BackSide, Quaternion, Euler, Vector3, MathUtils,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export type TileSpec = { x: number; y: number; rot: number; sx: number; sy: number; srot: number; sscale: number; group: 'ring' | 'l' };
export type PulseGroup = 'ring' | 'l' | 'cross';
export type HeroHandle = {
  setProgress(p: number): void;
  pulse(group: PulseGroup): void;
  setTheme(theme: 'light' | 'dark'): void;
  getFps(): number;
  destroy(): void;
};

/* The canvas is 40 percent larger than the SVG stage so scattered tiles are not clipped: the frustum grows
   by the same 20 percent on every side of the SVG viewBox (235..765). */
const VIEW = { x: 129, y: 129, w: 742, h: 742 };
const CENTER = { x: 501, y: 499 };
const CROSS = { cx: 497, cy: 505, arm: 99, t: 41 };
const TILE = 66;
const EASE = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

const THEMES = {
  light: { tile: '#D3F6F3', outline: '#0E7C78', cross: '#40E8E0', emissive: 0.25, glow: 0.35 },
  dark: { tile: '#062626', outline: '#67F1E9', cross: '#40E8E0', emissive: 0.45, glow: 0.6 },
};

function glowTexture(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(64, 232, 224, 0.9)');
  grad.addColorStop(0.45, 'rgba(64, 232, 224, 0.28)');
  grad.addColorStop(1, 'rgba(64, 232, 224, 0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new CanvasTexture(c);
}

function crossGeometry(): ExtrudeGeometry {
  const { arm: a, t } = CROSS;
  const s = new Shape();
  s.moveTo(-t, -a); s.lineTo(t, -a); s.lineTo(t, -t); s.lineTo(a, -t); s.lineTo(a, t); s.lineTo(t, t);
  s.lineTo(t, a); s.lineTo(-t, a); s.lineTo(-t, t); s.lineTo(-a, t); s.lineTo(-a, -t); s.lineTo(-t, -t); s.closePath();
  const geo = new ExtrudeGeometry(s, { depth: 18, bevelEnabled: true, bevelThickness: 4, bevelSize: 4, bevelSegments: 2, curveSegments: 4 });
  geo.translate(0, 0, -9);
  return geo;
}

export function mountHero(host: HTMLElement, tiles: TileSpec[], theme: 'light' | 'dark'): HeroHandle {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new OrthographicCamera(VIEW.x, VIEW.x + VIEW.w, -VIEW.y, -(VIEW.y + VIEW.h), -3000, 3000);
  camera.position.z = 1500;
  scene.add(new AmbientLight(0xffffff, 2.1));
  const key = new DirectionalLight(0xffffff, 1.5);
  key.position.set(-500, 700, 900);
  scene.add(key);

  /* everything hangs off a group at the mark's centre so pointer parallax rotates around it */
  const rig = new Group();
  rig.position.set(CENTER.x, -CENTER.y, 0);
  scene.add(rig);

  const tileGeo = new RoundedBoxGeometry(TILE, TILE, 14, 3, 12);
  const tileMat = new MeshStandardMaterial({ color: THEMES[theme].tile, roughness: 0.55, metalness: 0 });
  const outlineMat = new MeshBasicMaterial({ color: THEMES[theme].outline, side: BackSide });
  const tileMesh = new InstancedMesh(tileGeo, tileMat, tiles.length);
  const outlineMesh = new InstancedMesh(tileGeo, outlineMat, tiles.length);
  rig.add(outlineMesh, tileMesh);

  const crossMat = new MeshStandardMaterial({ color: THEMES[theme].cross, emissive: new Color(THEMES[theme].cross), emissiveIntensity: THEMES[theme].emissive, roughness: 0.35, metalness: 0 });
  const cross = new Mesh(crossGeometry(), crossMat);
  const crossOutline = new Mesh(cross.geometry, new MeshBasicMaterial({ color: THEMES[theme].outline, side: BackSide }));
  crossOutline.scale.setScalar(1.04);
  const glow = new Sprite(new SpriteMaterial({ map: glowTexture(), transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: THEMES[theme].glow }));
  glow.scale.set(460, 460, 1);
  glow.position.set(CROSS.cx - CENTER.x, -(CROSS.cy - CENTER.y), -60);
  rig.add(glow, crossOutline, cross);

  /* per-tile poses: assembled from the spec, scattered from the spec plus depth and a 3D tumble */
  const dummy = new Object3D();
  const q = new Quaternion();
  const pos = new Vector3();
  const poses = tiles.map((t, i) => ({
    ax: t.x - CENTER.x, ay: -(t.y - CENTER.y),
    aq: new Quaternion().setFromEuler(new Euler(0, 0, -MathUtils.degToRad(t.rot))),
    sx: t.x - CENTER.x + t.sx, sy: -(t.y - CENTER.y + t.sy), sz: ((i * 137) % 400) - 200,
    sq: new Quaternion().setFromEuler(new Euler(MathUtils.degToRad(((i * 71) % 120) - 60), MathUtils.degToRad(((i * 53) % 140) - 70), MathUtils.degToRad(t.srot))),
    sscale: t.sscale,
    delay: ((i * 7) % tiles.length) / tiles.length * 0.45,
    phase: i * 0.7,
    group: t.group,
  }));
  const crossPose = { ax: CROSS.cx - CENTER.x, ay: -(CROSS.cy - CENTER.y), sx: CROSS.cx - CENTER.x + 40, sy: -(CROSS.cy - CENTER.y - 320), sz: 260, delay: 0.5 };
  const crossSq = new Quaternion().setFromEuler(new Euler(MathUtils.degToRad(-40), MathUtils.degToRad(35), MathUtils.degToRad(-28)));
  const crossAq = new Quaternion();

  let progress = 0;
  let clock = 0;
  const pulses: Record<PulseGroup, number> = { ring: 0, l: 0, cross: 0 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const frameTimes: number[] = [];

  const localP = (delay: number) => EASE(Math.min(1, Math.max(0, (progress - delay) / (1 - delay))));

  const layout = () => {
    const t = clock;
    for (let i = 0; i < poses.length; i++) {
      const p = poses[i];
      const k = localP(p.delay);
      const bob = k >= 1 ? Math.sin(t * 0.9 + p.phase) * 2.5 : 0;
      const pulse = 1 + 0.1 * pulses[p.group];
      pos.set(MathUtils.lerp(p.sx, p.ax, k), MathUtils.lerp(p.sy, p.ay, k) + bob, MathUtils.lerp(p.sz, 0, k));
      q.slerpQuaternions(p.sq, p.aq, k);
      const s = MathUtils.lerp(p.sscale, 1, k) * pulse;
      dummy.position.copy(pos); dummy.quaternion.copy(q); dummy.scale.setScalar(s); dummy.updateMatrix();
      tileMesh.setMatrixAt(i, dummy.matrix);
      dummy.scale.setScalar(s * 1.07); dummy.updateMatrix();
      outlineMesh.setMatrixAt(i, dummy.matrix);
    }
    tileMesh.instanceMatrix.needsUpdate = true;
    outlineMesh.instanceMatrix.needsUpdate = true;
    const k = localP(crossPose.delay);
    const pulse = 1 + 0.08 * pulses.cross;
    cross.position.set(MathUtils.lerp(crossPose.sx, crossPose.ax, k), MathUtils.lerp(crossPose.sy, crossPose.ay, k), MathUtils.lerp(crossPose.sz, 0, k));
    cross.quaternion.slerpQuaternions(crossSq, crossAq, k);
    cross.scale.setScalar(MathUtils.lerp(0.85, 1, k) * pulse);
    crossOutline.position.copy(cross.position); crossOutline.quaternion.copy(cross.quaternion); crossOutline.scale.setScalar(cross.scale.x * 1.04);
    const breathe = k >= 1 ? 0.5 + 0.5 * Math.sin(t * 1.1) : 0;
    crossMat.emissiveIntensity = THEMES[currentTheme].emissive * (0.8 + 0.4 * breathe + 0.6 * pulses.cross);
    glow.material.opacity = THEMES[currentTheme].glow * k * (0.85 + 0.3 * breathe);
    glow.position.set(cross.position.x, cross.position.y, -60);
    for (const g of Object.keys(pulses) as PulseGroup[]) pulses[g] *= 0.9;
  };

  let currentTheme = theme;
  const setTheme = (next: 'light' | 'dark') => {
    currentTheme = next;
    tileMat.color.set(THEMES[next].tile);
    outlineMat.color.set(THEMES[next].outline);
    (crossOutline.material as MeshBasicMaterial).color.set(THEMES[next].outline);
  };

  /* size follows the host; the host is sized by the hero's stage */
  const resize = () => {
    const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  /* pointer parallax, mouse and touch alike, around the mark's centre */
  const onPointer = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  const onLeave = () => { pointer.tx = 0; pointer.ty = 0; };
  const hero = host.closest('section') || host;
  hero.addEventListener('pointermove', onPointer, { passive: true });
  hero.addEventListener('pointerleave', onLeave);

  /* render only while visible and the tab is in front */
  let raf = 0;
  let last = performance.now();
  let visible = true;
  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    frameTimes.push(now - last);
    if (frameTimes.length > 60) frameTimes.shift();
    last = now;
    clock += dt;
    pointer.x = MathUtils.lerp(pointer.x, pointer.tx, 0.08);
    pointer.y = MathUtils.lerp(pointer.y, pointer.ty, 0.08);
    rig.rotation.y = pointer.x * 0.16 * Math.min(1, progress);
    rig.rotation.x = pointer.y * 0.12 * Math.min(1, progress);
    layout();
    renderer.render(scene, camera);
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const io = new IntersectionObserver((entries) => { visible = entries.some((e) => e.isIntersecting); if (visible) start(); }, { threshold: 0.05 });
  io.observe(host);
  const onVis = () => { if (!document.hidden) start(); };
  document.addEventListener('visibilitychange', onVis);
  start();

  return {
    setProgress(p) { progress = Math.min(1, Math.max(0, p)); start(); },
    pulse(g) { pulses[g] = 1; start(); },
    setTheme,
    getFps() { if (frameTimes.length < 10) return 0; const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length; return 1000 / avg; },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      hero.removeEventListener('pointermove', onPointer); hero.removeEventListener('pointerleave', onLeave);
      tileGeo.dispose(); tileMat.dispose(); outlineMat.dispose(); cross.geometry.dispose(); crossMat.dispose(); (crossOutline.material as MeshBasicMaterial).dispose(); glow.material.map?.dispose(); glow.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
