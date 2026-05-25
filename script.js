const canvas = document.getElementById("particles");
const context = canvas.getContext("2d");
const gift = document.getElementById("gift");
const openLetter = document.getElementById("openLetter");
const bloomButton = document.getElementById("bloomButton");

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
  const count = Math.min(Math.floor((width * height) / 11000), 120);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.1 + 0.5,
    speedX: (Math.random() - 0.5) * 0.22,
    speedY: -0.06 - Math.random() * 0.18,
    alpha: 0.18 + Math.random() * 0.5,
    color: Math.random() > 0.58 ? "215, 184, 255" : Math.random() > 0.28 ? "255, 155, 214" : "154, 108, 255",
    pulse: Math.random() * Math.PI * 2,
  }));
}

function animate(time) {
  context.clearRect(0, 0, width, height);

  for (const particle of particles) {
    const pulse = Math.sin(time * 0.002 + particle.pulse) * 0.24 + 0.76;

    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.y < -10) particle.y = height + 10;
    if (particle.x < -10) particle.x = width + 10;
    if (particle.x > width + 10) particle.x = -10;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius * pulse, 0, Math.PI * 2);
    context.fillStyle = `rgba(${particle.color}, ${particle.alpha * pulse})`;
    context.shadowColor = `rgba(${particle.color}, 0.8)`;
    context.shadowBlur = 13;
    context.fill();
  }

  requestAnimationFrame(animate);
}

openLetter.addEventListener("click", () => {
  gift.classList.add("is-open");
});

bloomButton.addEventListener("click", () => {
  gift.classList.add("flowers-open");
  bloomButton.disabled = true;
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(animate);
