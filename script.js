feather.replace();

// 1. Theme Engine
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) setTheme(savedTheme);

// 2. Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}

// 3. Lenis Smooth Scroll Engine + Scroll Progress Tracker
const progressBar = document.getElementById('scroll-progress-bar');
const lenis = new Lenis({
  duration: 0.8,
  smoothWheel: true,
  wheelMultiplier: 0.9
});

lenis.on('scroll', (e) => {
  ScrollTrigger.update();
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / totalScroll) * 100;
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
});
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// 4. Active Navigation Link Tracker
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('text-blue-400', 'font-bold');
    if (link.getAttribute('data-section') === current) {
      link.classList.add('text-blue-400', 'font-bold');
    }
  });
});

// 5. GSAP Sticky Hero Hardware Disassembly
gsap.registerPlugin(ScrollTrigger);
const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "+=1800",
    pin: true,
    scrub: 0.6,
    anticipatePin: 1,
  }
});

heroTl
  .to("#hero-title", { scale: 0.6, opacity: 0.2, y: -60, ease: "power1.inOut" }, 0)
  .to("#hero-subtitle", { opacity: 0, y: -30, ease: "power1.inOut" }, 0)
  .fromTo("#layer-chassis", { rotateX: 0, rotateY: 0, z: 0, scale: 1, opacity: 0.9 }, { rotateX: 25, rotateY: -15, z: -250, scale: 1.15, opacity: 0.35, ease: "power1.out" }, 0)
  .fromTo("#layer-pcb", { rotateX: 0, rotateY: 0, z: 0, scale: 0.95, opacity: 0.5 }, { rotateX: 28, rotateY: -12, z: 50, x: -40, y: 30, scale: 1, opacity: 0.9, ease: "power1.out" }, 0.1)
  .fromTo("#layer-chip", { rotateX: 0, rotateY: 0, z: 0, scale: 0.7, opacity: 0 }, { rotateX: 20, rotateY: -10, z: 320, x: 80, y: -20, scale: 1.25, opacity: 1, ease: "power2.out" }, 0.2)
  .fromTo("#layer-cooler", { rotateX: 0, rotateY: 0, z: 0, scale: 0.8, opacity: 0 }, { rotateX: 35, rotateY: -20, z: 450, x: -70, y: -90, scale: 1.05, opacity: 0.75, ease: "power2.out" }, 0.3);


// ==========================================
// 6. 3D HARDWARE INSPECTION ENGINE (CROSS-BROWSER)
// ==========================================
let isInspectActive = false;
const heroStage = document.getElementById('hero-stage');
const inspectBtnText = document.getElementById('inspect-btn-text');
const inspectIcon = document.getElementById('inspect-icon');

let isDraggingStage = false;
let startPointerX = 0;
let startPointerY = 0;
let stageRotX = 0;
let stageRotY = 0;

function toggleHardwareInspect() {
  isInspectActive = !isInspectActive;
  
  if (isInspectActive) {
    heroStage.classList.add('inspect-active');
    inspectBtnText.innerText = "Exit 3D Inspection Mode";
    if (inspectIcon) inspectIcon.setAttribute('data-feather', 'x');
    feather.replace();
    heroTl.pause();
  } else {
    heroStage.classList.remove('inspect-active');
    inspectBtnText.innerText = "Enable 3D Drag Inspection";
    if (inspectIcon) inspectIcon.setAttribute('data-feather', 'move');
    feather.replace();
    
    isDraggingStage = false;
    stageRotX = 0;
    stageRotY = 0;
    
    gsap.to(heroStage, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        heroStage.style.transform = "";
        heroTl.resume();
        ScrollTrigger.refresh();
      }
    });
  }
}

// Universal Pointer Events (Brave + Safari + Chrome + Firefox)
heroStage.addEventListener('pointerdown', (e) => {
  if (!isInspectActive) return;
  e.preventDefault(); // Blocks Chromium native dragstart glitch
  isDraggingStage = true;
  startPointerX = e.clientX;
  startPointerY = e.clientY;
  heroStage.setPointerCapture(e.pointerId); // Locks pointer track to container
});

heroStage.addEventListener('pointermove', (e) => {
  if (!isInspectActive || !isDraggingStage) return;
  e.preventDefault();
  
  const deltaX = e.clientX - startPointerX;
  const deltaY = e.clientY - startPointerY;
  
  stageRotY += deltaX * 0.35;
  stageRotX -= deltaY * 0.35;
  
  // Clamping prevents inverting inside out
  stageRotX = Math.max(-65, Math.min(65, stageRotX));
  stageRotY = Math.max(-65, Math.min(65, stageRotY));
  
  heroStage.style.transform = `perspective(1200px) rotateX(${stageRotX}deg) rotateY(${stageRotY}deg)`;
  startPointerX = e.clientX;
  startPointerY = e.clientY;
});

function endStageDrag(e) {
  if (isDraggingStage) {
    isDraggingStage = false;
    try {
      heroStage.releasePointerCapture(e.pointerId);
    } catch(err) {}
  }
}

heroStage.addEventListener('pointerup', endStageDrag);
heroStage.addEventListener('pointercancel', endStageDrag);

// 7. 3D Gyroscopic Device Orientation for Mobile
if (window.DeviceOrientationEvent && ('ontouchstart' in window) && window.innerWidth < 768) {
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma === null || e.beta === null) return;
    const gamma = Math.min(Math.max(e.gamma, -30), 30);
    const beta = Math.min(Math.max(e.beta - 45, -30), 30);
    
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.style.transform = `perspective(1000px) rotateX(${beta / 2}deg) rotateY(${gamma / 2}deg)`;
    });
  });
}

// 8. Anime.js Motion Lab Animations
anime({
  targets: '.svg-polygon, .svg-circle',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 3500,
  delay: function(el, i) { return i * 250 },
  direction: 'alternate',
  loop: true
});

anime({
  targets: '.spring-box',
  translateY: [-20, 20],
  rotate: function() { return anime.random(-15, 15); },
  borderRadius: ['25%', '50%', '25%'],
  duration: 1800,
  direction: 'alternate',
  loop: true,
  easing: 'easeInOutQuad',
  delay: anime.stagger(200)
});

const orbitTl = anime.timeline({ loop: true });
orbitTl.add({
  targets: '.orbit-node',
  rotate: 360,
  translateX: [0, 45, 0],
  translateY: [0, -45, 0],
  scale: [1, 1.3, 1],
  duration: 3000,
  easing: 'easeInOutSine',
  delay: anime.stagger(400)
});

function triggerOrbitExplosion() {
  anime({
    targets: '.orbit-node',
    scale: [1, 2.5, 1],
    translateX: [0, anime.random(-80, 80)],
    translateY: [0, anime.random(-80, 80)],
    duration: 800,
    easing: 'easeOutElastic(1, .5)'
  });
  anime({
    targets: '.orbit-center',
    scale: [1, 1.8, 1],
    duration: 400,
    easing: 'easeInOutQuad'
  });
}

// 9. Kinetic Text Highlighter
gsap.utils.toArray('.highlight-text').forEach((textEl) => {
  gsap.fromTo(textEl, 
    { color: "rgba(255, 255, 255, 0.15)" },
    {
      color: "#ffffff",
      scrollTrigger: {
        trigger: textEl,
        start: "top 75%",
        end: "bottom 45%",
        scrub: 0.5,
      }
    }
  );
});

// 10. Horizontal Scroll Project Slider
const track = document.getElementById("projects-track");
gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: "#projects-pin",
    start: "top top",
    end: () => "+=" + (track.scrollWidth - window.innerWidth),
    pin: true,
    scrub: 0.8,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  }
});

// 11. Mouse Parallax Tilt & Spotlight Effect Engine
document.querySelectorAll('.tilt-card').forEach(card => {
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';

  card.onmousemove = function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Flashlight positioning
    this.style.setProperty('--mouse-x', `${x}px`);
    this.style.setProperty('--mouse-y', `${y}px`);

    // Degree calculations
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (((y - centerY) / centerY) * -12).toFixed(2);
    const rotateY = (((x - centerX) / centerX) * 12).toFixed(2);

    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  card.onmouseleave = function() {
    this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };
});

// Flashlight effect for non-tilt cards
document.querySelectorAll('.card-glass:not(.tilt-card)').forEach(card => {
  card.onmousemove = function(e) {
    const rect = this.getBoundingClientRect();
    this.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    this.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };
});

// 12. Matrix Rain Easter Egg
let matrixInterval = null;
function toggleMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  
  if (matrixInterval) {
    clearInterval(matrixInterval);
    matrixInterval = null;
    canvas.classList.add('opacity-0');
    return;
  }

  canvas.classList.remove('opacity-0');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  const characters = "01EDWIENJANAKANXYZ789";
  const fontSize = 12;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  matrixInterval = setInterval(() => {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#60a5fa';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }, 40);
}

// 13. Tic-Tac-Toe Game State in Terminal
let tttBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
let isPlayingTTT = false;

function printTTTBoard() {
  return `<br/>${tttBoard[0]} | ${tttBoard[1]} | ${tttBoard[2]}<br/>---------<br/>${tttBoard[3]} | ${tttBoard[4]} | ${tttBoard[5]}<br/>---------<br/>${tttBoard[6]} | ${tttBoard[7]} | ${tttBoard[8]}<br/>Type 'move 0-8' to play!`;
}

// 14. Terminal Command Handler
function handleTerminalSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('term-input');
  const output = document.getElementById('terminal-output');
  const val = input.value.trim().toLowerCase();
  
  const userLine = document.createElement('div');
  userLine.innerHTML = `<span class="text-blue-400">❯</span> ${input.value}`;
  output.appendChild(userLine);

  const resp = document.createElement('div');
  resp.className = "text-neutral-300 text-xs";

  if (val.startsWith('move ') && isPlayingTTT) {
    const pos = parseInt(val.split(' ')[1]);
    if (!isNaN(pos) && pos >= 0 && pos <= 8 && tttBoard[pos] === " ") {
      tttBoard[pos] = "X";
      const emptySpots = tttBoard.map((v, i) => v === " " ? i : null).filter(v => v !== null);
      if (emptySpots.length > 0) {
        const botMove = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        tttBoard[botMove] = "O";
      }
      resp.innerHTML = printTTTBoard();
    } else {
      resp.innerHTML = "Invalid move spot. Choose an empty spot from 0 to 8.";
    }
  } else {
    switch (val) {
      case 'help':
        resp.innerHTML = "Commands: <span class='text-white'>skills</span>, <span class='text-white'>projects</span>, <span class='text-white'>matrix</span>, <span class='text-white'>tictactoe</span>, <span class='text-white'>theme [blue/cyber/minimal]</span>, <span class='text-white'>sound [freq]</span>, <span class='text-white'>clear</span>";
        break;
      case 'matrix':
        toggleMatrixRain();
        resp.innerHTML = "Toggled Matrix neural stream rain overlay.";
        break;
      case 'tictactoe':
        isPlayingTTT = true;
        tttBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
        resp.innerHTML = "Starting Tic-Tac-Toe vs Edwien AI:" + printTTTBoard();
        break;
      case 'theme blue':
        setTheme('default');
        resp.innerHTML = "Active theme set to Azure Blue.";
        break;
      case 'theme cyber':
        setTheme('cyber');
        resp.innerHTML = "Active theme set to Cyber Neon.";
        break;
      case 'theme minimal':
        setTheme('minimal');
        resp.innerHTML = "Active theme set to Monochrome Minimal.";
        break;
      case 'sound':
        playHapticClick(880, 0.2, 'sawtooth');
        resp.innerHTML = "Synthesized 880Hz test frequency tone.";
        break;
      case 'skills':
        resp.innerHTML = "• Systems: C, C++, TypeScript, JavaScript, MQL5<br/>• Web & 3D: Next.js, Tailwind, GSAP, Anime.js, WebGL<br/>• OS & Tools: macOS, Linux, Vim, Git";
        break;
      case 'projects':
        resp.innerHTML = "1. Algorithmic Execution Core<br/>2. Modern Architectural Studio<br/>3. Kinetic Vector Studio";
        break;
      case 'clear':
        output.innerHTML = "";
        input.value = "";
        return;
      default:
        resp.innerHTML = `Command not recognized: '${val}'. Type 'help' for options.`;
    }
  }

  output.appendChild(resp);
  output.scrollTop = output.scrollHeight;
  input.value = "";
}

// 15. Case Study Modal Data
const projectData = {
  1: {
    badge: "QUANTITATIVE TRADING ENGINE",
    title: "Algorithmic Execution Core",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1200&auto=format&fit=crop",
    desc: "Designed and engineered for lightning-fast signal evaluation on Gold and crypto markets. Features sub-millisecond execution loops, automated order safety brackets, and real-time tick streaming.",
    specs: "• Core: MQL5 & C++<br/>• Strategy: Volatility Scalping Engine<br/>• Deployment: Low-Latency VPS",
    code: `// MQL5 High-Frequency Tick Execution Loop
void OnTick() {
    MqlTick latestTick;
    if(!SymbolInfoTick(_Symbol, latestTick)) return;
    
    double spread = (latestTick.ask - latestTick.bid) / _Point;
    if(spread <= MAX_ALLOWED_SPREAD) {
        EvaluateLatencyArbitrage(latestTick);
    }
}`
  },
  2: {
    badge: "SPATIAL COMPUTING & 3D",
    title: "Modern Architectural Studio",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    desc: "An interactive spatial layout visualizer built to present luxury coastal resort developments. Incorporates real-time sun/shadow simulations, interactive floorplan toggles, and smooth camera path interpolations.",
    specs: "• Engine: Three.js / WebGL<br/>• Styling: Tailwind CSS & Framer Physics<br/>• Features: Dynamic CAD Wireframing",
    code: `// Three.js Dynamic Sunlight & Shadow Interpolation
const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;

function updateSunAngle(timeOfDay) {
    const angle = (timeOfDay / 24) * Math.PI * 2;
    sunLight.position.set(Math.cos(angle) * 100, Math.sin(angle) * 80, 50);
}`
  },
  3: {
    badge: "KINETIC EXPERIMENTS",
    title: "Kinetic Vector Studio",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    desc: "A GPU-accelerated motion engine that calculates dynamic distance vectors across a 225-node grid with zero frame stuttering.",
    specs: "• Engines: Anime.js & GSAP ScrollTrigger<br/>• Rendering: HTML5 Canvas<br/>• Refresh Rate: Native 120Hz Support",
    code: `// Particle Distance Vector Calculation
function computeNodeDistances(cursorX, cursorY, nodes) {
    nodes.forEach(node => {
        const dx = cursorX - node.x;
        const dy = cursorY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        node.scale = Math.max(0.5, 2.0 - dist / 150);
    });
}`
  }
};

function openCaseStudy(id) {
  const p = projectData[id];
  document.getElementById('case-badge').innerText = p.badge;
  document.getElementById('case-title').innerText = p.title;
  document.getElementById('case-desc').innerText = p.desc;
  document.getElementById('case-specs').innerHTML = p.specs;
  document.getElementById('case-code-snippet').innerText = p.code;
  document.getElementById('case-modal-image').style.backgroundImage = `url('${p.image}')`;
  
  switchCaseTab('overview');
  document.getElementById('case-modal').classList.remove('opacity-0', 'pointer-events-none');
}

function closeCaseStudy() {
  document.getElementById('case-modal').classList.add('opacity-0', 'pointer-events-none');
}

function handleCaseModalBackdropClick(e) {
  const card = document.getElementById('case-modal-card');
  if (!card.contains(e.target)) closeCaseStudy();
}

function handleEmailModalBackdropClick(e) {
  const card = document.getElementById('email-modal-card');
  if (!card.contains(e.target)) closeEmailModal();
}

function switchCaseTab(tab) {
  const overviewBtn = document.getElementById('tab-overview');
  const codeBtn = document.getElementById('tab-code');
  const overviewContent = document.getElementById('case-content-overview');
  const codeContent = document.getElementById('case-content-code');

  if (tab === 'overview') {
    overviewBtn.className = "px-3 py-1 rounded-lg bg-blue-600 text-white transition";
    codeBtn.className = "px-3 py-1 rounded-lg text-neutral-400 hover:text-white transition";
    overviewContent.classList.remove('hidden');
    codeContent.classList.add('hidden');
  } else {
    codeBtn.className = "px-3 py-1 rounded-lg bg-blue-600 text-white transition";
    overviewBtn.className = "px-3 py-1 rounded-lg text-neutral-400 hover:text-white transition";
    overviewContent.classList.add('hidden');
    codeContent.classList.remove('hidden');
  }
}

function toggleBlueprintMode() {
  document.body.classList.toggle('blueprint-mode');
}

// 16. Email Modal Handling
function openEmailModal() {
  document.getElementById('email-modal').classList.remove('opacity-0', 'pointer-events-none');
}

function closeEmailModal() {
  document.getElementById('email-modal').classList.add('opacity-0', 'pointer-events-none');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeEmailModal();
    closeCaseStudy();
    if (isInspectActive) toggleHardwareInspect();
  }
});

// Dynamic Runtime Assembly to protect against scrapers
function openSecureWhatsApp() {
  const p1 = "9474";
  const p2 = "328";
  const p3 = "7586";
  const msg = encodeURIComponent("Hi Edwien, I saw your portfolio!");
  const targetUrl = `https://wa.me/${p1}${p2}${p3}?text=${msg}`;
  window.open(targetUrl, '_blank', 'noopener,noreferrer');
}

async function handleSendEmail(e) {
  e.preventDefault();

  // Honeypot check: If filled, silently drop bot
  const botTrap = document.getElementById('honeypot-check').value;
  if (botTrap.length > 0) {
    closeEmailModal();
    return;
  }

  const name = document.getElementById('sender-name').value;
  const subject = document.getElementById('email-subject').value;
  const message = document.getElementById('email-body').value;

  const u = "10ethevachchandran";
  const d = "gmail";
  const tld = "com";
  const recipient = `${u}@${d}.${tld}`;

  const formattedBody = `Name: ${name}\n\nMessage:\n${message}`;
  const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formattedBody)}`;
  
  window.location.href = mailtoUrl;
  closeEmailModal();
}

// 17. Synthesized Web Audio Haptics
let audioEnabled = true;
let audioCtx = null;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playHapticClick(frequency = 600, duration = 0.03, type = "sine") {
  if (!audioEnabled) return;
  try {
    initAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function toggleAudioFeedback() {
  audioEnabled = !audioEnabled;
  const icon = document.getElementById('sound-icon');
  if (audioEnabled) {
    icon.setAttribute('data-feather', 'volume-2');
    playHapticClick(800, 0.05, 'triangle');
  } else {
    icon.setAttribute('data-feather', 'volume-x');
  }
  feather.replace();
}

document.addEventListener('click', (e) => {
  if (e.target.closest('button, a, .tilt-card, input, textarea')) {
    playHapticClick(700, 0.04, 'triangle');
  }
});

// 18. Magnetic Fluid Cursor with Window Leave/Enter
const cursorDot = document.getElementById('custom-cursor-dot');
const cursorRing = document.getElementById('custom-cursor-ring');

if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorRing) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMouseInside = false;

  window.addEventListener('mousemove', (e) => {
    if (!isMouseInside) {
      isMouseInside = true;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  document.addEventListener('mouseleave', () => {
    isMouseInside = false;
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    isMouseInside = true;
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const hoverElements = 'a, button, .tilt-card, input, textarea, [onclick]';
  document.querySelectorAll(hoverElements).forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
  });
}