const MiniGames = {
  active: null,
  canvas: null,
  ctx: null,
  timer: 0,
  score: 0,
  items: [],
  playerX: 50,
  over: false,
  hideSpot: 0,
  raf: 0,

  start(id, canvas) {
    this.stop();
    this.active = id;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.score = 0;
    this.over = false;
    this.items = [];
    this.playerX = 50;
    this.timer = id === "hide" ? 0 : 18;
    if (id === "hide") {
      this.hideSpot = Math.floor(Math.random() * 3);
      return;
    }
    const loop = () => {
      if (this.active !== id || this.over) return;
      this.tick(1 / 60);
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  },

  move(dir) {
    this.playerX = clamp(this.playerX + dir * 4.2, 8, 92);
  },

  jump() {
    if (this.active === "dodge" && !this.jumping) {
      this.jumping = true;
      this.jumpT = 0;
    }
  },

  tick(dt) {
    this.timer -= dt;
    if (this.active === "berries") {
      if (Math.random() < 0.045) {
        this.items.push({ x: 8 + Math.random() * 84, y: -6, v: 28 + Math.random() * 18, kind: Math.random() < 0.12 ? "star" : "berry" });
      }
      this.items.forEach((it) => {
        it.y += it.v * dt;
        if (it.y > 78 && it.y < 92 && Math.abs(it.x - this.playerX) < 10) {
          it.hit = true;
          this.score += it.kind === "star" ? 3 : 1;
        }
      });
      this.items = this.items.filter((it) => !it.hit && it.y < 110);
    }
    if (this.active === "dodge") {
      if (this.jumping) {
        this.jumpT += dt;
        if (this.jumpT > 0.55) this.jumping = false;
      }
      if (Math.random() < 0.02) this.items.push({ x: 108, y: 82, v: 38 + Math.random() * 16 });
      this.items.forEach((it) => {
        it.x -= it.v * dt;
        const py = this.jumping ? 58 : 82;
        if (it.x > 42 && it.x < 58 && Math.abs(py - it.y) < 14) {
          this.finish(false);
        }
      });
      this.items = this.items.filter((it) => it.x > -10);
      this.score += dt * 2;
    }
    if (this.timer <= 0 && this.active !== "hide") this.finish(true);
  },

  draw() {
    const c = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#7ec3d4");
    g.addColorStop(0.55, "#d7efc8");
    g.addColorStop(1, "#6b8f71");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#9a5a2c";
    c.fillRect(0, h * 0.82, w, h * 0.18);
    c.fillStyle = "#3a2723";
    c.font = "16px KoHo, sans-serif";
    c.fillText("★ " + Math.floor(this.score), 12, 22);
    c.fillText(Math.max(0, Math.ceil(this.timer)) + "с", w - 48, 22);

    if (this.active === "berries") {
      this.items.forEach((it) => {
        c.font = "22px serif";
        c.fillText(it.kind === "star" ? "★" : "🫐", it.x / 100 * w - 8, it.y / 100 * h);
      });
      c.fillStyle = "#c45e32";
      const bx = this.playerX / 100 * w;
      c.fillRect(bx - 22, h * 0.78, 44, 14);
      c.strokeStyle = "#3a2723";
      c.lineWidth = 3;
      c.strokeRect(bx - 22, h * 0.78, 44, 14);
    }
    if (this.active === "dodge") {
      const px = w * 0.5;
      const py = (this.jumping ? 0.58 : 0.72) * h;
      c.fillStyle = "#6b8f71";
      c.beginPath();
      c.arc(px, py, 16, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = "#3a2723";
      c.stroke();
      this.items.forEach((it) => {
        c.fillStyle = "#c45e32";
        c.beginPath();
        c.arc(it.x / 100 * w, it.y / 100 * h, 12, 0, Math.PI * 2);
        c.fill();
      });
    }
  },

  guess(index) {
    if (this.active !== "hide" || this.over) return;
    const win = index === this.hideSpot;
    this.score = win ? 8 : 2;
    this.finish(win);
  },

  finish(success) {
    if (this.over) return;
    this.over = true;
    cancelAnimationFrame(this.raf);
    const reward = Math.max(2, Math.round(this.score));
    GameState.addStars(reward);
    GameState.changeNeed("play", success ? 16 : 8);
    GameState.changeNeed("mood", success ? 10 : 4);
    PetAI.nudgePersonality("play");
    if (typeof UI !== "undefined") UI.onMiniGameEnd(success, reward);
  },

  stop() {
    cancelAnimationFrame(this.raf);
    this.active = null;
    this.over = true;
  },
};
