// Initialize Feather Icons
feather.replace();

// 1. Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}

// 2. Lenis Smooth Scroll Engine
const lenis = new Lenis({
  duration: 0.8,
  smoothWheel: true,
  wheelMultiplier: 0.9
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// 3. GSAP Sticky Hero Hardware Disassembly
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

// 4. Anime.js SVG Line Drawing Loop
anime({
  targets: '.svg-polygon, .svg-circle',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 3500,
  delay: function(el, i) { return i * 250 },
  direction: 'alternate',
  loop: true
});

// 5. Anime.js Spring Boxes
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

// 6. Anime.js Orbital System
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

// 7. Kinetic Text Highlighter
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

// 8. Horizontal Scroll Project Slider
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

// 9. 3D Mouse Parallax Tilt for Cards
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

// 10. Developer Terminal Execution Logic
function handleTerminalSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('term-input');
  const output = document.getElementById('terminal-output');
  const val = input.value.trim().toLowerCase();
  
  const userLine = document.createElement('div');
  userLine.innerHTML = `<span class="text-emerald-400">❯</span> ${input.value}`;
  output.appendChild(userLine);

  const resp = document.createElement('div');
  resp.className = "text-neutral-400 text-xs";

  switch (val) {
    case 'help':
      resp.innerHTML = "Available commands: <span class='text-white'>skills</span>, <span class='text-white'>projects</span>, <span class='text-white'>contact</span>, <span class='text-white'>blueprint</span>, <span class='text-white'>clear</span>";
      break;
    case 'skills':
      resp.innerHTML = "• Systems & Languages: C, C++, TypeScript, JavaScript, MQL5<br/>• Frontend: Next.js, Tailwind CSS, GSAP, Anime.js, WebGL<br/>• Hardware & Tools: macOS, Linux, Vim, Git";
      break;
    case 'projects':
      resp.innerHTML = "1. Algorithmic Execution Core (MQL5/C++)<br/>2. Modern Architectural Studio (WebGL/3D)<br/>3. Kinetic Vector Studio (GSAP/Physics)";
      break;
    case 'contact':
      resp.innerHTML = "Email: 10ethevachchandran@gmail.com | WhatsApp: +94 74 328 7586";
      break;
    case 'blueprint':
      toggleBlueprintMode();
      resp.innerHTML = "Blueprint wireframe mode toggled.";
      break;
    case 'clear':
      output.innerHTML = "";
      input.value = "";
      return;
    default:
      resp.innerHTML = `Command not found: '${val}'. Type 'help' for available commands.`;
  }
  
  output.appendChild(resp);
  output.scrollTop = output.scrollHeight;
  input.value = "";
}

// 11. Case Study Modal Data & Expander
const projectData = {
  1: {
    badge: "QUANTITATIVE TRADING ENGINE",
    title: "Algorithmic Execution Core",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1200&auto=format&fit=crop",
    desc: "Designed and engineered for lightning-fast signal evaluation on Gold and crypto markets. Features sub-millisecond execution loops, automated order safety brackets, and real-time tick streaming.",
    specs: "• Core: MQL5 & C++<br/>• Strategy: Volatility Scalping Engine<br/>• Deployment: Low-Latency Virtual Private Server"
  },
  2: {
    badge: "SPATIAL COMPUTING & 3D",
    title: "Modern Architectural Studio",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    desc: "An interactive spatial layout visualizer built to present luxury coastal resort developments. Incorporates real-time sun/shadow simulations, interactive floorplan toggles, and smooth camera path interpolations.",
    specs: "• Engine: Three.js / WebGL<br/>• Styling: Tailwind CSS & Framer Physics<br/>• Features: Dynamic CAD Wireframing"
  },
  3: {
    badge: "KINETIC EXPERIMENTS",
    title: "Kinetic Vector Studio",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    desc: "A GPU-accelerated motion engine that calculates dynamic distance vectors across a 225-node grid with zero frame stuttering.",
    specs: "• Engines: Anime.js & GSAP ScrollTrigger<br/>• Rendering: HTML5 Canvas & Hardware Accelerated Transforms<br/>• Refresh Rate: Native 120Hz Support"
  }
};

function openCaseStudy(id) {
  const p = projectData[id];
  document.getElementById('case-badge').innerText = p.badge;
  document.getElementById('case-title').innerText = p.title;
  document.getElementById('case-desc').innerText = p.desc;
  document.getElementById('case-specs').innerHTML = p.specs;
  document.getElementById('case-modal-image').style.backgroundImage = `url('${p.image}')`;
  document.getElementById('case-modal').classList.remove('opacity-0', 'pointer-events-none');
}

function closeCaseStudy() {
  document.getElementById('case-modal').classList.add('opacity-0', 'pointer-events-none');
}

function toggleBlueprintMode() {
  document.body.classList.toggle('blueprint-mode');
}

// 12. Email Modal Handling
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
  }
});

// Real Email Dispatcher via Web3Forms API
async function handleSendEmail(e) {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  const name = document.getElementById('sender-name').value;
  const subject = document.getElementById('email-subject').value;
  const message = document.getElementById('email-body').value;

  // Show sending state
  submitBtn.innerHTML = `<span>Sending...</span>`;
  submitBtn.disabled = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "0e509726-80c3-4d77-9985-e19e13b990b1", // <-- PASTE YOUR ACCESS KEY HERE
        name: name,
        subject: subject,
        message: message,
        from_name: "Portfolio Inquiry"
      }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Message sent successfully! Edwien will get back to you soon.");
      e.target.reset();
      closeEmailModal();
    } else {
      alert("Something went wrong. Please reach out via WhatsApp!");
    }
  } catch (error) {
    alert("Network error. Please try again or reach out on WhatsApp.");
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    feather.replace();
  }
}