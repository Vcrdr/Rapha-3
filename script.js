const canvas = document.getElementById("particles");
const context = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];

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
  const count = Math.min(Math.floor((width * height) / 12000), 100);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.2,
    speedY: -0.08 - Math.random() * 0.22,
    alpha: 0.2 + Math.random() * 0.55,
    color: Math.random() > 0.55 ? "37, 216, 255" : Math.random() > 0.28 ? "255, 143, 199" : "232, 235, 255",
    pulse: Math.random() * Math.PI * 2,
  }));
}

function animate(time) {
  context.clearRect(0, 0, width, height);

  for (const particle of particles) {
    const glow = Math.sin(time * 0.002 + particle.pulse) * 0.24 + 0.76;

    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.y < -10) particle.y = height + 10;
    if (particle.x < -10) particle.x = width + 10;
    if (particle.x > width + 10) particle.x = -10;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius * glow, 0, Math.PI * 2);
    context.fillStyle = `rgba(${particle.color}, ${particle.alpha * glow})`;
    context.shadowColor = `rgba(${particle.color}, 0.85)`;
    context.shadowBlur = 12;
    context.fill();
  }

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(animate);
