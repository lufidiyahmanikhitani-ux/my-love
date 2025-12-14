const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* =====================
   CANVAS RESIZE
===================== */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* =====================
   VARIABEL
===================== */
let time = 0;
const petals = [];

/* =====================
   GUGUR KELOPAK
===================== */
function spawnPetal(x, y) {
  petals.push({
    x,
    y,
    r: Math.random() * 4 + 4,
    vx: Math.random() * 0.6 - 0.3,
    vy: Math.random() * 1 + 0.6,
    rot: Math.random() * Math.PI
  });
}

function drawFallingPetals() {
  for (let i = petals.length - 1; i >= 0; i--) {
    const p = petals[i];

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    const g = ctx.createRadialGradient(0, 0, 2, 0, 0, p.r * 2);
    g.addColorStop(0, "#ffe3f1");
    g.addColorStop(1, "#f48fb1");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r, p.r * 1.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    p.x += p.vx;
    p.y += p.vy;
    p.rot += 0.02;

    if (p.y > canvas.height + 20) {
      petals.splice(i, 1);
    }
  }
}

/* =====================
   GAMBAR BUNGA
===================== */
function drawFlower(x, groundY, grow, tilt, scale = 1) {
  const height = 170 * grow * scale;

  ctx.save();
  ctx.translate(x, groundY);
  ctx.rotate(tilt * grow);

  /* BATANG */
  ctx.strokeStyle = "#3CB371";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -height);
  ctx.stroke();

  /* DAUN */
  const leafGrad = ctx.createLinearGradient(0, -height, 0, 0);
  leafGrad.addColorStop(0, "#7fffd4");
  leafGrad.addColorStop(1, "#2e8b57");
  ctx.fillStyle = leafGrad;

  ctx.beginPath();
  ctx.ellipse(-20, -height / 2, 18, 36, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(20, -height / 1.4, 18, 36, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  /* BUNGA */
  if (grow > 0.6) {
    ctx.translate(0, -height);
    ctx.rotate(time * 0.4);

    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);

      const petalGrad = ctx.createRadialGradient(0, -20, 4, 0, -20, 30);
      petalGrad.addColorStop(0, "#fff0f8");
      petalGrad.addColorStop(1, "#f48fb1");

      ctx.fillStyle = petalGrad;
      ctx.beginPath();
      ctx.ellipse(0, -22, 16, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      if (Math.random() < 0.015) {
        spawnPetal(
          x + Math.random() * 30 - 15,
          groundY - height
        );
      }
    }

    ctx.fillStyle = "#ffd54f";
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/* =====================
   ANIMASI UTAMA
===================== */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  time += 0.02;

  const grow = Math.min(time / 3, 1);

  /* POSISI DIKUNCI */
  const groundY = canvas.height - 40;

  /* TENGAH BENAR-BENAR TENGAH */
  const centerX = canvas.width / 2;

  /* JARAK BUNGA */
  const gap = 180;

  drawFlower(centerX - gap, groundY, grow, -0.45, 0.95); // kiri
  drawFlower(centerX, groundY, grow, 0, 1.1);            // tengah
  drawFlower(centerX + gap, groundY, grow, 0.45, 1);     // kanan

  drawFallingPetals();
  requestAnimationFrame(animate);
}

animate();

const music = document.getElementById("bgm");

document.body.addEventListener("click", () => {
  music.play().catch(err => {
    console.log("Audio error:", err);
  });
}, { once: true });