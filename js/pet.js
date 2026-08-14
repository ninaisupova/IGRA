const LINES = {
  happy: ["мне хорошо!", "ещё чуть-чуть!", "ты рядом — и всё светлее", "вот это день!"],
  love: ["ещё гладь…", "ты мой любимый человек", "мур… ну почти"],
  hungry: ["миска смотрит пустотой", "съел бы что-нибудь вкусное", "животик поёт"],
  sleepy: ["глазки слипаются", "можно в кроватку?", "зев…"],
  bored: ["скучновато…", "давай во что-нибудь сыграем", "игрушка грустит без нас"],
  sad: ["я немного обиделся", "ты куда-то пропал", "обними, если можно"],
  search: ["ищу сокровище…", "тут точно что-то было", "нюх-нюх"],
  night: ["ночь такая тихая", "звёзды за окном", "давай спать вместе?"],
  playful: ["догони!", "ещё разок!", "я сам придумал игру"],
  independent: ["я пока поброжу", "мне и одному интересно", "не мешай, я занят"],
  calm: ["тихо и хорошо", "можно просто посидеть", "дыхание как облако"],
  egg: ["теплее…", "кто-то шевелится", "ещё чуть-чуть", "тук-тук внутри"],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const PetAI = {
  speakUntil: 0,
  lastLine: "",
  nextThink: 0,
  zzz: false,

  trait(name) {
    return GameState.data.personality[name];
  },

  moodKey() {
    const n = GameState.data.needs;
    if (n.hunger < 28) return "hungry";
    if (n.sleep < 26) return "sleepy";
    if (n.mood < 30 || n.attention < 28) return "sad";
    if (n.play < 30) return "bored";
    if (n.mood > 78 && n.attention > 60) return "happy";
    return "idle";
  },

  emotionFor(key) {
    return {
      hungry: "🍽",
      sleepy: "😴",
      sad: "😢",
      bored: "🥱",
      happy: "😊",
      love: "💕",
      search: "🔍",
      playful: "✨",
      angry: "😠",
      curious: "♡",
      idle: "♡",
    }[key] || "♡";
  },

  say(kind) {
    const lines = LINES[kind] || LINES.happy;
    this.lastLine = pick(lines);
    this.speakUntil = performance.now() + 2800;
    return this.lastLine;
  },

  nudgePersonality(action) {
    if (action === "pet") {
      GameState.changeTrait("affection", 2.2);
      GameState.changeTrait("independence", -0.8);
      GameState.changeTrait("care", 1.2);
    }
    if (action === "play") {
      GameState.changeTrait("playfulness", 2.4);
      GameState.changeTrait("calm", -0.6);
      GameState.changeTrait("care", 0.8);
    }
    if (action === "sleep") {
      GameState.changeTrait("calm", 2.2);
      GameState.changeTrait("playfulness", -0.4);
    }
    if (action === "ignore") {
      GameState.changeTrait("independence", 1.4);
      GameState.changeTrait("affection", -0.5);
      GameState.changeTrait("care", -0.8);
    }
  },

  think(now) {
    const s = GameState.data;
    if (s.phase !== "living") return;
    if (now < this.nextThink) return;
    this.nextThink = now + 2200 + Math.random() * 1800;

    const n = s.needs;
    const p = s.pet;
    const lonely = n.attention < 35;
    const playful = this.trait("playfulness") > 62;
    const independent = this.trait("independence") > 64;
    const calm = this.trait("calm") > 62;
    const night = GameState.timeOfDay() === "night";

    if (p.action === "sleep") {
      if (n.sleep > 92 && Math.random() < 0.35) {
        p.action = "idle";
        p.emotion = "curious";
        this.say("happy");
      }
      return;
    }

    if (night && n.sleep < 55 && Math.random() < 0.45 + (calm ? 0.2 : 0)) {
      this.goSleep(true);
      return;
    }
    if (n.sleep < 18) {
      this.goSleep(true);
      this.say("sleepy");
      return;
    }
    if (n.hunger < 32 && Math.random() < 0.7) {
      p.target = 11;
      p.action = "sad";
      p.emotion = "hungry";
      this.say("hungry");
      return;
    }
    if (n.play < 30 || (playful && Math.random() < 0.3)) {
      p.target = s.furniture.includes("toys") ? 63 : (Math.random() < 0.5 ? 11 : 88);
      p.action = "search";
      p.emotion = "search";
      this.say(playful ? "playful" : "search");
      return;
    }
    if (lonely && !independent) {
      p.target = GameState.data.player.x;
      p.action = "walk";
      p.emotion = "sad";
      if (Math.random() < 0.5) this.say("sad");
      return;
    }
    if (independent && Math.random() < 0.45) {
      p.target = this.wanderX();
      p.action = "walk";
      p.emotion = "curious";
      if (Math.random() < 0.4) this.say("independent");
      return;
    }
    if (Math.random() < 0.42) {
      p.target = this.wanderX();
      p.action = "walk";
      p.emotion = playful ? "playful" : "curious";
      return;
    }
    if (calm && Math.random() < 0.3) {
      p.action = "idle";
      p.emotion = "idle";
      this.say("calm");
      return;
    }
    p.action = "idle";
    p.emotion = this.moodKey();
  },

  wanderX() {
    if (Math.random() < 0.35) return Math.random() < 0.5 ? 5 : 95;
    return 5 + Math.random() * 90;
  },

  goSleep(autonomous) {
    const p = GameState.data.pet;
    p.target = 88;
    p.facing = 1;
    p.action = "walk";
    p.emotion = "sleepy";
    p.wantSleep = true;
    p.sleepAuto = !!autonomous;
  },

  update(dt) {
    const s = GameState.data;
    const p = s.pet;
    if (s.phase !== "living") return;

    const speed = 14 + this.trait("playfulness") * 0.08;
    const dx = p.target - p.x;
    if (Math.abs(dx) > 0.6 && p.action !== "sleep") {
      p.x = Math.max(5, Math.min(95, p.x + Math.sign(dx) * Math.min(Math.abs(dx), speed * dt)));
      p.facing = dx >= 0 ? 1 : -1;
      if (p.action !== "search" && p.action !== "sad" && p.action !== "eat") p.action = "walk";
    } else if (p.wantSleep) {
      p.x = 88;
      p.facing = 1;
      p.action = "sleep";
      p.emotion = "sleepy";
      p.wantSleep = false;
      if (!p.sleepAuto) this.say("sleepy");
    } else if (p.action === "walk") {
      p.action = "idle";
    } else if (p.action === "idle" && Math.random() < dt * 0.12) {
      p.facing *= -1;
    }

    if (p.action === "sleep") {
      GameState.changeNeed("sleep", dt * 6.5);
      GameState.changeNeed("mood", dt * 1.2);
    }

    if (s.needs.attention < 20 && Math.random() < dt * 0.15) {
      this.nudgePersonality("ignore");
    }
  },

  feed(food) {
    const s = GameState.data;
    GameState.changeNeed("hunger", food.hunger);
    GameState.changeNeed("mood", food.mood);
    GameState.changeNeed("attention", 6);
    Object.entries(food.traits).forEach(([k, v]) => GameState.changeTrait(k, v));
    s.pet.target = 11;
    s.pet.action = "eat";
    s.pet.emotion = "happy";
    this.say("happy");
    if (Math.random() < 0.1) GameState.addStars(1);
  },

  petting() {
    const s = GameState.data;
    GameState.changeNeed("attention", 18);
    GameState.changeNeed("mood", 10);
    GameState.changeNeed("play", 3);
    this.nudgePersonality("pet");
    s.pet.target = s.player.x;
    s.pet.action = "happy";
    s.pet.emotion = "love";
    this.say("love");
    if (Math.random() < 0.08) GameState.addStars(1);
  },

  playWith() {
    const s = GameState.data;
    GameState.changeNeed("play", 22);
    GameState.changeNeed("mood", 12);
    GameState.changeNeed("attention", 8);
    GameState.changeNeed("sleep", -6);
    this.nudgePersonality("play");
    s.pet.action = "happy";
    s.pet.emotion = "playful";
    s.pet.target = 8 + Math.random() * 84;
    this.say("playful");
    if (Math.random() < 0.12) GameState.addStars(1);
  },

  putToBed() {
    this.nudgePersonality("sleep");
    GameState.changeNeed("attention", 5);
    this.goSleep(false);
  },
};
