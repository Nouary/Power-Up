// Orange particles background for hero section
(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let mouse = { x: null, y: null, active: false };

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  // Particle config
  const PARTICLE_COLOR = 'rgba(255,140,0,0.18)';
  const LINE_COLOR = 'rgba(255,140,0,0.10)';
  const MOUSE_LINE_COLOR = 'rgba(255,140,0,0.22)';
  const PARTICLE_RADIUS = 2.2;
  const LINE_DISTANCE = 120;
  const MOUSE_DISTANCE = 140;
  const particles = [];
  let PARTICLE_COUNT;

  function randomVel() {
    return (Math.random() - 0.5) * 0.7;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: randomVel(),
      vy: randomVel(),
      r: PARTICLE_RADIUS + Math.random() * 1.2
    };
  }

  function initParticles() {
    particles.length = 0;
    PARTICLE_COUNT = Math.floor((width * height) / 6000) || 32;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function updateParticles() {
    for (const p of particles) {
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DISTANCE) {
          const force = (MOUSE_DISTANCE - dist) / MOUSE_DISTANCE * 0.04;
          p.vx += force * dx / dist;
          p.vy += force * dy / dist;
        }
      }
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DISTANCE) {
          ctx.strokeStyle = LINE_COLOR;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (mouse.active && mouse.x !== null && mouse.y !== null) {
      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DISTANCE) {
          ctx.strokeStyle = MOUSE_LINE_COLOR;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fillStyle = PARTICLE_COLOR;
      ctx.shadowColor = 'orange';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function animate() {
    updateParticles();
    drawParticles();
    requestAnimationFrame(animate);
  }

  function reset() {
    resizeCanvas();
    initParticles();
  }

  window.addEventListener('resize', reset);
  reset();
  animate();

  // Mouse events
  window.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  window.addEventListener('mouseout', function() {
    mouse.active = false;
    mouse.x = null;
    mouse.y = null;
  });
})();

// Animate the hero logo in a slow, disorderly (random) path
(function() {
  const logo = document.getElementById('animated-logo');
  if (!logo) return;

  const minX = -60, maxX = 120;
  const minY = 10, maxY = 70;
  const minR = -24, maxR = 24;

  let target = { x: 0, y: 0, r: 0 };
  let current = { x: 0, y: 0, r: -18 };
  let lastTime = 0;

  function pickNewTarget() {
    target.x = minX + Math.random() * (maxX - minX);
    target.y = minY + Math.random() * (maxY - minY);
    target.r = minR + Math.random() * (maxR - minR);
  }

  function animateLogo(ts) {
    if (!lastTime || ts - lastTime > 4000) {
      pickNewTarget();
      lastTime = ts;
    }
    current.x += (target.x - current.x) * 0.008;
    current.y += (target.y - current.y) * 0.008;
    current.r += (target.r - current.r) * 0.008;
    logo.style.left = `${current.x}px`;
    logo.style.top = `calc(50% + ${current.y}px)`;
    logo.style.transform = `translateY(-50%) rotate(${current.r}deg) scale(1.08)`;
    requestAnimationFrame(animateLogo);
  }

  pickNewTarget();
  requestAnimationFrame(animateLogo);
})();

// Navigation menu toggle for mobile
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const body = document.body;

  function closeMenu() {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    body.classList.remove('nav-open');
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      mainNav.classList.toggle('open');
      navToggle.classList.toggle('open');
      body.classList.toggle('nav-open');
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function(e) {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    });

    mainNav.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
});
