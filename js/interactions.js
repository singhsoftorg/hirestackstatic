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

// Mouse tracking variables
const mouse = { x: 0, y: 0 };
const targetMouse = { x: 0, y: 0 };

// Create particles
const particleCount = 800;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const originalPositions = new Float32Array(particleCount * 3);

const color1 = new THREE.Color(0x00d9ff);
const color2 = new THREE.Color(0xff6b9d);

for (let i = 0; i < particleCount * 3; i += 3) {
  const x = (Math.random() - 0.5) * 20;
  const y = (Math.random() - 0.5) * 20;
  const z = (Math.random() - 0.5) * 20;

  positions[i] = x;
  positions[i + 1] = y;
  positions[i + 2] = z;

  originalPositions[i] = x;
  originalPositions[i + 1] = y;
  originalPositions[i + 2] = z;

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

// Create geometric shapes - subtle and minimal
const geometry = new THREE.IcosahedronGeometry(0.8, 0);
const material = new THREE.MeshBasicMaterial({
  color: 0x00d9ff,
  wireframe: true,
  transparent: true,
  opacity: 0.15,
});

const shapes = [];
for (let i = 0; i < 2; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 3,
  );
  mesh.scale.set(0.4, 0.4, 0.4);
  shapes.push(mesh);
  scene.add(mesh);
}

// Scroll-based animation
let scrollY = window.scrollY;
let currentSection = 0;

// Scroll Progress Bar
function updateScrollProgress() {
  const scrollProgress = document.querySelector(".scroll-progress");
  if (scrollProgress) {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + "%";
    scrollProgress.setAttribute("aria-valuenow", Math.round(scrollPercent));
  }
}

// Sticky CTA Button
function updateStickyCTA() {
  const stickyCTA = document.querySelector(".sticky-cta");
  if (stickyCTA) {
    const heroSection = document.querySelector("#hero");
    const contactSection = document.querySelector("#contact");

    if (heroSection && contactSection) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const contactTop = contactSection.offsetTop;
      const scrollPosition = window.scrollY + window.innerHeight;

      // Show sticky CTA after hero section but hide in contact section
      if (window.scrollY > heroBottom && scrollPosition < contactTop + 200) {
        stickyCTA.classList.add("visible");
      } else {
        stickyCTA.classList.remove("visible");
      }
    }
  }
}

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const sections = document.querySelectorAll("section");
  const scrollProgress =
    scrollY / (document.body.scrollHeight - window.innerHeight);

  // Update scroll progress bar
  updateScrollProgress();

  // Update sticky CTA visibility
  updateStickyCTA();

  // Determine current section
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2
    ) {
      currentSection = index;

      // Update nav links
      document.querySelectorAll(".nav-link").forEach((link, idx) => {
        link.classList.toggle("active", idx === index);
      });
    }
  });

  // Animate camera based on section
  camera.position.x = Math.sin(scrollProgress * Math.PI * 2) * 2;
  camera.position.y = -scrollProgress * 3;

  // Rotate particle system
  particleSystem.rotation.y = scrollProgress * Math.PI * 4;
  particleSystem.rotation.x = scrollProgress * Math.PI * 2;
});

// Mouse move interaction - highly optimized
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

window.addEventListener("mousemove", (e) => {
  targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  cursorX = e.clientX;
  cursorY = e.clientY;
});

// Separate animation loop for cursor with requestAnimationFrame
function animateCursor() {
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");

  if (cursor && follower) {
    // Smooth cursor following
    followerX += (cursorX - followerX) * 0.15;
    followerY += (cursorY - followerY) * 0.15;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
  }

  requestAnimationFrame(animateCursor);
}

// Start cursor animation on desktop only
if (window.innerWidth > 768) {
  animateCursor();
}

// Custom cursor hover effect
document
  .querySelectorAll(
    "a, button, .feature-card, .stat, .service-item, .contact-card",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.querySelector(".cursor")?.classList.add("hover");
      document.querySelector(".cursor-follower")?.classList.add("hover");
    });

    el.addEventListener("mouseleave", () => {
      document.querySelector(".cursor")?.classList.remove("hover");
      document.querySelector(".cursor-follower")?.classList.remove("hover");
    });
  });

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Smooth mouse following
  mouse.x += (targetMouse.x - mouse.x) * 0.05;
  mouse.y += (targetMouse.y - mouse.y) * 0.05;

  // Animate shapes based on current section - slower and smoother
  shapes.forEach((shape, index) => {
    shape.rotation.x += 0.001 * (index + 1);
    shape.rotation.y += 0.002 * (index + 1);

    // Change shape behavior per section
    switch (currentSection) {
      case 0: // Hero
        shape.position.y = Math.sin(time + index) * 0.5;
        break;
      case 1: // Features
        shape.position.x = Math.cos(time + index) * 2;
        break;
      case 2: // Calculator
        shape.position.z = Math.cos(time + index) * 1.5;
        break;
      case 3: // Stats
        shape.scale.set(
          0.5 + Math.sin(time + index) * 0.2,
          0.5 + Math.sin(time + index) * 0.2,
          0.5 + Math.sin(time + index) * 0.2,
        );
        break;
      case 4: // Services
        shape.position.z = Math.sin(time + index) * 2;
        break;
    }
  });

  // Interactive particle movement - optimized, only update subset
  const positionAttribute = particleSystem.geometry.attributes.position;
  const updateFrequency = 3; // Update every 3rd particle for performance

  for (let i = 0; i < positionAttribute.count; i += updateFrequency) {
    const i3 = i * 3;
    const x = originalPositions[i3];
    const y = originalPositions[i3 + 1];
    const z = originalPositions[i3 + 2];

    // Gentle wave motion only
    positionAttribute.setX(i, x + Math.sin(time * 0.5 + x) * 0.003);
    positionAttribute.setY(i, y + Math.sin(time * 0.5 + y) * 0.003);
    positionAttribute.setZ(i, z);
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

      // Trigger counter animation for stats
      if (entry.target.classList.contains("stat")) {
        animateCounter(entry.target);
      }
    }
  });
}, observerOptions);

// Observe all animated elements
document
  .querySelectorAll(
    ".section-title, .feature-card, .stat, .service-item, .contact-content, .contact-form, .faq-item",
  )
  .forEach((el) => {
    observer.observe(el);
  });

// Animated counter for stats
function animateCounter(statElement) {
  const numberElement = statElement.querySelector(".stat-number");
  const target = parseInt(numberElement.getAttribute("data-target"));
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);

    numberElement.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      numberElement.textContent = target;
    }
  }

  requestAnimationFrame(updateCounter);
}

// Calculator functionality
const employeesSlider = document.getElementById("employees");
const employeesValue = document.getElementById("employeesValue");
const roleSelect = document.getElementById("role");
const traditionalCostEl = document.getElementById("traditionalCost");
const ourstackCostEl = document.getElementById("ourstackCost");
const savingsAmountEl = document.getElementById("savingsAmount");
const savingsPercentEl = document.getElementById("savingsPercent");

function updateCalculator() {
  const employees = parseInt(employeesSlider.value);
  const salaryPerEmployee = parseInt(roleSelect.value);

  // Traditional cost: salary + 30% overhead + recruitment costs
  const traditionalCost =
    employees * salaryPerEmployee * 1.3 + employees * 5000;

  // Our cost: 30% discount
  const ourCost = employees * salaryPerEmployee * 0.7;

  const savings = traditionalCost - ourCost;
  const savingsPercent = ((savings / traditionalCost) * 100).toFixed(0);

  employeesValue.textContent = employees;
  traditionalCostEl.textContent =
    "$" + Math.round(traditionalCost).toLocaleString();
  ourstackCostEl.textContent = "$" + Math.round(ourCost).toLocaleString();
  savingsAmountEl.textContent = "$" + Math.round(savings).toLocaleString();
  savingsPercentEl.textContent = "(" + savingsPercent + "%)";
}

if (employeesSlider && roleSelect) {
  employeesSlider.addEventListener("input", updateCalculator);
  roleSelect.addEventListener("change", updateCalculator);
  updateCalculator(); // Initial calculation
}

// Service item expansion toggle
window.toggleService = function (element) {
  const isExpanded = element.classList.contains("expanded");

  // Close all other service items
  document.querySelectorAll(".service-item").forEach((item) => {
    if (item !== element) {
      item.classList.remove("expanded");
    }
  });

  // Toggle current item
  element.classList.toggle("expanded");
};

// Smooth scroll for navigation and CTA buttons
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

// Removed aggressive parallax - was causing jerkiness

// Removed particle trail - was causing performance issues

// Initialize - Force first calculation
window.addEventListener("load", () => {
  if (typeof updateCalculator === "function") {
    updateCalculator();
  }
});

// FAQ Toggle Functionality
window.toggleFAQ = function (element) {
  const isExpanded = element.classList.contains("expanded");

  // Optionally close other FAQ items (accordion style)
  // document.querySelectorAll('.faq-item').forEach(item => {
  //   if (item !== element) {
  //     item.classList.remove('expanded');
  //   }
  // });

  // Toggle current item
  element.classList.toggle("expanded");
};

// Contact Form Validation and Submission
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm) {
  // Real-time validation
  const inputs = contactForm.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    if (input.hasAttribute("required")) {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.parentElement.classList.contains("error")) {
          validateField(input);
        }
      });
    }
  });

  // Form submission
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    inputs.forEach((input) => {
      if (input.hasAttribute("required") && !validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = contactForm.querySelector(".form-group.error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector(".submit-btn");
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      // Simulate API call (replace with actual endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In production, replace above with:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      //
      // if (!response.ok) throw new Error('Submission failed');

      // Show success message
      contactForm.style.display = "none";
      formSuccess.classList.add("show");

      // Analytics tracking (if implemented)
      if (typeof gtag !== "undefined") {
        gtag("event", "form_submission", {
          event_category: "Contact",
          event_label: data.service,
        });
      }

      // Optional: Reset form after delay
      setTimeout(() => {
        contactForm.reset();
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      alert(
        "Sorry, there was an error submitting your form. Please try again or email us directly at hello@hirestacksolutions.au",
      );
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
}

function validateField(input) {
  const formGroup = input.parentElement;
  const errorMessage = formGroup.querySelector(".error-message");
  let error = "";

  // Check if empty (for required fields)
  if (input.hasAttribute("required") && !input.value.trim()) {
    error = "This field is required";
  }
  // Email validation
  else if (input.type === "email" && input.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      error = "Please enter a valid email address";
    }
  }
  // Phone validation (optional, only if filled)
  else if (input.type === "tel" && input.value) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (
      !phoneRegex.test(input.value) ||
      input.value.replace(/\D/g, "").length < 10
    ) {
      error = "Please enter a valid phone number";
    }
  }
  // Select validation
  else if (
    input.tagName === "SELECT" &&
    input.hasAttribute("required") &&
    !input.value
  ) {
    error = "Please select an option";
  }
  // Textarea minimum length
  else if (
    input.tagName === "TEXTAREA" &&
    input.hasAttribute("required") &&
    input.value.trim().length < 10
  ) {
    error = "Please provide more details (at least 10 characters)";
  }

  if (error) {
    formGroup.classList.add("error");
    formGroup.classList.remove("success");
    errorMessage.textContent = error;
    return false;
  } else {
    formGroup.classList.remove("error");
    // Add success state for valid fields
    if (input.value.trim()) {
      formGroup.classList.add("success");
    } else {
      formGroup.classList.remove("success");
    }
    errorMessage.textContent = "";
    return true;
  }
}

// Performance optimization: Reduce particles on mobile
if (window.innerWidth <= 768) {
  const positions = particleSystem.geometry.attributes.position;
  const newCount = Math.floor(particleCount * 0.3); // 30% for mobile
  const newPositions = new Float32Array(newCount * 3);
  const newColors = new Float32Array(newCount * 3);

  for (let i = 0; i < newCount * 3; i++) {
    newPositions[i] = positions.array[i];
    newColors[i] = particleSystem.geometry.attributes.color.array[i];
  }

  particleSystem.geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(newPositions, 3),
  );
  particleSystem.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(newColors, 3),
  );
}

// Accessibility: Keyboard navigation for service items
document.querySelectorAll(".service-item").forEach((item, index) => {
  item.setAttribute("tabindex", "0");
  item.setAttribute("role", "button");
  item.setAttribute("aria-expanded", "false");

  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleService(item);
      const isExpanded = item.classList.contains("expanded");
      item.setAttribute("aria-expanded", isExpanded);
    }
  });
});

// Accessibility: Keyboard navigation for FAQ items
document.querySelectorAll(".faq-item").forEach((item, index) => {
  item.setAttribute("tabindex", "0");
  item.setAttribute("role", "button");
  item.setAttribute("aria-expanded", "false");

  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQ(item);
      const isExpanded = item.classList.contains("expanded");
      item.setAttribute("aria-expanded", isExpanded);
    }
  });
});

// Accessibility: Announce page sections to screen readers
const sections = document.querySelectorAll("section[id]");
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        // Update document title for screen readers
        const sectionTitles = {
          hero: "Home",
          features: "Features",
          calculator: "Savings Calculator",
          stats: "Statistics",
          services: "Our Services",
          faq: "Frequently Asked Questions",
          contact: "Contact Us",
        };
        if (sectionTitles[sectionId]) {
          document.title = `${sectionTitles[sectionId]} - Hire Stack Solutions`;
        }
      }
    });
  },
  { threshold: 0.5 },
);

sections.forEach((section) => navObserver.observe(section));

// Smooth scroll with offset for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      const offset = 0; // Adjust if you have fixed header
      const targetPosition = targetElement.offsetTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Initialize scroll progress and sticky CTA on page load
updateScrollProgress();
updateStickyCTA();

console.log("🚀 Hire Stack Solutions - Interactive Experience Loaded!");
console.log(
  "✨ Custom cursor, animated counters, and interactive elements active",
);
console.log("✅ Accessibility features enabled");
console.log("📧 Contact form with validation ready");
console.log("📊 Scroll progress & sticky CTA activated");
