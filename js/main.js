const Game = {
  last: 0,
  hatchLock: false,
  audio: null,

  boot() {
    GameState.load();
    UI.init();
    Input.init();
    this.bindUi();
    this.syncPhase();
    this.renderFurniture();
    this.drawStarsSky();
    UI.showHowTo(false);
    this.last = performance.now();
    requestAnimationFrame((t) => this.loop(t));
    setInterval(() => GameState.save(), 8000);
    window.addEventListener("pagehide", () => GameState.save());
  },

  bindUi() {
    document.getElementById("btn-feed").onclick = () => UI.showFeed();
    document.getElementById("btn-play").onclick = () => {
      if (GameState.data.phase !== "living") return;
      PetAI.playWith();
      this.sfx("play");
      this.spark(GameState.data.pet.x, "✨");
    };
    document.getElementById("btn-pet").onclick = () => {
      this.interact(GameState.data.phase === "egg" ? "egg" : "pet");
    };
    document.getElementById("btn-sleep").onclick = () => {
      if (GameState.data.phase !== "living") return;
      PetAI.putToBed();
      this.sfx("sleep");
    };
    document.getElementById("btn-games").onclick = () => UI.showGames();
    document.getElementById("btn-shop").onclick = () => UI.showShop();
    document.getElementById("btn-help").onclick = () => UI.showHowTo(true);
    document.getElementById("btn-sound").onclick = () => {
      GameState.data.sound = !GameState.data.sound;
      document.getElementById("btn-sound").textContent = GameState.data.sound ? "♪" : "×";
      GameState.save();
    };
    document.getElementById("btn-sound").textContent = GameState.data.sound ? "♪" : "×";

    document.querySelectorAll(".need").forEach((btn) => {
      btn.onclick = () => {
        const map = { hunger: "bowl", sleep: "bed", play: "toy", attention: "pet", mood: "pet" };
        this.interact(map[btn.dataset.need]);
      };
    });

    const mg = document.getElementById("overlay");
    mg.addEventListener("pointermove", (e) => {
      if (!MiniGames.active || MiniGames.active === "hide" || MiniGames.over) return;
      const canvas = document.getElementById("mg");
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      MiniGames.playerX = clamp(((e.clientX - rect.left) / rect.width) * 100, 8, 92);
    });
  },

  syncPhase() {
    const s = GameState.data;
    const egg = document.getElementById("egg");
    const pet = document.getElementById("pet");
    const living = s.phase === "living";
    egg.hidden = living;
    pet.hidden = !living;
    const hint = document.getElementById("egg-hint");
    if (hint) hint.hidden = living;
    const tag = document.getElementById("pet-label");
    if (tag) tag.hidden = !living;
    document.querySelectorAll("#care-bar .care-btn").forEach((btn) => {
      if (btn.id === "btn-shop" || btn.id === "btn-help") return;
      btn.disabled = !living && btn.id !== "btn-pet";
    });
    document.getElementById("btn-feed").disabled = !living;
    document.getElementById("btn-play").disabled = !living;
    document.getElementById("btn-sleep").disabled = !living;
    document.getElementById("btn-games").disabled = !living;
    if (living) {
      this.renderPetBody();
      pet.style.left = (s.pet.x || 52) + "%";
      pet.hidden = false;
    }
    this.updateEggLook();
  },

  renderPetBody() {
    const s = GameState.data;
    const animal = ANIMALS[s.animalId] || ANIMALS.fox;
    const body = document.getElementById("pet-body");
    body.innerHTML = animalSvg(animal.id) + `<span class="pet-emoji">${animal.emoji}</span>`;
    document.getElementById("pet").classList.toggle("baby", Date.now() < s.babyUntil);
    const tag = document.getElementById("pet-label");
    if (tag) {
      tag.hidden = false;
      tag.textContent = s.name || animal.defaultName;
    }
  },

  renderFurniture() {
    SHOP.forEach((item) => {
      const el = document.getElementById("furn-" + item.id);
      if (el) el.hidden = !GameState.data.furniture.includes(item.id);
    });
  },

  drawStarsSky() {
    const box = document.getElementById("stars-sky");
    box.innerHTML = "";
    for (let i = 0; i < 18; i += 1) {
      const d = document.createElement("i");
      d.style.cssText = `position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;left:${Math.random()*100}%;top:${Math.random()*70}%;opacity:${0.4+Math.random()*0.6}`;
      box.appendChild(d);
    }
  },

  loop(t) {
    const dt = Math.min(0.05, (t - this.last) / 1000) || 0.016;
    this.last = t;
    try {
      this.updatePlayer(dt);
      World.advance(dt);
      PetAI.think(t);
      PetAI.update(dt);
      this.needsTick(dt);
      this.events(t);
      this.render();
    } catch (err) {
      console.error(err);
    }
    requestAnimationFrame((n) => this.loop(n));
  },

  needsTick(dt) {
    const s = GameState.data;
    if (s.phase !== "living") return;
    const night = GameState.timeOfDay() === "night";
    GameState.changeNeed("hunger", -dt * 0.55);
    GameState.changeNeed("play", -dt * 0.42);
    GameState.changeNeed("attention", -dt * 0.48);
    if (s.pet.action !== "sleep") GameState.changeNeed("sleep", -dt * (night ? 0.7 : 0.32));
    const avg = (s.needs.hunger + s.needs.sleep + s.needs.play + s.needs.attention) / 4;
    GameState.changeNeed("mood", (avg - 50) * dt * 0.04);
    if (s.furniture.includes("fountain")) GameState.changeNeed("mood", dt * 0.08);
    if (s.furniture.includes("lamp") && night) GameState.changeNeed("mood", dt * 0.06);
  },

  updatePlayer(dt) {
    const p = GameState.data.player;
    let vx = 0;
    if (Input.left) vx -= 1;
    if (Input.right) vx += 1;
    p.x = clamp(p.x + vx * 38 * dt, 4, 96);
    if (vx) p.facing = vx > 0 ? 1 : -1;
    const el = document.getElementById("player");
    el.classList.toggle("walk", vx !== 0 && !p.jumping);
    el.dataset.facing = String(p.facing);

    if (Input.jump && !p.jumping) {
      p.jumping = true;
      p.vy = -1;
      el.classList.add("jump");
      GameState.data.egg.jumps += GameState.data.phase === "egg" ? 1 : 0;
      this.sfx("jump");
      setTimeout(() => {
        p.jumping = false;
        el.classList.remove("jump");
      }, 420);
    }
    if (Input.consumeAction()) this.tryAction();
  },

  near(x, range) {
    return Math.abs(GameState.data.player.x - x) < range;
  },

  tryAction() {
    const s = GameState.data;
    if (s.phase === "egg" && this.near(50, 16)) {
      this.interact("egg");
      return;
    }
    if (s.phase === "living" && this.near(s.pet.x, 14)) {
      this.interact("pet");
      return;
    }
    if (this.near(ROOM_SPOTS.bowl, 9)) return this.interact("bowl");
    if (this.near(ROOM_SPOTS.bed, 11)) return this.interact("bed");
    if (this.near(ROOM_SPOTS.toy, 9)) return this.interact("toy");
  },

  interact(kind) {
    const s = GameState.data;
    if (kind === "egg") return this.warmEgg();
    if (s.phase !== "living") return;
    if (kind === "pet") {
      PetAI.petting();
      this.sfx("pet");
      this.spark(s.pet.x, "💕");
      GameState.save();
    }
    if (kind === "bowl") UI.showFeed();
    if (kind === "bed") {
      PetAI.putToBed();
      this.sfx("sleep");
    }
    if (kind === "toy") {
      PetAI.playWith();
      this.sfx("play");
    }
  },

  warmEgg() {
    if (this.hatchLock || GameState.data.phase !== "egg") return;
    const s = GameState.data;
    s.hatch = clamp(s.hatch + 7 + Math.random() * 4, 0, 100);
    s.egg.pets += 1;
    s.egg.warmth += 1;
    PetAI.say("egg");
    const egg = document.getElementById("egg");
    egg.classList.remove("warm");
    void egg.offsetWidth;
    egg.classList.add("warm");
    this.sfx("warm");
    this.updateEggLook();
    this.spark(50, "♡");
    if (s.hatch >= 100) this.hatch();
    GameState.save();
  },

  updateEggLook() {
    const h = GameState.data.hatch;
    const stage = h > 75 ? "3" : h > 45 ? "2" : h > 18 ? "1" : "0";
    document.getElementById("egg-cracks").dataset.stage = stage;
  },

  hatch() {
    this.hatchLock = true;
    const s = GameState.data;
    s.animalId = pickHatchAnimal(s.egg);
    s.phase = "living";
    s.babyUntil = Date.now() + 1000 * 60 * 12;
    s.pet.x = 52;
    s.pet.target = 52;
    s.pet.action = "happy";
    s.pet.emotion = "happy";
    this.sfx("hatch");
    this.spark(52, "✨");
    this.spark(48, ANIMALS[s.animalId].emoji);
    this.syncPhase();
    GameState.save();
    setTimeout(() => UI.showName(), 500);
  },

  events(now) {
    const ev = World.maybeEvent(now);
    if (!ev) return;
    const bird = document.getElementById("bird");
    if (ev === "bird") {
      bird.classList.remove("on");
      void bird.offsetWidth;
      bird.classList.add("on");
    }
    if (ev === "star") this.spark(20 + Math.random() * 60, "★");
    if (ev === "sparkle") this.spark(GameState.data.pet.x, "✦");
    if (ev === "find" && Math.random() < 0.35) {
      GameState.addStars(1);
      PetAI.say("search");
      this.spark(GameState.data.pet.x, "★");
    }
    if (ev === "toy") {
      GameState.data.pet.target = ROOM_SPOTS.toy;
      GameState.data.pet.action = "search";
    }
  },

  spark(x, glyph) {
    const layer = document.getElementById("event-layer");
    const el = document.createElement("div");
    el.className = "event-spark";
    el.textContent = glyph;
    el.style.left = x + "%";
    el.style.bottom = "40%";
    layer.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  },

  render() {
    const s = GameState.data;
    const screen = document.getElementById("screen");
    screen.dataset.time = GameState.timeOfDay();
    screen.dataset.weather = World.weather;
    document.getElementById("clock").textContent = World.clockLabel();
    document.getElementById("stars").textContent = "★ " + s.stars;

    const player = document.getElementById("player");
    player.style.left = s.player.x + "%";

    const pet = document.getElementById("pet");
    if (s.phase === "living") {
      pet.style.left = s.pet.x + "%";
      pet.style.transform = "translateX(-50%)";
      pet.className = "actor pet " + s.pet.action + (Date.now() < s.babyUntil ? " baby" : "");
      document.getElementById("pet-body").dataset.facing = String(s.pet.facing);
      document.getElementById("pet-emotion").textContent = PetAI.emotionFor(s.pet.emotion);
      if (s.pet.action === "sleep" && Math.random() < 0.004) this.spark(s.pet.x + 6, "z");
    }
    if (performance.now() < PetAI.speakUntil) UI.speak(PetAI.lastLine);
    else UI.speak("");
    UI.renderNeeds();
  },

  sfx(kind) {
    if (!GameState.data.sound) return;
    try {
      const ctx = this.audio || (this.audio = new (window.AudioContext || window.webkitAudioContext)());
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      const tones = { warm: 420, pet: 660, eat: 300, play: 520, jump: 240, sleep: 180, hatch: 740, coin: 880 };
      o.frequency.value = tones[kind] || 400;
      o.type = kind === "sleep" ? "triangle" : "sine";
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      o.start(now);
      o.stop(now + 0.2);
    } catch (e) { /* ignore */ }
  },
};

window.addEventListener("DOMContentLoaded", () => Game.boot());
