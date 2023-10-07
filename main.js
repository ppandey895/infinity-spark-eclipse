import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

const scene = new THREE.Scene();

const camera = getCamera();
const moon = getMoon();
const earth = getEarth(moon);
const sun = getSun(earth);
addMeteors(5000);

const gui = new GUI();
const speed = {
  sunRotation: {x: 0, y: 0.01, z: 0}
};

const sunFolder = gui.addFolder('Sun Rotation');
sunFolder.add(speed.sunRotation, 'y', -0.1, 0.1);
sunFolder.open();

function getCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 30, 0);
  return camera;
}

function getEarth(moon) {
  const earthTexture = new THREE.TextureLoader().load('assets/earth.png');
  const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(2, 20, 20), earthMaterial);
  
  const moonGeo = new THREE.TorusGeometry(5, 0.05, 50);
  const moonOrbit = new THREE.Mesh(moonGeo, new THREE.MeshBasicMaterial({color: 0x888888 }));

  scene.add(earth);
  earth.add(moon);
  moonOrbit.position.set(0, 0, 0);
  moonOrbit.rotateX(Math.PI / 2);
  earth.add(moonOrbit);
  earth.position.set(25, 0, 0);
  earth.receiveShadow = true;
  return earth;
}

function getMoon() {
  const moonTexture = new THREE.TextureLoader().load('assets/moon.jpg');
  const normalTexture = new THREE.TextureLoader().load('assets/normal.jpg');
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 10, 10),
    new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
  );
  moon.castShadow = true;
  moon.position.set(0, 0, 5);
  return moon;
}

function getSun(earth) {
  const light = new THREE.PointLight(0xffffff, 300);
  const sunTexture = new THREE.TextureLoader().load('assets/sun.jpg');
  const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(4, 20, 20), sunMaterial);
  const orbitGeo = new THREE.TorusGeometry(25, 0.05, 50);
  const earthOrbit = new THREE.Mesh(orbitGeo, new THREE.MeshBasicMaterial({color: 0x888888 }));
  let x=0;
  let y=0;
  let z=0;
  
  earthOrbit.position.set(0, 0, 0);
  earthOrbit.rotateX(Math.PI / 2);
  sun.add(earthOrbit);

  sun.position.set(x, y, z);
  light.position.set(0, 0, 0);
  light.castShadow = true;
  scene.add(light);
  scene.add(sun);
  earth.rotateX(Math.PI / 10);
  sun.add(earth);
  return sun;
}

function addMeteors(n) {
  Array(n).fill().forEach(()=>{
    const geometry = new THREE.DodecahedronGeometry(1);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));
    star.position.set(x, y, z);
    scene.add(star);
  });
}


const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#scene'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


const gridHelper = new THREE.GridHelper(1000, 50);
scene.add(gridHelper);

const controls = getControls()
  
function getControls() {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = true;
  return controls;
}

function animate() {
  sun.rotation.x += speed.sunRotation.x;
  sun.rotation.y += speed.sunRotation.y;
  sun.rotation.z += speed.sunRotation.z;

  earth.rotation.y += speed.sunRotation.y * 2;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
