const SAVE_KEY = "little-friend-save-v1";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function defaultState() {
  return {
    version: 1,
    seenHowTo: false,
    sound: true,
    phase: "egg",
    animalId: null,
    name: "",
    createdAt: Date.now(),
    lastTick: Date.now(),
    gameMinutes: 8 * 60,
    gameDays: 0,
    stars: 0,
    hatch: 0,
    egg: { pets: 0, jumps: 0, nightTime: 0, warmth: 0 },
    needs: { hunger: 82, sleep: 78, mood: 80, play: 76, attention: 84 },
    personality: { care: 50, playfulness: 50, calm: 50, independence: 50, affection: 50 },
    furniture: [],
    babyUntil: 0,
    hatchedAt: 0,
    pet: {
      x: 58,
      facing: -1,
      action: "idle",
      emotion: "curious",
      target: 58,
    },
    player: { x: 28, vy: 0, jumping: false, facing: 1 },
  };
}

const GameState = {
  data: defaultState(),

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      this.data = { ...defaultState(), ...saved };
      this.data.needs = { ...defaultState().needs, ...(saved.needs || {}) };
      this.data.personality = { ...defaultState().personality, ...(saved.personality || {}) };
      this.data.egg = { ...defaultState().egg, ...(saved.egg || {}) };
      this.data.pet = { ...defaultState().pet, ...(saved.pet || {}) };
      this.data.player = { ...defaultState().player, ...(saved.player || {}) };
      this.applyOffline();
    } catch (err) {
      this.data = defaultState();
    }
  },

  save() {
    this.data.lastTick = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
  },

  reset() {
    const seen = this.data.seenHowTo;
    this.data = defaultState();
    this.data.seenHowTo = seen;
    this.save();
  },

  applyOffline() {
    const now = Date.now();
    const elapsed = Math.min(now - (this.data.lastTick || now), 1000 * 60 * 60 * 8);
    const minutes = elapsed / 60000;
    if (minutes < 0.2) return;
    this.data.gameMinutes = (this.data.gameMinutes + minutes * 3) % (24 * 60);
    if (this.data.phase !== "living") return;
    const sleeping = this.data.pet.action === "sleep";
    this.changeNeed("hunger", -minutes * 0.9);
    this.changeNeed("play", -minutes * 0.7);
    this.changeNeed("attention", -minutes * 0.8);
    this.changeNeed("sleep", sleeping ? minutes * 1.4 : -minutes * 0.6);
    this.changeNeed("mood", -minutes * 0.35 + (sleeping ? minutes * 0.1 : 0));
  },

  changeNeed(key, delta) {
    this.data.needs[key] = clamp(this.data.needs[key] + delta, 0, 100);
  },

  changeTrait(key, delta) {
    this.data.personality[key] = clamp(this.data.personality[key] + delta, 0, 100);
  },

  addStars(n) {
    this.data.stars = Math.max(0, this.data.stars + n);
  },

  hour() {
    return (this.data.gameMinutes / 60) % 24;
  },

  timeOfDay() {
    const h = this.hour();
    if (h >= 21 || h < 6) return "night";
    if (h >= 6 && h < 10) return "morning";
    if (h >= 17) return "dusk";
    return "day";
  },

  season() {
    const day = this.data.gameDays || 0;
    return ["summer", "autumn", "winter", "spring"][Math.floor(day / 4) % 4];
  },

  petScale() {
    const s = this.data;
    if (s.phase !== "living") return 1;
    if (!s.hatchedAt && s.babyUntil) {
      s.hatchedAt = s.babyUntil - 1000 * 60 * 12;
    }
    if (!s.hatchedAt) return 1;
    const ageMin = Math.max(0, (Date.now() - s.hatchedAt) / 60000);
    const t = clamp(ageMin / 50, 0, 1);
    const eased = 1 - Math.pow(1 - t, 1.35);
    return 0.42 + 0.58 * eased;
  },

  petAgeClass() {
    const scale = this.petScale();
    if (scale < 0.58) return "hatchling";
    if (scale < 0.78) return "baby";
    if (scale < 0.96) return "young";
    return "adult";
  },
};
