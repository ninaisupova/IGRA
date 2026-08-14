const MiniGames = {
  active: null,
  canvas: null,
  ctx: null,
  timer: 0,
  score: 0,
  items: [],
  playerX: 50,
  over: false,
  done: false,
  hideSpot: 0,
  raf: 0,
  lastTime: 0,
  petY: 0,
  petVy: 0,
  onGround: true,
  holdLeft: false,
  holdRight: false,
  petSprite: null,
  spawnWait: 0,
  lives: 3,
  endNote: "",

  start(id, canvas) {
    this.stop();
    this.done = false;
    this.over = false;
    this.active = id;
    this.canvas = canvas || null;
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.score = 0;
    this.items = [];
    this.playerX = 50;
    this.petY = 0;
    this.petVy = 0;
    this.onGround = true;
    this.holdLeft = false;
    this.holdRight = false;
    this.lastTime = 0;
    this.spawnWait = id === "dodge" ? 1.4 : 0.4;
    this.lives = 3;
    this.endNote = "";
    this.timer = id === "hide" ? 0 : 22;
    this.loadPetSprite();
    if (id === "hide") {
      this.hideSpot = Math.floor(Math.random() * 3);
      return;
    }
    const loop = (now) => {
      if (this.active !== id || this.over) return;
      const dt = Math.min(0.04, this.lastTime ? (now - this.lastTime) / 1000 : 1 / 60);
      this.lastTime = now;
      this.tick(dt);
      if (!this.over) this.draw();
      if (!this.over) this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  },

  loadPetSprite() {
    const id = (GameState.data && GameState.data.animalId) || "fox";
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(animalSvg(id));
    this.petSprite = img;
  },

  bindCanvas() {
    if (!this.canvas) return;
    this.canvas.onpointerdown = (e) => {
      e.preventDefault();
      if (this.active === "dodge") this.jump();
      if (this.active === "berries") this.aim(e);
    };
    this.canvas.onpointermove = (e) => {
      if (this.active === "berries") this.aim(e);
    };
  },

  aim(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.playerX = clamp(((e.clientX - rect.left) / rect.width) * 100, 10, 90);
  },

  move(dir) {
    this.playerX = clamp(this.playerX + dir * 6, 10, 90);
  },

  setHold(side, down) {
    if (side === "left") this.holdLeft = down;
    if (side === "right") this.holdRight = down;
  },

  jump() {
    if (this.active !== "dodge" || this.over) return;
    if (!this.onGround) return;
    this.onGround = false;
    this.petVy = -520;
  },

  tick(dt) {
    if (this.active === "berries") this.tickBerries(dt);
    if (this.active === "dodge") this.tickDodge(dt);
    this.timer -= dt;
    if (this.timer <= 0 && this.active !== "hide") {
      this.endNote = this.active === "dodge" ? "Допрыгали до конца!" : "Корзинка полная!";
      this.finish(true);
    }
  },

  tickBerries(dt) {
    if (this.holdLeft) this.playerX = clamp(this.playerX - 70 * dt, 10, 90);
    if (this.holdRight) this.playerX = clamp(this.playerX + 70 * dt, 10, 90);
    this.spawnWait -= dt;
    if (this.spawnWait <= 0) {
      this.spawnWait = 0.45 + Math.random() * 0.35;
      const kinds = ["raspberry", "strawberry", "blueberry", "raspberry", "strawberry", "blueberry", "stone", "hammer"];
      this.items.push({
        x: 12 + Math.random() * 76,
        y: -10,
        v: 38 + Math.random() * 20,
        kind: kinds[Math.floor(Math.random() * kinds.length)],
      });
    }
    this.items.forEach((it) => {
      it.y += it.v * dt;
      if (it.y > 74 && it.y < 92 && Math.abs(it.x - this.playerX) < 13) {
        it.hit = true;
        if (it.kind === "stone" || it.kind === "hammer") {
          this.lives -= 1;
          if (this.lives <= 0) {
            this.endNote = it.kind === "hammer" ? "Молоток есть нельзя!" : "Камень есть нельзя!";
            this.finish(false);
          }
        } else {
          this.score += it.kind === "strawberry" ? 2 : 1;
        }
      }
    });
    this.items = this.items.filter((it) => !it.hit && it.y < 112);
  },

  tickDodge(dt) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ground = h * 0.8;
    this.petVy += 1600 * dt;
    this.petY += this.petVy * dt;
    if (this.petY >= 0) {
      this.petY = 0;
      this.petVy = 0;
      this.onGround = true;
    }

    this.spawnWait -= dt;
    if (this.spawnWait <= 0) {
      this.spawnWait = 1.35 + Math.random() * 0.55;
      this.items.push({
        x: w + 20,
        y: ground - 26,
        w: 34,
        h: 26,
        v: 130 + Math.random() * 40,
      });
    }

    const petW = 46;
    const petH = 56;
    const petX = w * 0.16;
    const petBottom = ground + this.petY;
    const petTop = petBottom - petH;

    this.items.forEach((it) => {
      it.x -= it.v * dt;
      const overlapX = it.x < petX + petW - 8 && it.x + it.w > petX + 10;
      const overlapY = it.y < petBottom - 6 && it.y + it.h > petTop + 10;
      if (overlapX && overlapY) {
        this.endNote = "Задели катушку. Прыгай повыше!";
        this.finish(false);
      }
    });
    if (this.over) return;
    this.items = this.items.filter((it) => it.x > -50);
    this.score += dt * 2.2;
  },

  draw() {
    if (!this.ctx || !this.canvas) return;
    const c = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const sky = c.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#7ec3d4");
    sky.addColorStop(0.62, "#d7efc8");
    sky.addColorStop(1, "#6b8f71");
    c.fillStyle = sky;
    c.fillRect(0, 0, w, h);
    c.fillStyle = "#9a5a2c";
    c.fillRect(0, h * 0.8, w, h * 0.2);
    c.fillStyle = "#7a4322";
    c.fillRect(0, h * 0.8, w, 4);

    c.fillStyle = "#fff6e6";
    c.strokeStyle = "#3a2723";
    c.lineWidth = 2;
    roundRect(c, 8, 8, 78, 24, 10);
    c.fill();
    c.stroke();
    c.fillStyle = "#3a2723";
    c.font = "bold 14px KoHo, Segoe UI, sans-serif";
    c.fillText("очки " + Math.floor(this.score), 16, 25);
    roundRect(c, w - 62, 8, 50, 24, 10);
    c.fillStyle = "#fff6e6";
    c.fill();
    c.stroke();
    c.fillStyle = "#3a2723";
    c.fillText(Math.max(0, Math.ceil(this.timer)) + "с", w - 50, 25);

    if (this.active === "berries") {
      for (let i = 0; i < this.lives; i += 1) {
        c.fillStyle = "#c45e32";
        c.beginPath();
        c.arc(96 + i * 16, 20, 6, 0, Math.PI * 2);
        c.fill();
      }
      this.drawBerries(c, w, h);
    }
    if (this.active === "dodge") this.drawDodge(c, w, h);
  },

  drawBerries(c, w, h) {
    this.items.forEach((it) => {
      const x = it.x / 100 * w;
      const y = it.y / 100 * h;
      drawFallingItem(c, x, y, it.kind);
    });
    const bx = this.playerX / 100 * w;
    const by = h * 0.78;
    c.fillStyle = "#c45e32";
    c.beginPath();
    c.moveTo(bx - 28, by);
    c.lineTo(bx + 28, by);
    c.lineTo(bx + 20, by + 18);
    c.lineTo(bx - 20, by + 18);
    c.closePath();
    c.fill();
    c.strokeStyle = "#3a2723";
    c.lineWidth = 3;
    c.stroke();
  },

  drawDodge(c, w, h) {
    const ground = h * 0.8;
    const petW = 46;
    const petH = 56;
    const px = w * 0.16;
    const py = ground - petH + this.petY;
    if (this.petSprite && this.petSprite.complete && this.petSprite.naturalWidth) {
      c.drawImage(this.petSprite, px, py, petW, petH);
    } else {
      c.fillStyle = "#6b8f71";
      c.beginPath();
      c.arc(px + petW / 2, py + petH / 2, 18, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = "#3a2723";
      c.lineWidth = 3;
      c.stroke();
    }
    this.items.forEach((it) => {
      c.fillStyle = "#c45e32";
      roundRect(c, it.x, it.y, it.w, it.h, 8);
      c.fill();
      c.strokeStyle = "#3a2723";
      c.lineWidth = 2;
      c.stroke();
      c.fillStyle = "#9a3f24";
      c.fillRect(it.x + 8, it.y + 6, 4, it.h - 12);
      c.fillRect(it.x + it.w - 12, it.y + 6, 4, it.h - 12);
    });
  },

  guess(index) {
    if (this.active !== "hide" || this.over) return null;
    this.over = true;
    const win = Number(index) === this.hideSpot;
    this.score = win ? 2 : 1;
    return { win, spot: this.hideSpot };
  },

  finish(success) {
    if (this.done) return;
    this.done = true;
    this.over = true;
    cancelAnimationFrame(this.raf);
    const reward = success ? 2 : 1;
    GameState.addStars(reward);
    GameState.changeNeed("play", success ? 16 : 8);
    GameState.changeNeed("mood", success ? 10 : 4);
    PetAI.nudgePersonality("play");
    const note = this.endNote;
    setTimeout(() => {
      if (typeof UI !== "undefined") UI.onMiniGameEnd(success, reward, note);
    }, 40);
  },

  stop() {
    cancelAnimationFrame(this.raf);
    this.active = null;
    this.over = true;
    this.done = true;
    if (this.canvas) {
      this.canvas.onpointerdown = null;
      this.canvas.onpointermove = null;
    }
  },
};

function roundRect(c, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + rr, y);
  c.arcTo(x + w, y, x + w, y + h, rr);
  c.arcTo(x + w, y + h, x, y + h, rr);
  c.arcTo(x, y + h, x, y, rr);
  c.arcTo(x, y, x + w, y, rr);
  c.closePath();
}

function drawFallingItem(c, x, y, kind) {
  c.save();
  c.translate(x, y);
  c.lineWidth = 2;
  c.strokeStyle = "#3a2723";
  if (kind === "raspberry") {
    ["-6,-3", "6,-3", "0,5", "0,-8"].forEach((p) => {
      const [dx, dy] = p.split(",").map(Number);
      c.beginPath();
      c.fillStyle = "#c42b5a";
      c.arc(dx, dy, 6, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    });
  } else if (kind === "strawberry") {
    c.fillStyle = "#e23b3b";
    c.beginPath();
    c.moveTo(0, 11);
    c.quadraticCurveTo(12, 2, 7, -6);
    c.quadraticCurveTo(0, -11, -7, -6);
    c.quadraticCurveTo(-12, 2, 0, 11);
    c.fill();
    c.stroke();
    c.fillStyle = "#3f8f46";
    c.beginPath();
    c.moveTo(-5, -7);
    c.lineTo(0, -13);
    c.lineTo(5, -7);
    c.closePath();
    c.fill();
    c.fillStyle = "#f6d56a";
    [[-3, 0], [3, 1], [0, 5], [-4, 6]].forEach(([dx, dy]) => {
      c.beginPath();
      c.arc(dx, dy, 1.2, 0, Math.PI * 2);
      c.fill();
    });
  } else if (kind === "blueberry") {
    c.fillStyle = "#4a5fb5";
    c.beginPath();
    c.arc(0, 1, 8, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = "#2e3d7a";
    c.beginPath();
    c.arc(0, -4, 3.2, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "rgba(255,255,255,0.4)";
    c.beginPath();
    c.arc(-2, -1, 2, 0, Math.PI * 2);
    c.fill();
  } else if (kind === "stone") {
    c.fillStyle = "#8b8b8b";
    c.beginPath();
    c.ellipse(0, 2, 11, 8, -0.2, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = "#6f6f6f";
    c.beginPath();
    c.ellipse(-3, 0, 4, 2.5, 0.4, 0, Math.PI * 2);
    c.fill();
  } else if (kind === "hammer") {
    c.fillStyle = "#8a5a32";
    roundRect(c, -2, -2, 5, 16, 2);
    c.fill();
    c.stroke();
    c.fillStyle = "#7a7d84";
    roundRect(c, -11, -8, 22, 9, 2);
    c.fill();
    c.stroke();
  }
  c.restore();
}
