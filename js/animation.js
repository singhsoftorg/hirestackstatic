(function() {
// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById("canvas-container").appendChild(renderer.domElement);

camera.position.z = 5;

// Create particles (A1: increased count, size, adjusted opacity)
const particleCount = 1200;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount); // A2: depth variation

const color1 = new THREE.Color(0x00d9ff);
const color2 = new THREE.Color(0xff6b9d);

for (let i = 0; i < particleCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 20;
  positions[i + 1] = (Math.random() - 0.5) * 20;
  positions[i + 2] = (Math.random() - 0.5) * 20;

  const mixRatio = Math.random();
  const color = color1.clone().lerp(color2, mixRatio);
  colors[i] = color.r;
  colors[i + 1] = color.g;
  colors[i + 2] = color.b;

  // A2: Variable particle sizes for depth
  sizes[i / 3] = Math.random() * 0.08 + 0.02;
}

particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));
particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.08,
  vertexColors: true,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
});

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Create geometric shapes
const geometry = new THREE.IcosahedronGeometry(1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00d9ff,
  wireframe: true,
  transparent: true,
  opacity: 0.3,
});

const shapes = [];
for (let i = 0; i < 3; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 5,
  );
  mesh.scale.set(0.5, 0.5, 0.5);
  shapes.push(mesh);
  scene.add(mesh);
}

// A4: Mouse tracking for parallax
const mouse = { x: 0, y: 0 };
const smoothMouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Scroll-based animation
// Read scrollY and currentSection from the global scope (set by interactions.js)
let scrollCameraX = 0;
let scrollCameraY = 0;

window.addEventListener("scroll", () => {
  var scrollY = window.scrollY;
  var scrollProgress =
    scrollY / (document.body.scrollHeight - window.innerHeight);

  // Store scroll-based camera offsets (combined with mouse in animate loop)
  scrollCameraX = Math.sin(scrollProgress * Math.PI * 2) * 2;
  scrollCameraY = -scrollProgress * 3;

  // Rotate particle system
  particleSystem.rotation.y = scrollProgress * Math.PI * 4;
  particleSystem.rotation.x = scrollProgress * Math.PI * 2;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // A4: Smooth mouse interpolation
  smoothMouse.x += (mouse.x - smoothMouse.x) * 0.05;
  smoothMouse.y += (mouse.y - smoothMouse.y) * 0.05;

  // A3: Slower shape rotation with breathing effect
  shapes.forEach((shape, index) => {
    shape.rotation.x += 0.0005 * (index + 1);
    shape.rotation.y += 0.001 * (index + 1);
    const breathe = 1 + Math.sin(time * 0.5 + index * 1.5) * 0.08;
    shape.scale.set(0.4 * breathe, 0.4 * breathe, 0.4 * breathe);

    // Change shape behavior per section
    // Read currentSection from window (set by interactions.js)
    switch (window.currentSection) {
      case 0: // Hero
        shape.position.y = Math.sin(time + index) * 0.5;
        break;
      case 1: // Features
        shape.position.x = Math.cos(time + index) * 2;
        break;
      case 2: // Stats
        // Breathing effect already applied above
        break;
      case 3: // Services
        shape.position.z = Math.sin(time + index) * 2;
        break;
    }
  });

  // A4: Mouse parallax on particles
  particleSystem.rotation.z = smoothMouse.x * 0.1;

  // A4: Smooth camera following mouse + scroll offset
  const targetX = scrollCameraX + smoothMouse.x * 0.5;
  const targetY = scrollCameraY + smoothMouse.y * 0.3;
  camera.position.x += (targetX - camera.position.x) * 0.02;
  camera.position.y += (targetY - camera.position.y) * 0.02;

  // Gentle particle movement
  const positionAttribute = particleSystem.geometry.attributes.position;
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);

    positionAttribute.setY(i, y + Math.sin(time + x) * 0.002);
  }
  positionAttribute.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// IntersectionObserver and smooth scroll are handled by interactions.js
// No duplicates needed here.

})();
