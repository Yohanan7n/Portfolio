/**
 * Yohanan Fantahun Worku - 3D Portfolio Interactive Engine
 * Featuring:
 * 1. Three.js 3D Particle & Wireframe Constellation Universe
 * 2. Real-time 3D Card Tilt & Specular Light Reflection
 * 3. Draggable Interactive 3D Tech Cube Showcase
 * 4. Dynamic Typing, Modal Deep Dives & Touch Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initThreeJsUniverse();
  init3DTiltEngine();
  init3DTechCube();
  initTypingEffect();
  initNavbarScroll();
  initMobileMenu();
  initProjectFiltering();
});

/* ==========================================================================
   1. THREE.JS 3D WEBGL UNIVERSE (Burgundy Nebula & Wireframe Sculptures)
   ========================================================================== */
function initThreeJsUniverse() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 45;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. Burgundy & Crimson 3D Particles
  const particleCount = 550;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const burgundyColors = [
    new THREE.Color(0xA61C42), // Vibrant Burgundy
    new THREE.Color(0x800020), // Classic Burgundy
    new THREE.Color(0xC72554), // Bright Crimson
    new THREE.Color(0xE5A93C), // Accent Gold
    new THREE.Color(0xFB7185)  // Rose
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 110;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 110;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    const chosenColor = burgundyColors[Math.floor(Math.random() * burgundyColors.length)];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.9,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // 2. Floating 3D Geometric Sculptures
  // Torus Knot (Wireframe Burgundy)
  const torusKnotGeo = new THREE.TorusKnotGeometry(9, 2.6, 90, 16);
  const torusKnotMat = new THREE.MeshBasicMaterial({
    color: 0xA61C42,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
  torusKnot.position.set(28, 12, -15);
  scene.add(torusKnot);

  // Icosahedron (Wireframe Rose Gold)
  const icosaGeo = new THREE.IcosahedronGeometry(7, 1);
  const icosaMat = new THREE.MeshBasicMaterial({
    color: 0xE5A93C,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const icosahedron = new THREE.Mesh(icosaGeo, icosaMat);
  icosahedron.position.set(-28, -14, -10);
  scene.add(icosahedron);

  // Octahedron (Deep Wine Wireframe)
  const octaGeo = new THREE.OctahedronGeometry(5, 0);
  const octaMat = new THREE.MeshBasicMaterial({
    color: 0xC72554,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  const octahedron = new THREE.Mesh(octaGeo, octaMat);
  octahedron.position.set(-18, 22, -20);
  scene.add(octahedron);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Scroll Parallax
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth damping
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotate particles & shapes
    particleSystem.rotation.y += 0.0008;
    particleSystem.rotation.x += 0.0004;

    torusKnot.rotation.x += 0.004;
    torusKnot.rotation.y += 0.006;

    icosahedron.rotation.x -= 0.005;
    icosahedron.rotation.z += 0.005;

    octahedron.rotation.y += 0.008;

    // Parallax response
    camera.position.x = targetX * 6;
    camera.position.y = -targetY * 6 - (scrollY * 0.012);
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
}

/* ==========================================================================
   2. 3D TILT ENGINE & SPECULAR LIGHTING GLOSS
   ========================================================================== */
function init3DTiltEngine() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    const shine = card.querySelector('.card-shine');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-12 to +12 deg)
      const rotateX = ((y - centerY) / centerY) * -11;
      const rotateY = ((x - centerX) / centerX) * 11;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

      // Dynamic Specular Reflection
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.18) 0%, rgba(166,28,66,0.22) 35%, transparent 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      if (shine) {
        shine.style.background = '';
      }
    });
  });
}

/* ==========================================================================
   3. DRAGGABLE INTERACTIVE 3D TECH CUBE SHOWCASE
   ========================================================================== */
let cubeRotateX = -15;
let cubeRotateY = 25;
let isDraggingCube = false;
let autoRotateCube = true;
let startX, startY;

function init3DTechCube() {
  const viewport = document.getElementById('cube-viewport');
  const cube = document.getElementById('cube-3d');
  if (!viewport || !cube) return;

  // Render initial cube position
  updateCubeTransform();

  // Mouse & Touch Dragging
  function handleDragStart(clientX, clientY) {
    isDraggingCube = true;
    autoRotateCube = false;
    startX = clientX;
    startY = clientY;
    updateAutoRotateButtonState();
  }

  function handleDragMove(clientX, clientY) {
    if (!isDraggingCube) return;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    cubeRotateY += deltaX * 0.6;
    cubeRotateX -= deltaY * 0.6;

    startX = clientX;
    startY = clientY;

    updateCubeTransform();
  }

  function handleDragEnd() {
    isDraggingCube = false;
  }

  // Mouse events
  viewport.addEventListener('mousedown', (e) => handleDragStart(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => handleDragMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', handleDragEnd);

  // Touch events
  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDraggingCube) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('touchend', handleDragEnd);

  // Idle Auto-Rotation Loop
  function cubeLoop() {
    if (autoRotateCube && !isDraggingCube) {
      cubeRotateY += 0.45;
      updateCubeTransform();
    }
    requestAnimationFrame(cubeLoop);
  }
  cubeLoop();
}

function updateCubeTransform() {
  const cube = document.getElementById('cube-3d');
  if (cube) {
    cube.style.transform = `rotateX(${cubeRotateX}deg) rotateY(${cubeRotateY}deg)`;
  }
}

function rotateCubeTo(face) {
  autoRotateCube = false;
  updateAutoRotateButtonState();

  const faceAngles = {
    front: { x: 0, y: 0 },
    back: { x: 0, y: 180 },
    right: { x: 0, y: -90 },
    left: { x: 0, y: 90 },
    top: { x: -90, y: 0 },
    bottom: { x: 90, y: 0 }
  };

  const target = faceAngles[face] || { x: 0, y: 0 };
  cubeRotateX = target.x;
  cubeRotateY = target.y;
  updateCubeTransform();

  // Update active state on buttons
  const buttons = document.querySelectorAll('.cube-btn');
  buttons.forEach(btn => {
    if (btn.textContent.toLowerCase().includes(face)) {
      btn.classList.add('active');
    } else if (!btn.id.includes('autorotate')) {
      btn.classList.remove('active');
    }
  });
}

function toggleCubeAutoRotate() {
  autoRotateCube = !autoRotateCube;
  updateAutoRotateButtonState();
}

function updateAutoRotateButtonState() {
  const btn = document.getElementById('cube-autorotate-btn');
  if (btn) {
    if (autoRotateCube) {
      btn.innerHTML = '<i class="fa-solid fa-rotate"></i> Auto-Rotate: ON';
      btn.classList.add('active');
    } else {
      btn.innerHTML = '<i class="fa-solid fa-pause"></i> Auto-Rotate: OFF';
      btn.classList.remove('active');
    }
  }
}

/* ==========================================================================
   4. DYNAMIC TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const typedTarget = document.getElementById('typed-text');
  if (!typedTarget) return;

  const roles = [
    '3D Interactive Web Experiences',
    'Full Stack Web Applications',
    'Modern React & Node.js Systems',
    'Secure Banking & Fintech Solutions',
    'Digital Agriculture & Supply Chains',
    'Scalable PostgreSQL & RESTful APIs'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 75;
  const deleteSpeed = 35;
  const holdDelay = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = holdDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   5. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link detection
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('active');
    });
  });
}

/* ==========================================================================
   7. PROJECT FILTERING
   ========================================================================== */
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   8. PROJECT DETAILS & SCREENSHOT MODAL
   ========================================================================== */
const projectData = {
  agrilink: {
    title: 'AgriLink Coffee Hub',
    tagline: 'Ethiopian Specialty Coffee Supply Chain & Marketplace Platform',
    mainImage: 'agrilink.jpg',
    description: `AgriLink Coffee Hub is an enterprise-grade digital marketplace engineered to streamline and digitize Ethiopia's renowned coffee export ecosystem. It establishes transparent trade relations between rural coffee smallholders, washing station cooperatives (Yirgacheffe, Sidama), and international green coffee buyers.`,
    highlights: [
      'Interactive Green Bean Traceability Map with regional provenance tracking (Yirgacheffe, Sidama, Guji).',
      'Real-Time Ethiopian Coffee Price Index and Arabica auction market trends.',
      'Farmer and cooperative profiles with cupping score metrics (88.0 - 89.5+ Specialty Lots).',
      'Inventory logistics tracking from washing station warehouses to Djibouti port exports.',
      'Built with React.js, Node.js, Express, PostgreSQL relational schema, and Tailwind CSS.'
    ],
    github: 'https://github.com/Yohanan7n/AgriLink_Coffee_Hub',
    screens: [
      { name: 'Marketplace Overview', src: 'agrilink.jpg' }
    ]
  },
  banking: {
    title: 'Fintech Digital Banking & Admin Suite',
    tagline: 'Dual-Surface Financial Platform: Customer Banking & Executive Admin Management',
    mainImage: 'assets/banking/banking_admin_overview.png',
    description: `A full-stack banking ecosystem featuring both a modern customer portal for day-to-day financial operations and a high-security administrative management console with liquidity monitoring, user credential controls, and transaction auditing.`,
    highlights: [
      'Customer Banking Interface: Real-time balance checking ($500.00), money transfers, deposit workflows, and detailed transaction ledger ("Transfer to Yohanan Fantahun").',
      'Executive Admin Console: Real-time Vault Total Reserves tracking ($107,700.00 Liquidity Pool), Active Accounts counter, and Global Ledger transactions.',
      'User Credential Administration: Instant balance adjustments, password resets, role promotions (Make Admin), and account revocation.',
      'Engineered with React / React Native, TypeScript, Node.js, Express backend, Prisma ORM, and PostgreSQL.'
    ],
    github: 'https://github.com/Yohanan7n',
    screens: [
      { name: 'Admin Console & Reserves', src: 'assets/banking/banking_admin_overview.png' },
      { name: 'Customer Login Portal', src: 'assets/banking/banking_login.png' },
      { name: 'User Management & Balance Controls', src: 'assets/banking/banking_accounts_management.png' },
      { name: 'Customer Balance & Transactions', src: 'assets/banking/banking_customer_dash.png' },
      { name: 'Admin Dashboard Actions', src: 'assets/banking/banking_admin_console.png' }
    ]
  },
  currencyx: {
    title: 'CurrencyX — Real-Time FX Converter',
    tagline: 'Multi-Currency Foreign Exchange Engine & Trend Analytics',
    mainImage: 'currencyx.jpg',
    description: `CurrencyX delivers instantaneous foreign exchange calculations paired with rich market data visualization. Designed for travelers, businesses, and traders monitoring live rates like USD/ETB (Ethiopian Birr), EUR, and GBP.`,
    highlights: [
      'Instant currency conversion calculation with live exchange rate integration.',
      'Interactive candlestick charts with time-range filtering (1D, 1W, 1M, 6M, 1Y).',
      'Watchlist with dynamic trend micro-charts and quick popular currency pairs (USD/EUR, GBP/USD).',
      'Clean dark burgundy glassmorphism UI optimized for high-frequency interaction and mobile responsiveness.'
    ],
    github: 'https://github.com/Yohanan7n',
    screens: [
      { name: 'Converter & Chart Dashboard', src: 'currencyx.jpg' }
    ]
  }
};

function openProjectModal(projectId) {
  const project = projectData[projectId];
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');

  // Build screens tabs if multiple exist
  let galleryTabsHtml = '';
  if (project.screens && project.screens.length > 1) {
    galleryTabsHtml = `
      <div class="modal-gallery-tabs">
        ${project.screens.map((screen, idx) => `
          <button class="gallery-tab-btn ${idx === 0 ? 'active' : ''}" onclick="switchModalScreen(this, '${screen.src}')">
            ${screen.name}
          </button>
        `).join('')}
      </div>
    `;
  }

  modalContent.innerHTML = `
    <img src="${project.mainImage}" alt="${project.title}" class="modal-project-img" id="modal-active-img">
    ${galleryTabsHtml}
    <h3 class="modal-title">${project.title}</h3>
    <div class="modal-tagline">${project.tagline}</div>
    <p class="modal-description">${project.description}</p>
    
    <div class="modal-highlights">
      <h4>Key Architectural & Feature Highlights</h4>
      <ul>
        ${project.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>

    <div class="modal-actions">
      <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        <i class="fa-brands fa-github"></i>
        <span>Explore GitHub Repository</span>
      </a>
      <button class="btn btn-outline" onclick="closeProjectModalDirect()">
        <span>Close Preview</span>
      </button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function switchModalScreen(button, src) {
  const activeImg = document.getElementById('modal-active-img');
  if (activeImg) {
    activeImg.src = src;
  }
  const tabs = document.querySelectorAll('.gallery-tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  button.classList.add('active');
}

function closeProjectModal(event) {
  if (event.target.id === 'project-modal') {
    closeProjectModalDirect();
  }
}

function closeProjectModalDirect() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModalDirect();
  }
});

/* ==========================================================================
   9. CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function copyToClipboard(text, customMessage) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(customMessage || 'Copied to clipboard!');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(customMessage || 'Copied to clipboard!');
  });
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   10. CONTACT FORM SUBMISSION
   ========================================================================== */
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all required fields.');
    return;
  }

  const submitBtn = document.getElementById('form-submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing message...';

  const mailtoLink = `mailto:yohananfantahun7@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Hi Yohanan,\n\nMy name is ${name} (${email}).\n\n${message}`)}`;

  setTimeout(() => {
    window.location.href = mailtoLink;
    showToast(`Thank you, ${name}! Opening your email client to send.`);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    form.reset();
  }, 600);
}
