// script.js
document.addEventListener("DOMContentLoaded", () => {
  const leavesContainer = document.getElementById("leaves-container");
  const numberOfLeaves = 25; // Adjusted based on screen size normally, 25 is a good number

  for (let i = 0; i < numberOfLeaves; i++) {
    createLeaf(leavesContainer);
  }

  initCountdown();
});

function initCountdown() {
  // Set the birthday target date here
  const targetDate = new Date("March 29, 2026 11:30:00").getTime();

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(timer);
      document.getElementById("days").innerText = "00";
      document.getElementById("hours").innerText = "00";
      document.getElementById("mins").innerText = "00";
      document.getElementById("secs").innerText = "00";
      launchConfetti();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("mins").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("secs").innerText = seconds.toString().padStart(2, '0');
  }, 1000);
}

// ─── Confetti System ───────────────────────────────────────────────────────────

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";

  const COLORS = [
    "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
    "#ff922b", "#cc5de8", "#40916c", "#f8961e",
    "#ffffff", "#74c69d", "#ffca3a"
  ];

  const PIECE_COUNT = 220;
  const pieces = [];

  for (let i = 0; i < PIECE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (Math.random() * 6 + 4), // upward bias
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      alpha: 1,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    });
  }

  const gravity  = 0.25;
  const friction = 0.99;
  let   frame    = 0;
  const maxFrames = 300; // ~5 s at 60 fps

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach((p) => {
      p.vy += gravity;
      p.vx *= friction;
      p.x  += p.vx;
      p.y  += p.vy;
      p.rotation += p.rotationSpeed;
      if (frame > maxFrames * 0.6) {
        p.alpha -= 0.012; // fade out in the last 40 % of the animation
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }

      ctx.restore();
    });

    frame++;
    if (frame < maxFrames) {
      requestAnimationFrame(draw);
    } else {
      // Clean up
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = "none";
    }
  }

  requestAnimationFrame(draw);

  // Also handle window resize while confetti is running
  window.addEventListener("resize", () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }, { once: true });
}

function createLeaf(container) {
  const leaf = document.createElement("div");
  leaf.classList.add("leaf");

  // SVG String for a leaf (encoded data URI form is used in CSS, but let's actually inject the SVG into HTML for better color control)
  leaf.innerHTML = `
    <svg viewBox="0 0 512 512" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M110.1,5.1C91.6-4.6,68,1.4,59.3,19.9L1.4,142.1c-8.7,18.5-2.7,42.1,15.8,51.8l122.2,57.9 c18.5,9.7,42.1,3.7,50.8-14.8l57.9-122.2c8.7-18.5,2.7-42.1-15.8-51.8L110.1,5.1z M52.7,143.7l46.7-98.3l98.3,46.7l-46.7,98.3 L52.7,143.7z"/>
      <path fill="currentColor" d="M495.6,356c-8.7-18.5-32.3-24.5-50.8-14.8l-122.2,57.9c-18.5,9.7-24.5,33.3-15.8,51.8L364.7,573 c8.7,18.5,32.3,24.5,50.8,14.8l122.2-57.9c18.5-9.7,24.5-33.3,15.8-51.8L495.6,356z M438.2,494.6l-98.3-46.7l46.7-98.3l98.3,46.7 L438.2,494.6z"/>
    </svg>
  `;

  // Randomize properties
  const size = Math.random() * 20 + 20; // 20px - 40px
  const leftPos = Math.random() * 100; // 0% - 100%
  const animationDuration = Math.random() * 10 + 10; // 10s - 20s
  const animationDelay = Math.random() * 5; // 0s - 5s
  const opacity = Math.random() * 0.5 + 0.3; // 0.3 - 0.8
  const leafColors = ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#d4a373"];
  const color = leafColors[Math.floor(Math.random() * leafColors.length)];

  leaf.style.width = `${size}px`;
  leaf.style.height = `${size}px`;
  leaf.style.left = `${leftPos}vw`;
  leaf.style.animationDuration = `${animationDuration}s`;
  leaf.style.animationDelay = `${animationDelay}s`;
  leaf.style.color = color;
  leaf.style.opacity = opacity;

  // Change background completely in CSS, so remove the inline background image
  leaf.style.backgroundImage = 'none';

  container.appendChild(leaf);
}
