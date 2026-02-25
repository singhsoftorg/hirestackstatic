// Mouse tracking variables (shared with animation.js via globals)
var targetMouse = { x: 0, y: 0 };
var currentSection = 0;

// Scroll-based animation
var scrollY = window.scrollY;
currentSection = 0;

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

});

// Mouse move interaction - highly optimized
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

window.addEventListener("mousemove", (e) => {
  if (targetMouse) {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

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
    ".section-title, .feature-card, .stat, .service-item, .contact-content, .contact-form, .faq-item, .testimonial-card, .trust-badge",
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

// Animated value transition helper
function animateValue(element, newValue, prefix = '$', suffix = '') {
  if (isNaN(newValue) || newValue === null) return;
  const current = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
  const target = newValue;
  const duration = 400;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(current + (target - current) * eased);
    element.textContent = prefix + value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
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
  animateValue(traditionalCostEl, Math.round(traditionalCost), '$', '');
  animateValue(ourstackCostEl, Math.round(ourCost), '$', '');
  animateValue(savingsAmountEl, Math.round(savings), '$', '');
  savingsPercentEl.textContent = "(" + savingsPercent + "%)";
}

if (employeesSlider && roleSelect) {
  employeesSlider.addEventListener("input", updateCalculator);
  roleSelect.addEventListener("change", updateCalculator);
  updateCalculator(); // Initial calculation
}

// Feature card toggle
window.toggleFeature = function(element) {
  document.querySelectorAll('.feature-card').forEach(card => {
    if (card !== element) card.classList.remove('expanded');
  });
  element.classList.toggle('expanded');
};

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

// Accessibility: Keyboard navigation for feature cards
document.querySelectorAll('.feature-card').forEach((item) => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-expanded', 'false');
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFeature(item);
      item.setAttribute('aria-expanded', item.classList.contains('expanded'));
    }
  });
  item.addEventListener('click', () => {
    item.setAttribute('aria-expanded', item.classList.contains('expanded'));
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
          trust: "Trust & Credentials",
          stats: "Statistics",
          services: "Our Services",
          faq: "Frequently Asked Questions",
          testimonials: "Testimonials",
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

// Mobile nav active state tracking
if (window.innerWidth <= 768) {
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navObserver2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        mobileNavLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.mobile-nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(section => navObserver2.observe(section));
}

// Mouse-tracking spotlight effect on cards
document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});
