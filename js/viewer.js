/* 3D viewers: hero bike plus lazy viewers for the joystick and wheel. */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

function supportsWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch (e) { return false; }
}

function createViewer(canvas, url, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure || 1.0;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 1000);
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 5, 4);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.25));

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = opts.spin || 1.2;
  controls.minPolarAngle = Math.PI * 0.2;
  controls.maxPolarAngle = Math.PI * 0.62;

  let visible = true;
  let model = null;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (model) frame();
  }

  let radius = 1;
  function center() {
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model, true);
    model.position.sub(box.getCenter(new THREE.Vector3()));
    model.updateMatrixWorld(true);
    radius = box.getSize(new THREE.Vector3()).length() / 2;
  }

  function frame() {
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const fit = radius / Math.sin(Math.min(fov, fov * camera.aspect) / 2);
    const dist = fit * (opts.distance || 1.0);
    const dir = new THREE.Vector3(...(opts.view || [1, 0.35, 1])).normalize();
    camera.position.copy(dir.multiplyScalar(dist));
    camera.near = dist / 100; camera.far = dist * 10;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.update();
  }

  loader.load(url, (gltf) => {
    model = gltf.scene;
    // Alias exports are open surfaces with a placeholder material: paint them and show both sides.
    const paint = opts.color ? new THREE.MeshPhysicalMaterial({
      color: opts.color, roughness: opts.rough ?? 0.32, metalness: opts.metal ?? 0.15,
      clearcoat: 1, clearcoatRoughness: 0.12, side: THREE.DoubleSide
    }) : null;
    model.traverse((o) => {
      if (!o.isMesh) return;
      if (paint) o.material = paint;
      else o.material.side = THREE.DoubleSide;
    });
    if (opts.rotate) model.rotation.set(...opts.rotate);
    const wrap = new THREE.Group(); wrap.add(model); scene.add(wrap);
    center();
    frame();
    canvas.dispatchEvent(new CustomEvent('model-ready'));
  }, undefined, () => canvas.dispatchEvent(new CustomEvent('model-error')));

  new ResizeObserver(resize).observe(canvas);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(canvas);
  }

  const clock = new THREE.Clock();
  const host = canvas.closest('dialog');
  renderer.setAnimationLoop(() => {
    if (!visible || !model) return;
    // Behind an open case study? Skip the frame.
    const open = document.querySelector('dialog[open]');
    if (open ? open !== host : !!host) return;
    const t = clock.getElapsedTime();
    if (opts.sweep && !reduce) key.position.set(Math.sin(t * 0.5) * 5, 5, Math.cos(t * 0.5) * 5);
    controls.update();
    renderer.render(scene, camera);
  });
  resize();
}

if (supportsWebGL()) {
  // Hero bike
  const hero = document.getElementById('hero-canvas');
  const stage = hero && hero.closest('.hero-stage');
  if (hero) {
    hero.addEventListener('model-error', () => stage.classList.add('no-3d'));
    createViewer(hero, 'models/bikee.glb', { color: '#8496bf', metal: 0.5, rough: 0.3, view: [1, 0.2, 0.8], distance: 1.0, sweep: true, spin: 0.9, exposure: 0.85 });
  }
  // Lazy viewers: start when scrolled into view (or when their case study opens)
  const minis = Array.from(document.querySelectorAll('.mini-canvas'));
  const start = (c) => {
    if (c.dataset.started) return; c.dataset.started = '1';
    createViewer(c, c.dataset.model, { color: c.dataset.color, metal: c.dataset.metal ? +c.dataset.metal : undefined, rough: c.dataset.rough ? +c.dataset.rough : undefined, distance: c.dataset.distance ? +c.dataset.distance : 1.5, view: [1, 0.4, 1.2], spin: 1.6 });
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { start(en.target); io.unobserve(en.target); } });
  }, { rootMargin: '200px' });
  minis.forEach((c) => io.observe(c));
} else {
  document.querySelectorAll('.hero-stage').forEach((s) => s.classList.add('no-3d'));
  document.querySelectorAll('.mini-canvas').forEach((c) => { c.parentElement.style.display = 'none'; });
}
