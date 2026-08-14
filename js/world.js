const World = {
  weather: "clear",
  weatherUntil: 0,
  nextEventAt: 0,

  advance(dt) {
    const s = GameState.data;
    s.gameMinutes += dt * 0.055;
    if (s.gameMinutes >= 24 * 60) s.gameMinutes -= 24 * 60;
    if (s.phase === "egg" && GameState.timeOfDay() === "night") {
      s.egg.nightTime += dt * 0.02;
    }
    if (performance.now() > this.weatherUntil) {
      this.rollWeather();
    }
  },

  rollWeather() {
    const roll = Math.random();
    this.weather = roll < 0.55 ? "clear" : roll < 0.8 ? "rain" : "snow";
    this.weatherUntil = performance.now() + 35000 + Math.random() * 45000;
  },

  maybeEvent(now) {
    if (GameState.data.phase !== "living") return null;
    if (now < this.nextEventAt) return null;
    this.nextEventAt = now + 18000 + Math.random() * 22000;
    const roll = Math.random();
    if (GameState.timeOfDay() === "night" && roll < 0.35) return "star";
    if (this.weather === "clear" && roll < 0.5) return "bird";
    if (roll < 0.7) return "sparkle";
    if (roll < 0.85 && GameState.data.furniture.includes("toys")) return "toy";
    return "find";
  },

  clockLabel() {
    const h = GameState.hour();
    if (h >= 5 && h < 11) return "утро";
    if (h >= 11 && h < 17) return "день";
    if (h >= 17 && h < 21) return "вечер";
    return "ночь";
  },
};
