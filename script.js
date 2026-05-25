const canvas = document.getElementById("particles");
const context = canvas.getContext("2d");
const openButton = document.getElementById("openButton");
const bloomScene = document.getElementById("bloomScene");

let width = 0;
let height = 0;
let particles = [];
let isOpened = false;
let sparkleBurstUntil = 0;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles();
}

function createParticles() {
  const count = Math.min(Math.floor((width * height) / 10500), 115);
  particles = Array.from({ length: count }, () => makeParticle(false));
}

function makeParticle(fromCenter) {
  const angle = Math.random() * Math.PI * 2;
  const burst = fromCenter ? 18 + Math.random() * 80 : 0;

  return {
    x: fromCenter ? width / 2 + Math.cos(angle) * burst : Math.random() * width,
    y: fromCenter ? height / 2 + Math.sin(angle) * burst : Math.random() * height,
    radius: Math.random() * 2.2 + 0.45,
    speedX: (Math.random() - 0.5) * (fromCenter ? 1.25 : 0.18),
    speedY: (Math.random() - 0.5) * (fromCenter ? 1.25 : 0.18) - 0.08,
    alpha: Math.random() * 0.52 + 0.18,
    hue: Math.random() > 0.55 ? "rose" : Math.random() > 0.36 ? "violet" : "silver",
    pulse: Math.random() * Math.PI * 2,
    twinkle: Math.random() * 0.018 + 0.006,
  };
}

function particleColor(particle, alpha) {
  const colors = {
    rose: `rgba(255, 143, 199, ${alpha})`,
    violet: `rgba(155, 108, 255, ${alpha})`,
    silver: `rgba(232, 235, 255, ${alpha})`,
  };

  return colors[particle.hue];
}

function drawParticle(particle, time) {
  const pulse = Math.sin(time * particle.twinkle + particle.pulse) * 0.28 + 0.72;
  const boosted = isOpened ? 1.22 : 1;
  const alpha = Math.min(particle.alpha * pulse * boosted, 0.95);

  context.beginPath();
  context.arc(particle.x, particle.y, particle.radius * pulse, 0, Math.PI * 2);
  context.fillStyle = particleColor(particle, alpha);
  context.shadowColor = particleColor(particle, 0.9);
  context.shadowBlur = isOpened ? 16 : 9;
  context.fill();
}

function updateParticle(particle) {
  const drift = isOpened ? 1.36 : 1;
  particle.x += particle.speedX * drift;
  particle.y += particle.speedY * drift;

  if (particle.y < -10) particle.y = height + 10;
  if (particle.y > height + 10) particle.y = -10;
  if (particle.x < -10) particle.x = width + 10;
  if (particle.x > width + 10) particle.x = -10;
}

function drawHalo(time) {
  if (!isOpened) return;

  const progress = Math.min((performance.now() - sparkleBurstUntil + 1800) / 1800, 1);
  const pulse = Math.sin(time * 0.0015) * 0.08 + 0.92;
  const gradient = context.createRadialGradient(
    width / 2,
    height / 2,
    10,
    width / 2,
    height / 2,
    Math.min(width, height) * 0.42 * pulse
  );

  gradient.addColorStop(0, `rgba(255, 143, 199, ${0.12 * progress})`);
  gradient.addColorStop(0.46, `rgba(155, 108, 255, ${0.08 * progress})`);
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function animate(time) {
  context.clearRect(0, 0, width, height);
  drawHalo(time);

  for (const particle of particles) {
    updateParticle(particle);
    drawParticle(particle, time);
  }

  requestAnimationFrame(animate);
}

function launchBloom() {
  if (isOpened) return;

  isOpened = true;
  document.body.classList.add("opened");
  bloomScene.setAttribute("aria-hidden", "false");
  openButton.setAttribute("disabled", "true");
  sparkleBurstUntil = performance.now() + 1800;

  particles.push(...Array.from({ length: prefersReducedMotion ? 12 : 46 }, () => makeParticle(true)));

  window.setTimeout(() => {
    document.getElementById("finalMessage").focus?.();
  }, 5200);
}

openButton.addEventListener("click", launchBloom);

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(animate);
