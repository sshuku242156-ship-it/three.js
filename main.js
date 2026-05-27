import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x20232a);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(2.5, 2.5, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.style.display = 'block';
document.body.appendChild(renderer.domElement);

const sphereGroup = new THREE.Group();

const geometry = new THREE.SphereGeometry(0.9, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.2, roughness: 0.4 });
const sphere = new THREE.Mesh(geometry, material);
// 横方向を10/9に拡大、縦方向は6/5のまま
sphere.scale.set(10 / 9, 6 / 5, 1);
sphereGroup.add(sphere);

const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 24);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, metalness: 0.2, roughness: 0.8 });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(0, 0.9 * (6 / 5) + 0.2, 0);
sphereGroup.add(cylinder);

// 円柱の側面に付ける、緑の楕円（円ジオメトリを横方向に拡大して楕円化）
// 設計: 円の半径 r=0.3 を横方向に1.5倍して、長軸 a=0.45, 短軸 b=0.3 にする。
const circleRadius = 0.3;
const circleSegments = 64;
const circleGeometry = new THREE.CircleGeometry(circleRadius, circleSegments);
const circleMaterial = new THREE.MeshStandardMaterial({ color: 0x00aa00, side: THREE.DoubleSide, metalness: 0.1, roughness: 0.7 });
const ellipse = new THREE.Mesh(circleGeometry, circleMaterial);
// 横方向に3/2拡大して楕円にする
ellipse.scale.set(1.5, 1, 1);
// 平面の法線を +X 方向に向ける（デフォルトは +Z）
ellipse.rotation.y = -Math.PI / 2;
// 円柱の半径（0.1）と楕円の長軸 a を使って、楕円の左端がちょうど円柱表面に接するように配置
const cylinderRadius = 0.1;
const ellipseSemiMajor = circleRadius * 1.5; // 0.45
// 楕円の中心を円柱の高さに合わせ、長軸の左端が円柱表面に接するよう配置
ellipse.position.set(cylinder.position.x + cylinderRadius + ellipseSemiMajor, cylinder.position.y, 0);
// 回転グループに追加（sphereGroup と一緒に回転）
sphereGroup.add(ellipse);

scene.add(sphereGroup);

const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(5, 5, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0x606060, 1.0);
scene.add(ambient);

const grid = new THREE.GridHelper(10, 10, 0x888888, 0x222222);
scene.add(grid);

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

function animate() {
  requestAnimationFrame(animate);
  sphereGroup.rotation.x += 0.01;
  sphereGroup.rotation.y += 0.013;
  renderer.render(scene, camera);
}

animate();
