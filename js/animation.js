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

// Create particles
const particleCount = 1500;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

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
}

particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.05,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
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

// Scroll-based animation
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const sections = document.querySelectorAll("section");
  const scrollProgress =
    scrollY / (document.body.scrollHeight - window.innerHeight);

  // Determine current section
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2
    ) {
      currentSection = index;
    }
  });

  // Animate camera based on section
  camera.position.x = Math.sin(scrollProgress * Math.PI * 2) * 2;
  camera.position.y = -scrollProgress * 3;

  // Rotate particle system
  particleSystem.rotation.y = scrollProgress * Math.PI * 4;
  particleSystem.rotation.x = scrollProgress * Math.PI * 2;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Animate shapes based on current section
  shapes.forEach((shape, index) => {
    shape.rotation.x += 0.005 * (index + 1);
    shape.rotation.y += 0.003 * (index + 1);

    // Change shape behavior per section
    switch (currentSection) {
      case 0: // Hero
        shape.position.y = Math.sin(time + index) * 0.5;
        break;
      case 1: // Features
        shape.position.x = Math.cos(time + index) * 2;
        break;
      case 2: // Stats
        shape.scale.set(
          0.5 + Math.sin(time + index) * 0.2,
          0.5 + Math.sin(time + index) * 0.2,
          0.5 + Math.sin(time + index) * 0.2,
        );
        break;
      case 3: // Services
        shape.position.z = Math.sin(time + index) * 2;
        break;
    }
  });

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

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe all animated elements
document
  .querySelectorAll(
    ".section-title, .feature-card, .stat, .service-item, .contact-content",
  )
  .forEach((el) => {
    observer.observe(el);
  });

// Smooth scroll for CTA button
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
