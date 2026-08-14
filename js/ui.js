const UI = {
  overlay: null,
  speechTimer: 0,

  init() {
    this.overlay = document.getElementById("overlay");
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay && this.dismissable) this.close();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.overlay.hidden && this.dismissable) this.close();
    });
  },

  isTouch() {
    return window.matchMedia("(pointer: coarse)").matches || (navigator.maxTouchPoints > 0 && window.innerWidth < 900);
  },

  wrap(title, inner, dismissable = true) {
    return `<div class="panel">
      <div class="panel-head">
        <h2>${title}</h2>
        <button type="button" class="panel-close" id="panel-close" aria-label="Закрыть">×</button>
      </div>
      <div class="panel-scroll">${inner}</div>
    </div>`;
  },

  open(html, dismissable = true) {
    this.dismissable = dismissable;
    this.overlay.hidden = false;
    this.overlay.innerHTML = html;
    const closeBtn = document.getElementById("panel-close");
    if (closeBtn) closeBtn.onclick = (e) => {
      e.stopPropagation();
      this.close();
    };
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
    this.open(this.wrap("Как играть", `
      <p>Тебе досталось яйцо. Согревай его — и из него появится друг. Кто именно, заранее неизвестно: характер родится из того, как ты с ним живёшь.</p>
      ${keys}
      <p class="hint">Цифры характера спрятаны. Смотри, как он себя ведёт.</p>
      <button type="button" class="primary" id="howto-ok">Понятно!</button>
    `), true);
    const done = () => {
      GameState.data.seenHowTo = true;
      GameState.save();
      this.close();
    };
    document.getElementById("howto-ok").onclick = done;
    document.getElementById("panel-close").onclick = done;
    return true;
  },

  showName() {
    const a = ANIMALS[GameState.data.animalId];
    this.open(this.wrap("Кто-то вылупился!", `
      <p>Это ${a.name} ${a.emoji}. Как назовём?</p>
      <div class="name-row">
        <input id="pet-name" maxlength="16" value="${a.defaultName}" />
      </div>
      <button type="button" class="primary" id="name-ok">Это имя</button>
    `), false);
    const input = document.getElementById("pet-name");
    input.focus();
    input.select();
    const saveName = () => {
      GameState.data.name = (input.value || a.defaultName).trim().slice(0, 16);
      GameState.save();
      Game.renderPetBody();
      this.close();
      PetAI.say("happy");
    };
    document.getElementById("name-ok").onclick = saveName;
    document.getElementById("panel-close").onclick = saveName;
  },

  showFeed() {
    if (GameState.data.phase !== "living") return;
    const buttons = FOODS.map((f) =>
      `<button type="button" class="choice" data-food="${f.id}">${f.emoji} ${f.name}<small>${f.hint}</small></button>`
    ).join("");
    this.open(this.wrap("Чем кормим?", `
      <p>Разная еда меняет характер — незаметно, но навсегда.</p>
      <div class="foods">${buttons}</div>
    `));
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
    this.open(this.wrap("Комната", `
      <p>Звёздочек: ★ ${GameState.data.stars}. Обустраивай гнездышко по чуть-чуть.</p>
      <div class="shop-grid">${items}</div>
      <button type="button" class="ghost" id="reset">Начать историю заново</button>
    `));
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
  },

  showGames() {
    if (GameState.data.phase !== "living") return;
    this.open(this.wrap("Мини-игры", `
      <p>Поиграй сам — питомцу тоже будет веселее.</p>
      <div class="games-list">
        <button type="button" class="choice" data-game="berries">Поймай ягодки<small>двигай корзинку</small></button>
        <button type="button" class="choice" data-game="dodge">Прыжки<small>перепрыгивай катушки</small></button>
        <button type="button" class="choice" data-game="hide">Прятки<small>найди, где спрятался друг</small></button>
      </div>
    `));
    this.overlay.querySelectorAll("[data-game]").forEach((btn) => {
      btn.onclick = () => this.startGame(btn.dataset.game);
    });
  },

  startGame(id) {
    if (id === "hide") {
      this.startHideGame();
      return;
    }
    const title = id === "berries" ? "Поймай ягодки" : "Прыжки";
    const hint = id === "berries"
      ? "Лови малину, клубнику и голубику. Камень и молоток ловить нельзя!"
      : "Прыгай через катушки. Можно нажать несколько раз, пока идёт время.";
    const jumpBtn = id === "dodge" ? `<button type="button" class="primary" id="mg-jump">Прыжок</button>` : "";
    this.open(this.wrap(title, `
      <p class="hint">${hint}</p>
      <canvas class="minigame" id="mg" width="360" height="240"></canvas>
      ${jumpBtn}
    `));
    const canvas = document.getElementById("mg");
    MiniGames.start(id, canvas);
    MiniGames.bindCanvas();
    const jump = document.getElementById("mg-jump");
    if (jump) jump.onclick = () => MiniGames.jump();
    document.getElementById("panel-close").onclick = () => {
      MiniGames.stop();
      this.showGames();
    };
  },

  startHideGame() {
    const animal = ANIMALS[GameState.data.animalId] || ANIMALS.fox;
    const name = GameState.data.name || "друг";
    const petDraw = animalSvg(animal.id);
    this.open(this.wrap("Прятки", `
      <p id="hide-status">Смотри, под какую чашку садится ${name}.</p>
      <div class="shell-stage" id="shell-stage">
        <div class="shell-pet" id="shell-pet">${petDraw}</div>
        <button type="button" class="shell-cup" data-id="0" style="left:16%" disabled><span class="cup-body"></span></button>
        <button type="button" class="shell-cup" data-id="1" style="left:50%" disabled><span class="cup-body"></span></button>
        <button type="button" class="shell-cup" data-id="2" style="left:84%" disabled><span class="cup-body"></span></button>
      </div>
    `));
    MiniGames.start("hide");
    const slots = [16, 50, 84];
    const cups = [...this.overlay.querySelectorAll(".shell-cup")];
    const pet = document.getElementById("shell-pet");
    const status = document.getElementById("hide-status");
    const petCup = MiniGames.hideSpot;
    const place = [0, 1, 2];

    const layout = () => {
      cups.forEach((cup) => {
        const id = Number(cup.dataset.id);
        cup.style.left = slots[place[id]] + "%";
      });
      pet.style.left = slots[place[petCup]] + "%";
    };

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const stillHere = () => document.getElementById("shell-stage") && MiniGames.active === "hide";

    cups.forEach((cup) => cup.classList.add("is-up"));
    layout();

    const run = async () => {
      await wait(1100);
      if (!stillHere()) return;
      cups.forEach((cup) => cup.classList.remove("is-up"));
      pet.style.opacity = "0";
      status.textContent = "Чашки поехали. Следи глазами!";
      await wait(450);
      for (let i = 0; i < 6; i += 1) {
        if (!stillHere()) return;
        const a = Math.floor(Math.random() * 3);
        const b = (a + 1 + Math.floor(Math.random() * 2)) % 3;
        const slotA = place[a];
        place[a] = place[b];
        place[b] = slotA;
        layout();
        await wait(420);
      }
      if (!stillHere()) return;
      status.textContent = "Где " + name + "? Нажми на чашку.";
      cups.forEach((cup) => {
        cup.disabled = false;
        cup.onclick = () => {
          const result = MiniGames.guess(Number(cup.dataset.id));
          if (!result) return;
          cups.forEach((c) => {
            c.disabled = true;
            c.classList.add("is-up");
          });
          pet.style.opacity = "1";
          pet.classList.add("is-found");
          if (result.win) {
            cup.classList.add("is-correct");
            status.textContent = "Нашёл!";
          } else {
            cup.classList.add("is-wrong");
            cups[result.spot].classList.add("is-correct");
            status.textContent = "Не здесь. " + name + " был в другой чашке.";
          }
          setTimeout(() => {
            if (MiniGames.active === "hide") MiniGames.finish(result.win);
          }, 1100);
        };
      });
    };
    run();

    document.getElementById("panel-close").onclick = () => {
      MiniGames.stop();
      this.showGames();
    };
  },

  onMiniGameEnd(success, reward, note) {
    const title = success ? "Ура!" : "Почти получилось";
    const text = note || (success ? "Вы вместе повеселились." : "Зато было шумно и живо.");
    this.open(this.wrap(title, `
      <p>${text} +★ ${reward}</p>
      <button type="button" class="primary" id="ok">Вернуться</button>
    `));
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
