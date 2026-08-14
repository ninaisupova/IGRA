const ANIMALS = {
  fox: {
    id: "fox",
    name: "лисёнок",
    emoji: "🦊",
    defaultName: "Рыжик",
    tags: ["warm", "clever"],
    colors: { body: "#E07A3D", belly: "#F6D7B5", ear: "#C45C26", ink: "#3A2723" },
  },
  panda: {
    id: "panda",
    name: "панда",
    emoji: "🐼",
    defaultName: "Пан-Пан",
    tags: ["calm", "soft"],
    colors: { body: "#F7F1E6", belly: "#FFFFFF", ear: "#2A2420", ink: "#2A2420" },
  },
  frog: {
    id: "frog",
    name: "лягушонок",
    emoji: "🐸",
    defaultName: "Кваша",
    tags: ["play", "wet"],
    colors: { body: "#6BAA5A", belly: "#D7F0A8", ear: "#4E8A40", ink: "#2A3A22" },
  },
  penguin: {
    id: "penguin",
    name: "пингвин",
    emoji: "🐧",
    defaultName: "Льдинка",
    tags: ["cool", "night"],
    colors: { body: "#2B3038", belly: "#F4EEE2", ear: "#E07A3D", ink: "#1A1C20" },
  },
  otter: {
    id: "otter",
    name: "выдра",
    emoji: "🦦",
    defaultName: "Плюх",
    tags: ["play", "warm"],
    colors: { body: "#A66A3A", belly: "#E8C9A0", ear: "#7A4A28", ink: "#3A2723" },
  },
  hedgehog: {
    id: "hedgehog",
    name: "ёжик",
    emoji: "🦔",
    defaultName: "Иголка",
    tags: ["night", "shy"],
    colors: { body: "#8A6A48", belly: "#E8C9A0", ear: "#5C4632", ink: "#3A2723" },
  },
  koala: {
    id: "koala",
    name: "коала",
    emoji: "🐨",
    defaultName: "Кеша",
    tags: ["calm", "soft"],
    colors: { body: "#B7B3B0", belly: "#F0E6DC", ear: "#9A9692", ink: "#3A2723" },
  },
  raccoon: {
    id: "raccoon",
    name: "енот",
    emoji: "🦝",
    defaultName: "Полоскун",
    tags: ["night", "clever"],
    colors: { body: "#8C8178", belly: "#E8DDD2", ear: "#4A433E", ink: "#2A2420" },
  },
  flamingo: {
    id: "flamingo",
    name: "фламинго",
    emoji: "🦩",
    defaultName: "Розочка",
    tags: ["warm", "play"],
    colors: { body: "#F2A0B4", belly: "#FFD3DE", ear: "#E07A90", ink: "#5C2E3A" },
  },
  alpaca: {
    id: "alpaca",
    name: "альпака",
    emoji: "🦙",
    defaultName: "Пушок",
    tags: ["soft", "calm"],
    colors: { body: "#F0D5B0", belly: "#FFF6E6", ear: "#E0B888", ink: "#3A2723" },
  },
  squirrel: {
    id: "squirrel",
    name: "белочка",
    emoji: "🐿",
    defaultName: "Орешек",
    tags: ["play", "clever"],
    colors: { body: "#D26A32", belly: "#F6D7B5", ear: "#A84820", ink: "#3A2723" },
  },
};

const ANIMAL_IDS = Object.keys(ANIMALS);

const FOODS = [
  { id: "berries", name: "Ягоды", emoji: "🫐", hint: "сладкие и ласковые", hunger: 22, mood: 8, traits: { affection: 4, care: 2 } },
  { id: "fish", name: "Рыбка", emoji: "🐟", hint: "для игривых", hunger: 26, mood: 6, traits: { playfulness: 4, care: 1 } },
  { id: "leaves", name: "Листочки", emoji: "🥬", hint: "тихие и спокойные", hunger: 20, mood: 4, traits: { calm: 5, care: 2 } },
  { id: "nuts", name: "Орешки", emoji: "🥜", hint: "для самостоятельных", hunger: 24, mood: 5, traits: { independence: 4, care: 1 } },
  { id: "honey", name: "Медок", emoji: "🍯", hint: "праздник, но в меру", hunger: 18, mood: 14, traits: { affection: 2, care: -2, playfulness: 2 } },
];

const SHOP = [
  { id: "rug", name: "Коврик", emoji: "🧶", price: 18, hint: "мягко сидеть" },
  { id: "plant", name: "Растение", emoji: "🌿", price: 24, hint: "зелёный уголок" },
  { id: "poster", name: "Постер", emoji: "🖼", price: 16, hint: "украшение стены" },
  { id: "cushion", name: "Подушка", emoji: "🛋", price: 20, hint: "для дневного сна" },
  { id: "toys", name: "Ящик игрушек", emoji: "🪀", price: 28, hint: "сам найдёт чем заняться" },
  { id: "lamp", name: "Лампа", emoji: "💡", price: 32, hint: "уютнее ночью" },
  { id: "curtains", name: "Шторы", emoji: "🪟", price: 36, hint: "комната как дом" },
  { id: "fountain", name: "Поилка", emoji: "💧", price: 40, hint: "свежая водичка" },
];

function animalSvg(id) {
  const a = ANIMALS[id];
  const c = a.colors;
  const commonEyes = `
    <g class="eyes">
      <ellipse cx="28" cy="30" rx="4.2" ry="4.6" fill="${c.ink}"/>
      <ellipse cx="44" cy="30" rx="4.2" ry="4.6" fill="${c.ink}"/>
      <circle cx="29.4" cy="28.6" r="1.3" fill="#fff"/>
      <circle cx="45.4" cy="28.6" r="1.3" fill="#fff"/>
    </g>
    <path d="M34 36 q2 3 4 0" fill="none" stroke="${c.ink}" stroke-width="1.6" stroke-linecap="round"/>`;

  const bodies = {
    fox: `<ellipse cx="36" cy="42" rx="22" ry="18" fill="${c.body}" stroke="${c.ink}" stroke-width="2.4"/>
      <ellipse cx="36" cy="48" rx="12" ry="9" fill="${c.belly}"/>
      <polygon points="16,22 22,8 28,22" fill="${c.ear}" stroke="${c.ink}" stroke-width="2"/>
      <polygon points="44,22 50,8 56,22" fill="${c.ear}" stroke="${c.ink}" stroke-width="2"/>
      <polygon points="18,20 22,12 26,20" fill="${c.belly}"/>
      <polygon points="46,20 50,12 54,20" fill="${c.belly}"/>
      <path d="M56 48 q18 -6 16 14 q-14 -6 -22 -4" fill="${c.body}" stroke="${c.ink}" stroke-width="2.2"/>
      <path d="M62 56 q8 4 8 10" fill="${c.belly}"/>
      ${commonEyes}`,
    panda: `<ellipse cx="36" cy="44" rx="22" ry="18" fill="${c.body}" stroke="${c.ink}" stroke-width="2.4"/>
      <circle cx="18" cy="20" r="9" fill="${c.ear}" stroke="${c.ink}" stroke-width="2"/>
      <circle cx="54" cy="20" r="9" fill="${c.ear}" stroke="${c.ink}" stroke-width="2"/>
      <ellipse cx="36" cy="50" rx="13" ry="10" fill="#fff"/>
      <ellipse cx="27" cy="31" rx="8" ry="7" fill="${c.ear}"/>
      <ellipse cx="45" cy="31" rx="8" ry="7" fill="${c.ear}"/>
      ${commonEyes}`,
    frog: `<ellipse cx="36" cy="46" rx="24" ry="16" fill="${c.body}" stroke="${c.ink}" stroke-width="2.4"/>
      <ellipse cx="36" cy="52" rx="14" ry="8" fill="${c.belly}"/>
      <circle cx="22" cy="24" r="10" fill="${c.body}" stroke="${c.ink}" stroke-width="2"/>
      <circle cx="50" cy="24" r="10" fill="${c.body}" stroke="${c.ink}" stroke-width="2"/>
      <circle cx="22" cy="24" r="4.5" fill="#fff"/><circle cx="50" cy="24" r="4.5" fill="#fff"/>
      <circle cx="23" cy="25" r="2.4" fill="${c.ink}"/><circle cx="51" cy="25" r="2.4" fill="${c.ink}"/>
      <path d="M28 44 q8 8 16 0" fill="none" stroke="${c.ink}" stroke-width="2" stroke-linecap="round"/>`,
    penguin: `<ellipse cx="36" cy="42" rx="18" ry="22" fill="${c.body}" stroke="${c.ink}" stroke-width="2.4"/>
      <ellipse cx="36" cy="48" rx="11" ry="14" fill="${c.belly}"/>
      <ellipse cx="18" cy="46" rx="6" ry="10" fill="${c.body}" stroke="${c.ink}" stroke-width="2"/>
      <ellipse cx="54" cy="46" rx="6" ry="10" fill="${c.body}" stroke="${c.ink}" stroke-width="2"/>
      <polygon points="32,34 36,40 40,34" fill="${c.ear}"/>
      ${commonEyes}`,
    otter: `<ellipse cx="34" cy="44" rx="24" ry="14" fill="${c.body}" stroke="${c.ink}" stroke-width="2.4"/>
      <ellipse cx="34" cy="48" rx="14" ry="8" fill="${c.belly}"/>
      <circle cx="20" cy="32" r="12" fill="${c.body}" stroke="${c.ink}" stroke-width="2.2"/>
      <path d="M56 44 q16 4 14 16 q-12 -4 -20 -6" fill="${c.body}" stroke="${c.ink}" stroke-width="2"/>
      <circle cx="16" cy="24" r="4" fill="${c.ear}" stroke="${c.ink}" stroke-width="1.6"/>
      <circle cx="28" cy="22" r="4" fill="${c.ear}" stroke="${c.ink}" stroke-width="1.6"/>
      <ellipse cx="18" cy="32" rx="3.2" ry="3.6" fill="${c.ink}"/>
      <ellipse cx="26" cy="32" rx="3.2" ry="3.6" fill="${c.ink}"/>
      <circle cx="19.2" cy="30.8" r="1" fill="#fff"/><circle cx="27.2" cy="30.8" r="1" fill="#fff"/>`,
    hedgehog: `<ellipse cx="36" cy="46" rx="22" ry="16" fill="${c.body}" stroke="${c.ink}" stroke-width="2.4"/>
      <path d="M16 40 l6 -16 l8 10 l8 -14 l8 14 l8 -10 l6 16" fill="#5C4632" stroke="${c.ink}" stroke-width="2"/>
      <ellipse cx="24" cy="50" rx="10" ry="8" fill="${c.belly}"/>
      <circle cx="18" cy="48" r="3.2" fill="${c.ink}"/>
      <circle cx="26" cy="46" r="3.2" fill="${c.ink}"/>
      <circle cx="19.2" cy="46.8" r="1" fill="#fff"/><circle cx="27.2" cy="44.8" r="1" fill="#fff"/>
      <ellipse cx="14" cy="52" rx="4" ry="2.2" fill="${c.ear}"/>`,
    koala: `<ellipse cx="36" cy="44" rx="18" ry="18" fill="${c.body}" stroke="${c.ink}" stroke-width="2.4"/>
      <circle cx="16" cy="24" r="12" fill="${c.ear}" stroke="${c.ink}" stroke-width="2.2"/>
      <circle cx="56" cy="24" r="12" fill="${c.ear}" stroke="${c.ink}" stroke-width="2.2"/>
      <circle cx="16" cy="24" r="6" fill="${c.belly}"/><circle cx="56" cy="24" r="6" fill="${c.belly}"/>
      <ellipse cx="36" cy="38" rx="7" ry="5" fill="#E8B4C4"/>
      ${commonEyes}`,
    raccoon: `<ellipse cx="36" cy="44" rx="20" ry="18" fill="${c.body}" stroke="${c.ink}" stroke-width="2.4"/>
      <circle cx="18" cy="20" r="8" fill="${c.ear}" stroke="${c.ink}" stroke-width="2"/>
      <circle cx="54" cy="20" r="8" fill="${c.ear}" stroke="${c.ink}" stroke-width="2"/>
      <ellipse cx="36" cy="50" rx="12" ry="9" fill="${c.belly}"/>
      <path d="M20 30 h32 v10 q-16 6 -32 0 z" fill="#2A2420"/>
      <path d="M56 48 q12 2 10 14 q-8 -2 -16 -4" fill="${c.body}" stroke="${c.ink}" stroke-width="2"/>
      ${commonEyes.replace('cy="30"', 'cy="32"').replace('cy="28.6"', 'cy="30.6"')}`,
    flamingo: `<path d="M40 18 q18 8 14 28 q-2 18 -16 26" fill="${c.body}" stroke="${c.ink}" stroke-width="2.3"/>
      <circle cx="36" cy="18" r="10" fill="${c.body}" stroke="${c.ink}" stroke-width="2.2"/>
      <path d="M26 18 q-10 2 -8 8 q8 0 12 -4" fill="#E07A3D" stroke="${c.ink}" stroke-width="1.6"/>
      <path d="M38 70 v8" stroke="${c.ink}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M44 70 v8" stroke="${c.ink}" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="33" cy="16" r="2.4" fill="${c.ink}"/>
      <circle cx="34.2" cy="15.2" r="0.8" fill="#fff"/>`,
    alpaca: `<ellipse cx="36" cy="48" rx="16" ry="18" fill="${c.body}" stroke="${c.ink}" stroke-width="2.4"/>
      <rect x="28" y="14" width="16" height="22" rx="8" fill="${c.body}" stroke="${c.ink}" stroke-width="2.2"/>
      <circle cx="24" cy="16" r="6" fill="${c.ear}" stroke="${c.ink}" stroke-width="2"/>
      <circle cx="48" cy="16" r="6" fill="${c.ear}" stroke="${c.ink}" stroke-width="2"/>
      <ellipse cx="36" cy="28" rx="5" ry="3.5" fill="#E8B4C4"/>
      <circle cx="32" cy="24" r="2.2" fill="${c.ink}"/>
      <circle cx="40" cy="24" r="2.2" fill="${c.ink}"/>
      <circle cx="32.8" cy="23.2" r="0.8" fill="#fff"/>
      <circle cx="40.8" cy="23.2" r="0.8" fill="#fff"/>`,
    squirrel: `<ellipse cx="34" cy="46" rx="16" ry="14" fill="${c.body}" stroke="${c.ink}" stroke-width="2.4"/>
      <circle cx="24" cy="32" r="12" fill="${c.body}" stroke="${c.ink}" stroke-width="2.2"/>
      <polygon points="16,24 18,10 26,22" fill="${c.ear}" stroke="${c.ink}" stroke-width="2"/>
      <polygon points="26,22 32,10 34,24" fill="${c.ear}" stroke="${c.ink}" stroke-width="2"/>
      <path d="M48 44 q18 -20 8 18 q-8 8 -20 2" fill="${c.body}" stroke="${c.ink}" stroke-width="2.2"/>
      <ellipse cx="22" cy="34" rx="3" ry="3.3" fill="${c.ink}"/>
      <ellipse cx="30" cy="34" rx="3" ry="3.3" fill="${c.ink}"/>
      <circle cx="23.2" cy="32.8" r="1" fill="#fff"/><circle cx="31.2" cy="32.8" r="1" fill="#fff"/>
      <ellipse cx="18" cy="40" rx="3" ry="2" fill="${c.ear}"/>`,
  };

  return `<svg viewBox="0 0 72 78" aria-hidden="true">${bodies[id] || bodies.fox}</svg>`;
}

function pickHatchAnimal(egg) {
  const scores = {};
  ANIMAL_IDS.forEach((id) => { scores[id] = 1; });

  if (egg.pets > 8) {
    ["fox", "koala", "alpaca", "panda"].forEach((id) => { scores[id] += 3; });
  }
  if (egg.jumps > 6) {
    ["squirrel", "otter", "frog", "flamingo"].forEach((id) => { scores[id] += 3; });
  }
  if (egg.nightTime > 4) {
    ["raccoon", "hedgehog", "penguin"].forEach((id) => { scores[id] += 3; });
  }
  if (egg.warmth > 12) {
    ["fox", "alpaca", "otter"].forEach((id) => { scores[id] += 2; });
  }

  const bag = [];
  ANIMAL_IDS.forEach((id) => {
    for (let i = 0; i < scores[id]; i += 1) bag.push(id);
  });
  return bag[Math.floor(Math.random() * bag.length)];
}
