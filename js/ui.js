const UI = {
  overlay: null,
  speechTimer: 0,

  init() {
    this.overlay = document.getElementById("overlay");
  },

  isTouch() {
    return window.matchMedia("(pointer: coarse)").matches || (navigator.maxTouchPoints > 0 && window.innerWidth < 900);
  },

  open(html) {
    this.overlay.hidden = false;
    this.overlay.innerHTML = html;
  },

  close() {
    this.overlay.hidden = true;
    this.overlay.innerHTML = "";
    MiniGames.stop();
  },

  showHowTo(force) {
    if (GameState.data.seenHowTo && !force) return false;
    const touch = this.isTouch();
    const keys = touch
      ? `<div class="keys">
          <div class="key-row"><span class="kbd">◀ ▶</span> ходить по комнате</div>
          <div class="key-row"><span class="kbd">▲</span> прыжок</div>
          <div class="key-row"><span class="kbd">●</span> согреть яйцо, погладить, действие</div>
          <div class="key-row"><span class="kbd">тап</span> нажимай на питомца и предметы</div>
        </div>`
      : `<div class="keys">
          <div class="key-row"><span class="kbd">← →</span> или <span class="kbd">A D</span> ходить</div>
          <div class="key-row"><span class="kbd">пробел</span> прыжок / действие</div>
          <div class="key-row"><span class="kbd">мышь</span> кликай по яйцу, питомцу и вещам</div>
        </div>`;
    this.open(`<div class="panel">
      <h2>Как играть</h2>
      <p>Тебе досталось яйцо. Согревай его — и из него появится друг. Кто именно, заранее неизвестно: характер родится из того, как ты с ним живёшь.</p>
      ${keys}
      <p class="hint">Цифры характера спрятаны. Смотри, как он себя ведёт.</p>
      <button type="button" class="primary" id="howto-ok">Понятно!</button>
    </div>`);
    document.getElementById("howto-ok").onclick = () => {
      GameState.data.seenHowTo = true;
      GameState.save();
      this.close();
    };
    return true;
  },

  showName() {
    const a = ANIMALS[GameState.data.animalId];
    this.open(`<div class="panel">
      <h2>Кто-то вылупился!</h2>
      <p>Это ${a.name} ${a.emoji}. Как назовём?</p>
      <div class="name-row">
        <input id="pet-name" maxlength="16" value="${a.defaultName}" />
      </div>
      <button type="button" class="primary" id="name-ok">Это имя</button>
    </div>`);
    const input = document.getElementById("pet-name");
    input.focus();
    input.select();
    document.getElementById("name-ok").onclick = () => {
      GameState.data.name = (input.value || a.defaultName).trim().slice(0, 16);
      GameState.save();
      this.close();
      PetAI.say("happy");
    };
  },

  showFeed() {
    if (GameState.data.phase !== "living") return;
    const buttons = FOODS.map((f) =>
      `<button type="button" class="choice" data-food="${f.id}">${f.emoji} ${f.name}<small>${f.hint}</small></button>`
    ).join("");
    this.open(`<div class="panel">
      <h2>Чем кормим?</h2>
      <p>Разная еда меняет характер — незаметно, но навсегда.</p>
      <div class="foods">${buttons}</div>
      <button type="button" class="ghost" id="cancel">Закрыть</button>
    </div>`);
    this.overlay.querySelectorAll("[data-food]").forEach((btn) => {
      btn.onclick = () => {
        const food = FOODS.find((x) => x.id === btn.dataset.food);
        PetAI.feed(food);
        document.getElementById("bowl-food").classList.add("full");
        setTimeout(() => document.getElementById("bowl-food").classList.remove("full"), 2400);
        Game.spark(14, "🍽");
        Game.sfx("eat");
        GameState.save();
        this.close();
      };
    });
    document.getElementById("cancel").onclick = () => this.close();
  },

  showShop() {
    const owned = new Set(GameState.data.furniture);
    const items = SHOP.map((it) => {
      const have = owned.has(it.id);
      return `<button type="button" class="shop-item" data-shop="${it.id}" ${have ? "disabled" : ""}>
        ${it.emoji} ${it.name} ${have ? "— стоит" : "— ★ " + it.price}
        <small>${it.hint}</small>
      </button>`;
    }).join("");
    this.open(`<div class="panel">
      <h2>Комната</h2>
      <p>Звёздочек: ★ ${GameState.data.stars}. Обустраивай гнездышко по чуть-чуть.</p>
      <div class="shop-grid">${items}</div>
      <button type="button" class="ghost" id="reset">Начать историю заново</button>
      <button type="button" class="ghost" id="cancel">Закрыть</button>
    </div>`);
    this.overlay.querySelectorAll("[data-shop]").forEach((btn) => {
      btn.onclick = () => {
        const item = SHOP.find((x) => x.id === btn.dataset.shop);
        if (GameState.data.stars < item.price) {
          btn.querySelector("small").textContent = "мало звёздочек";
          return;
        }
        GameState.addStars(-item.price);
        GameState.data.furniture.push(item.id);
        Game.sfx("coin");
        Game.renderFurniture();
        GameState.save();
        this.showShop();
      };
    });
    document.getElementById("reset").onclick = () => {
      if (confirm("Яйцо появится снова, прогресс исчезнет. Точно?")) {
        GameState.reset();
        this.close();
        location.reload();
      }
    };
    document.getElementById("cancel").onclick = () => this.close();
  },

  showGames() {
    if (GameState.data.phase !== "living") return;
    this.open(`<div class="panel">
      <h2>Мини-игры</h2>
      <p>Поиграй сам — питомцу тоже будет веселее.</p>
      <div class="games-list">
        <button type="button" class="choice" data-game="berries">Поймай ягодки<small>двигай корзинку</small></button>
        <button type="button" class="choice" data-game="dodge">Прыжки<small>перепрыгивай катушки</small></button>
        <button type="button" class="choice" data-game="hide">Прятки<small>найди, где спрятался друг</small></button>
      </div>
      <button type="button" class="ghost" id="cancel">Закрыть</button>
    </div>`);
    this.overlay.querySelectorAll("[data-game]").forEach((btn) => {
      btn.onclick = () => this.startGame(btn.dataset.game);
    });
    document.getElementById("cancel").onclick = () => this.close();
  },

  startGame(id) {
    if (id === "hide") {
      this.open(`<div class="panel">
        <h2>Прятки</h2>
        <p>Под какой крышкой спрятался ${GameState.data.name || "друг"}?</p>
        <div class="hide-pots">
          <button type="button" class="pot" data-pot="0">🪴</button>
          <button type="button" class="pot" data-pot="1">🪴</button>
          <button type="button" class="pot" data-pot="2">🪴</button>
        </div>
        <button type="button" class="ghost" id="cancel">Назад</button>
      </div>`);
      MiniGames.start("hide");
      this.overlay.querySelectorAll("[data-pot]").forEach((btn) => {
        btn.onclick = () => MiniGames.guess(Number(btn.dataset.pot));
      });
      document.getElementById("cancel").onclick = () => this.showGames();
      return;
    }
    const title = id === "berries" ? "Поймай ягодки" : "Прыжки";
    const hint = id === "berries"
      ? (this.isTouch() ? "Води пальцем влево-вправо." : "Стрелки или A/D двигают корзинку.")
      : (this.isTouch() ? "Кнопка ▲ или пробел — прыжок." : "Пробел — прыжок.");
    this.open(`<div class="panel">
      <h2>${title}</h2>
      <p class="hint">${hint}</p>
      <canvas class="minigame" id="mg" width="360" height="240"></canvas>
      <button type="button" class="ghost" id="cancel">Выйти</button>
    </div>`);
    const canvas = document.getElementById("mg");
    MiniGames.start(id, canvas);
    document.getElementById("cancel").onclick = () => {
      MiniGames.stop();
      this.showGames();
    };
  },

  onMiniGameEnd(success, reward) {
    const title = success ? "Ура!" : "Почти получилось";
    this.open(`<div class="panel">
      <h2>${title}</h2>
      <p>${success ? "Вы вместе повеселились." : "Зато было шумно и живо."} +★ ${reward}</p>
      <button type="button" class="primary" id="ok">Вернуться</button>
    </div>`);
    GameState.save();
    document.getElementById("ok").onclick = () => this.close();
  },

  speak(text) {
    const el = document.getElementById("speech");
    if (!text) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.textContent = text;
    const x = GameState.data.phase === "egg" ? 50 : GameState.data.pet.x;
    el.style.left = x + "%";
  },

  renderNeeds() {
    Object.entries(GameState.data.needs).forEach(([key, value]) => {
      const fill = document.getElementById("need-" + key);
      if (!fill) return;
      fill.style.width = value + "%";
      fill.classList.toggle("low", value < 32);
    });
  },
};
