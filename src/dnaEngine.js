/*
  DNA minimalista animado (canvas 2D, sem dependências).
  Usado SOMENTE no hero da página "Início".
  Fitas finas com degradê de profundidade, degraus em fio de cabelo,
  brilho suave e partículas discretas.
*/

const MINT = [236, 255, 242];   // fita mais próxima (clara)
const GREEN = [140, 228, 172];  // fita mais distante (verde suave)
const RUNG = [170, 240, 196];

/*
  Coordenadas normalizadas (x: 0..1 da largura, y: 0..1 da altura).
  a -> b : eixo da hélice | bend/cycles : ondulação do eixo
  r : raio | pitch : distância de uma volta | w : espessura da fita
  soft : hélice de fundo (mais larga, bem tênue e sem degraus)
*/
const HOME = {
  helices: [
    { a: [0.62, 1.2], b: [1.0, -0.2], bend: 0.035, cycles: 1, r: 0.075, pitch: 0.46, w: 1.7, speed: 0.22, alpha: 0.9 },
    { a: [0.92, 1.2], b: [1.08, 0.05], bend: 0, cycles: 0, r: 0.16, pitch: 0.85, w: 1.1, speed: 0.15, alpha: 0.28, soft: true, phase: 2 },
  ],
  particles: { n: 14, drift: [0.003, -0.01], size: 1.5 },
};

const mix = (c1, c2, t) => [
  Math.round(c1[0] + (c2[0] - c1[0]) * t),
  Math.round(c1[1] + (c2[1] - c1[1]) * t),
  Math.round(c1[2] + (c2[2] - c1[2]) * t),
];
const rgb = (c, a = 1) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
const smooth = (t) => t * t * (3 - 2 * t);

function buildPath(h, W, H, U, step) {
  const ax = h.a[0] * W, ay = h.a[1] * H;
  const bx = h.b[0] * W, by = h.b[1] * H;
  const dx = bx - ax, dy = by - ay;
  const len0 = Math.hypot(dx, dy);
  const nx0 = -dy / len0, ny0 = dx / len0;
  const bend = (h.bend || 0) * U;
  const cyc = h.cycles || 0;
  const P = (u) => {
    const off = bend * Math.sin(u * cyc * Math.PI * 2 + (h.phase || 0) * 0.3);
    return [ax + dx * u + nx0 * off, ay + dy * u + ny0 * off];
  };
  const dense = [];
  const M = 600;
  let acc = 0;
  let prev = P(0);
  dense.push({ x: prev[0], y: prev[1], s: 0 });
  for (let i = 1; i <= M; i++) {
    const p = P(i / M);
    acc += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    dense.push({ x: p[0], y: p[1], s: acc });
    prev = p;
  }
  const total = acc;
  const pts = [];
  let j = 0;
  for (let s = 0; s <= total; s += step) {
    while (j < dense.length - 2 && dense[j + 1].s < s) j++;
    const p0 = dense[j], p1 = dense[j + 1];
    const t = (s - p0.s) / Math.max(0.0001, p1.s - p0.s);
    const tx = p1.x - p0.x, ty = p1.y - p0.y;
    const tl = Math.hypot(tx, ty) || 1;
    pts.push({
      x: p0.x + (p1.x - p0.x) * t,
      y: p0.y + (p1.y - p0.y) * t,
      s, nx: -ty / tl, ny: tx / tl,
    });
  }
  return pts;
}

export function startDna(canvas) {
  const variant = HOME;
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const parent = canvas.parentElement;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W = 0, H = 0, U = 520;
  let raf = 0, running = true, visible = true;
  let helices = [];
  let particles = [];
  const t0 = performance.now();

  const setup = () => {
    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    U = Math.max(H, 520);
    const mobile = W < 760;

    const src = mobile ? variant.helices.slice(0, 1) : variant.helices;
    const k = mobile ? 0.75 : 1;
    helices = src.map((h) => {
      const pitchpx = h.pitch * U * k;
      const pts = buildPath(h, W, H, U * k, 4);
      const step = pts.length > 1 ? pts[1].s - pts[0].s : 4;
      return {
        ...h,
        rpx: h.r * U * k,
        pitchpx,
        wpx: h.w * (U / 760) * (mobile ? 0.85 : 1),
        pts,
        // um degrau a cada 1/7 de volta: mais espaçado e delicado
        stride: Math.max(1, Math.round(pitchpx / 7 / step)),
      };
    });

    const pc = variant.particles;
    particles = [];
    const n = mobile ? Math.round(pc.n * 0.5) : pc.n;
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: (0.6 + Math.random() * 0.8) * pc.size,
        ph: Math.random() * 6.28, sp: 0.4 + Math.random() * 0.8,
        vx: pc.drift[0] * W * (0.6 + Math.random() * 0.8),
        vy: pc.drift[1] * H * (0.6 + Math.random() * 0.8),
      });
    }

    canvas.style.opacity = mobile ? "0.6" : "1";
  };

  const draw = (time, dt) => {
    ctx.clearRect(0, 0, W, H);

    const items = [];
    helices.forEach((h) => {
      const pts = h.pts;
      const phase = (h.phase || 0) + time * h.speed;
      const twoPi = Math.PI * 2;
      const total = pts[pts.length - 1].s;
      const fadeLen = 240; // entrada e saída bem suaves
      let prev = null;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const th = (p.s / h.pitchpx) * twoPi + phase;
        const edge = smooth(Math.min(1, p.s / fadeLen, (total - p.s) / fadeLen));
        const s0 = Math.sin(th), s1 = -s0; // fitas opostas
        const c0 = Math.cos(th), c1 = -c0;
        const cur = {
          x0: p.x + p.nx * h.rpx * c0, y0: p.y + p.ny * h.rpx * c0, z0: s0,
          x1: p.x + p.nx * h.rpx * c1, y1: p.y + p.ny * h.rpx * c1, z1: s1,
        };
        if (prev && edge > 0.02) {
          for (let k = 0; k < 2; k++) {
            const z = (prev["z" + k] + cur["z" + k]) / 2;
            const depth = (z + 1) / 2; // 0 (longe) .. 1 (perto)
            items.push({
              z, kind: 0, soft: h.soft,
              col: h.soft ? MINT : mix(GREEN, MINT, depth),
              x: prev["x" + k], y: prev["y" + k], x2: cur["x" + k], y2: cur["y" + k],
              w: h.wpx * (h.soft ? 1 : 0.55 + 0.7 * depth),
              a: h.alpha * edge * (h.soft ? 0.7 : 0.18 + 0.82 * depth),
              glow: !h.soft && depth > 0.55,
            });
          }
        }
        if (i % (h.soft ? h.stride * 2 : h.stride) === 0 && edge > 0.05) {
          items.push({
            z: 0, kind: 1, col: RUNG,
            x: cur.x0, y: cur.y0, x2: cur.x1, y2: cur.y1,
            z0: s0, z1: s1, w: h.wpx * (h.soft ? 0.3 : 0.38),
            a: h.alpha * edge * (h.soft ? 0.5 : 0.55),
            soft: h.soft,
          });
        }
        prev = cur;
      }
    });

    items.sort((a, b) => a.z - b.z);

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.a <= 0.01) continue;
      if (it.kind === 0) {
        ctx.lineCap = "butt";
        if (it.glow) {
          // halo suave sob a fita mais próxima
          ctx.globalAlpha = Math.min(1, it.a * 0.16);
          ctx.lineWidth = it.w * 4.2;
          ctx.strokeStyle = rgb(GREEN);
          ctx.beginPath();
          ctx.moveTo(it.x, it.y);
          ctx.lineTo(it.x2, it.y2);
          ctx.stroke();
        }
        ctx.globalAlpha = Math.min(1, it.a);
        ctx.lineWidth = it.w;
        ctx.strokeStyle = rgb(it.col);
        ctx.beginPath();
        ctx.moveTo(it.x, it.y);
        ctx.lineTo(it.x2, it.y2);
        ctx.stroke();
      } else {
        // degrau em fio de cabelo, com degradê entre as duas fitas
        const g = ctx.createLinearGradient(it.x, it.y, it.x2, it.y2);
        const aa = (it.z0 + 1) / 2, bb = (it.z1 + 1) / 2;
        g.addColorStop(0, rgb(it.col, 0.15 + 0.85 * aa));
        g.addColorStop(0.5, rgb(it.col, 0.12));
        g.addColorStop(1, rgb(it.col, 0.15 + 0.85 * bb));
        ctx.globalAlpha = Math.min(1, it.a);
        ctx.lineCap = "round";
        ctx.lineWidth = Math.max(0.7, it.w);
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(it.x, it.y);
        ctx.lineTo(it.x2, it.y2);
        ctx.stroke();
        if (!it.soft) {
          // pequenos nós nas pontas
          ctx.fillStyle = rgb(MINT);
          const r1 = it.w * (1.4 + 0.9 * aa);
          const r2 = it.w * (1.4 + 0.9 * bb);
          ctx.globalAlpha = Math.min(1, it.a * (0.4 + 0.6 * aa));
          ctx.beginPath(); ctx.arc(it.x, it.y, r1, 0, 6.2832); ctx.fill();
          ctx.globalAlpha = Math.min(1, it.a * (0.4 + 0.6 * bb));
          ctx.beginPath(); ctx.arc(it.x2, it.y2, r2, 0, 6.2832); ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;

    // partículas discretas com halo
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx * dt + Math.sin(time * 0.5 + p.ph) * 0.08;
      p.y += p.vy * dt;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      const tw = 0.3 + 0.7 * Math.abs(Math.sin(time * p.sp + p.ph));
      ctx.fillStyle = rgb(RUNG, 0.1 * tw);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.2, 0, 6.2832); ctx.fill();
      ctx.fillStyle = rgb(MINT, 0.6 * tw);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
  };

  let last = performance.now();
  const loop = (now) => {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (visible) draw((now - t0) / 1000 + 3, dt);
    if (!reduce) raf = requestAnimationFrame(loop);
  };

  setup();
  if (reduce) draw(4, 0); else raf = requestAnimationFrame(loop);

  const ro = new ResizeObserver(() => { setup(); if (reduce) draw(4, 0); });
  ro.observe(parent);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(canvas);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
  };
}
