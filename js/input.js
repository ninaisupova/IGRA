const Input = {
  left: false,
  right: false,
  jump: false,
  action: false,
  actionPressed: false,

  init() {
    window.addEventListener("keydown", (e) => this.onKey(e, true));
    window.addEventListener("keyup", (e) => this.onKey(e, false));

    const pad = document.getElementById("touch-pad");
    pad.hidden = !UI.isTouch();
    pad.querySelectorAll("[data-dir]").forEach((btn) => {
      const start = (ev) => {
        ev.preventDefault();
        this.setDir(btn.dataset.dir, true);
      };
      const end = (ev) => {
        ev.preventDefault();
        this.setDir(btn.dataset.dir, false);
      };
      btn.addEventListener("pointerdown", start);
      btn.addEventListener("pointerup", end);
      btn.addEventListener("pointercancel", end);
      btn.addEventListener("pointerleave", end);
    });
    const act = document.getElementById("pad-action");
    act.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      this.actionPressed = true;
      this.action = true;
    });
    act.addEventListener("pointerup", () => { this.action = false; });

    document.getElementById("room").addEventListener("pointerdown", (e) => {
      const target = e.target.closest("[data-interact], #pet, #egg, #player");
      if (!target) return;
      if (target.id === "pet" || target.closest("#pet")) Game.interact("pet");
      else if (target.id === "egg" || target.closest("#egg")) Game.interact("egg");
      else Game.interact(target.dataset.interact);
    });
  },

  onKey(e, down) {
    const overlayOpen = !document.getElementById("overlay").hidden;
    if (overlayOpen && MiniGames.active && MiniGames.active !== "hide") {
      if (e.code === "ArrowLeft" || e.code === "KeyA") MiniGames.setHold("left", down);
      if (e.code === "ArrowRight" || e.code === "KeyD") MiniGames.setHold("right", down);
      if (e.code === "ArrowLeft" || e.code === "KeyA") MiniGames.move(-1);
      if (e.code === "ArrowRight" || e.code === "KeyD") MiniGames.move(1);
      if ((e.code === "Space" || e.code === "ArrowUp") && down) {
        e.preventDefault();
        MiniGames.jump();
      }
      if (e.code === "Space") e.preventDefault();
      return;
    }
    if (overlayOpen) return;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space", "KeyA", "KeyD"].includes(e.code)) {
      e.preventDefault();
    }
    if (e.code === "ArrowLeft" || e.code === "KeyA") this.left = down;
    if (e.code === "ArrowRight" || e.code === "KeyD") this.right = down;
    if (e.code === "ArrowUp") this.jump = down;
    if (e.code === "Space") {
      if (down && !this.action) this.actionPressed = true;
      this.action = down;
      this.jump = down;
    }
  },

  setDir(dir, down) {
    if (dir === "left") this.left = down;
    if (dir === "right") this.right = down;
    if (dir === "jump") this.jump = down;
    if (MiniGames.active && MiniGames.active !== "hide") {
      if (dir === "left") MiniGames.setHold("left", down);
      if (dir === "right") MiniGames.setHold("right", down);
      if (dir === "jump" && down) MiniGames.jump();
    }
  },

  consumeAction() {
    if (!this.actionPressed) return false;
    this.actionPressed = false;
    return true;
  },
};
