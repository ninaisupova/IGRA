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
  { id: "rug", name: "Коврик", emoji: "🧶", price: 8, hint: "мягко сидеть" },
  { id: "plant", name: "Растение", emoji: "🌿", price: 10, hint: "зелёный уголок" },
  { id: "poster", name: "Постер", emoji: "🖼", price: 6, hint: "украшение стены" },
  { id: "cushion", name: "Подушка", emoji: "🛋", price: 8, hint: "для дневного сна" },
  { id: "toys", name: "Ящик игрушек", emoji: "🪀", price: 12, hint: "сам найдёт чем заняться" },
  { id: "lamp", name: "Лампа", emoji: "💡", price: 14, hint: "уютнее ночью" },
  { id: "curtains", name: "Шторы", emoji: "🪟", price: 16, hint: "комната как дом" },
  { id: "fountain", name: "Поилка", emoji: "💧", price: 18, hint: "свежая водичка" },
];

function animalSvg(id) {
  const a = ANIMALS[id];
  const c = a.colors;
  const ink = c.ink;
  const eyes = (cx, cy) => `
    <ellipse class="blush" cx="${cx - 13}" cy="${cy + 7}" rx="4.2" ry="2.6" fill="#E8A8B4" opacity="0.55"/>
    <ellipse class="blush" cx="${cx + 13}" cy="${cy + 7}" rx="4.2" ry="2.6" fill="#E8A8B4" opacity="0.55"/>
    <g class="eyes">
      <ellipse cx="${cx - 7}" cy="${cy}" rx="4.6" ry="5.2" fill="${ink}"/>
      <ellipse cx="${cx + 7}" cy="${cy}" rx="4.6" ry="5.2" fill="${ink}"/>
      <circle cx="${cx - 5.4}" cy="${cy - 1.6}" r="1.6" fill="#fff"/>
      <circle cx="${cx + 8.6}" cy="${cy - 1.6}" r="1.6" fill="#fff"/>
      <circle cx="${cx - 6.2}" cy="${cy + 1.2}" r="0.7" fill="#fff" opacity="0.7"/>
    </g>
    <ellipse cx="${cx}" cy="${cy + 6.5}" rx="2.4" ry="1.7" fill="${ink}"/>
    <path d="M${cx - 3.2} ${cy + 10.5} q3.2 3.8 6.4 0" fill="none" stroke="${ink}" stroke-width="1.7" stroke-linecap="round"/>`;

  const bodies = {
    fox: `
      <ellipse cx="22" cy="86" rx="8" ry="6" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="50" cy="86" rx="8" ry="6" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <path class="tail" d="M58 58 q22 -8 18 22 q-16 -6 -26 -8" fill="${c.body}" stroke="${ink}" stroke-width="2.2"/>
      <path d="M68 72 q8 6 6 14" fill="${c.belly}"/>
      <ellipse cx="36" cy="68" rx="22" ry="18" fill="${c.body}" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="36" cy="74" rx="12" ry="10" fill="${c.belly}"/>
      <circle cx="36" cy="36" r="18" fill="${c.body}" stroke="${ink}" stroke-width="2.4"/>
      <polygon points="20,28 24,8 32,26" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <polygon points="40,26 48,8 52,28" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <polygon points="23,24 25,14 30,24" fill="${c.belly}"/>
      <polygon points="42,24 47,14 49,24" fill="${c.belly}"/>
      ${eyes(36, 36)}`,
    panda: `
      <ellipse cx="22" cy="86" rx="9" ry="7" fill="#2A2420" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="50" cy="86" rx="9" ry="7" fill="#2A2420" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="36" cy="68" rx="22" ry="18" fill="#fff" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="16" cy="66" rx="8" ry="12" fill="#2A2420" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="56" cy="66" rx="8" ry="12" fill="#2A2420" stroke="${ink}" stroke-width="2"/>
      <circle cx="36" cy="34" r="20" fill="#fff" stroke="${ink}" stroke-width="2.4"/>
      <circle cx="18" cy="18" r="9" fill="#2A2420" stroke="${ink}" stroke-width="2"/>
      <circle cx="54" cy="18" r="9" fill="#2A2420" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="27" cy="34" rx="8" ry="7" fill="#2A2420"/>
      <ellipse cx="45" cy="34" rx="8" ry="7" fill="#2A2420"/>
      ${eyes(36, 34)}`,
    frog: `
      <ellipse cx="20" cy="84" rx="10" ry="7" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="52" cy="84" rx="10" ry="7" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="36" cy="66" rx="24" ry="18" fill="${c.body}" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="36" cy="72" rx="14" ry="10" fill="${c.belly}"/>
      <circle cx="22" cy="30" r="12" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <circle cx="50" cy="30" r="12" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <g class="eyes">
      <circle cx="22" cy="30" r="5.2" fill="#fff"/><circle cx="50" cy="30" r="5.2" fill="#fff"/>
      <circle cx="23" cy="31" r="2.6" fill="${ink}"/><circle cx="51" cy="31" r="2.6" fill="${ink}"/>
      </g>
      <path d="M28 62 q8 10 16 0" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>`,
    penguin: `
      <ellipse cx="24" cy="88" rx="7" ry="5" fill="#E07A3D" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="48" cy="88" rx="7" ry="5" fill="#E07A3D" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="36" cy="58" rx="20" ry="26" fill="${c.body}" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="36" cy="64" rx="13" ry="18" fill="${c.belly}"/>
      <ellipse cx="16" cy="60" rx="7" ry="12" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="56" cy="60" rx="7" ry="12" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <circle cx="36" cy="28" r="16" fill="${c.body}" stroke="${ink}" stroke-width="2.3"/>
      <ellipse cx="36" cy="32" rx="9" ry="8" fill="${c.belly}"/>
      <polygon points="32,34 36,42 40,34" fill="${c.ear}"/>
      ${eyes(36, 26)}`,
    otter: `
      <ellipse cx="18" cy="86" rx="8" ry="6" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="40" cy="86" rx="8" ry="6" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <path class="tail" d="M52 62 q24 4 18 24 q-16 -4 -24 -8" fill="${c.body}" stroke="${ink}" stroke-width="2.2"/>
      <ellipse cx="32" cy="66" rx="22" ry="16" fill="${c.body}" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="32" cy="70" rx="13" ry="9" fill="${c.belly}"/>
      <circle cx="22" cy="38" r="16" fill="${c.body}" stroke="${ink}" stroke-width="2.3"/>
      <circle cx="12" cy="26" r="5" fill="${c.ear}" stroke="${ink}" stroke-width="1.8"/>
      <circle cx="30" cy="24" r="5" fill="${c.ear}" stroke="${ink}" stroke-width="1.8"/>
      ${eyes(22, 38)}`,
    hedgehog: `
      <ellipse cx="24" cy="86" rx="8" ry="6" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="48" cy="86" rx="8" ry="6" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <path d="M14 58 l8 -20 l10 12 l10 -18 l10 18 l10 -12 l8 20" fill="#5C4632" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="36" cy="68" rx="22" ry="16" fill="${c.body}" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="26" cy="72" rx="11" ry="8" fill="${c.belly}"/>
      <circle cx="20" cy="64" r="10" fill="${c.belly}" stroke="${ink}" stroke-width="2"/>
      <g class="eyes">
      <circle cx="16" cy="62" r="2.8" fill="${ink}"/>
      <circle cx="24" cy="60" r="2.8" fill="${ink}"/>
      <circle cx="17.2" cy="60.8" r="0.9" fill="#fff"/>
      <circle cx="25.2" cy="58.8" r="0.9" fill="#fff"/>
      </g>
      <ellipse cx="12" cy="66" rx="4" ry="2.2" fill="${c.ear}"/>`,
    koala: `
      <ellipse cx="22" cy="86" rx="8" ry="6" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="50" cy="86" rx="8" ry="6" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="36" cy="68" rx="20" ry="18" fill="${c.body}" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="36" cy="74" rx="11" ry="9" fill="${c.belly}"/>
      <circle cx="36" cy="36" r="18" fill="${c.body}" stroke="${ink}" stroke-width="2.4"/>
      <circle cx="16" cy="22" r="13" fill="${c.ear}" stroke="${ink}" stroke-width="2.2"/>
      <circle cx="56" cy="22" r="13" fill="${c.ear}" stroke="${ink}" stroke-width="2.2"/>
      <circle cx="16" cy="22" r="6" fill="${c.belly}"/><circle cx="56" cy="22" r="6" fill="${c.belly}"/>
      <ellipse cx="36" cy="42" rx="7" ry="5" fill="#E8B4C4"/>
      ${eyes(36, 34)}`,
    raccoon: `
      <ellipse cx="22" cy="86" rx="8" ry="6" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="50" cy="86" rx="8" ry="6" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <path class="tail" d="M56 64 q18 4 14 22 q-12 -4 -20 -8" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="36" cy="68" rx="20" ry="17" fill="${c.body}" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="36" cy="74" rx="12" ry="9" fill="${c.belly}"/>
      <circle cx="36" cy="34" r="18" fill="${c.body}" stroke="${ink}" stroke-width="2.3"/>
      <circle cx="18" cy="18" r="8" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <circle cx="54" cy="18" r="8" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <path d="M20 32 h32 v12 q-16 7 -32 0 z" fill="#2A2420"/>
      ${eyes(36, 36)}`,
    flamingo: `
      <path d="M30 88 q2 -18 4 -36" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M42 88 q-2 -16 0 -34" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="38" cy="48" rx="16" ry="20" fill="${c.body}" stroke="${ink}" stroke-width="2.3"/>
      <circle cx="34" cy="22" r="12" fill="${c.body}" stroke="${ink}" stroke-width="2.2"/>
      <path d="M22 22 q-12 2 -10 9 q10 0 14 -5" fill="#E07A3D" stroke="${ink}" stroke-width="1.6"/>
      <g class="eyes">
      <circle cx="31" cy="20" r="2.6" fill="${ink}"/>
      <circle cx="32.2" cy="19" r="0.9" fill="#fff"/>
      </g>`,
    alpaca: `
      <ellipse cx="24" cy="88" rx="7" ry="5" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="48" cy="88" rx="7" ry="5" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="36" cy="68" rx="20" ry="20" fill="${c.body}" stroke="${ink}" stroke-width="2.4"/>
      <rect x="28" y="18" width="16" height="34" rx="8" fill="${c.body}" stroke="${ink}" stroke-width="2.2"/>
      <circle cx="24" cy="20" r="7" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <circle cx="52" cy="20" r="7" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="36" cy="36" rx="6" ry="4" fill="#E8B4C4"/>
      <g class="eyes">
      <circle cx="32" cy="30" r="2.4" fill="${ink}"/>
      <circle cx="40" cy="30" r="2.4" fill="${ink}"/>
      <circle cx="32.8" cy="29.2" r="0.8" fill="#fff"/>
      <circle cx="40.8" cy="29.2" r="0.8" fill="#fff"/>
      </g>`,
    squirrel: `
      <ellipse cx="20" cy="86" rx="7" ry="6" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="40" cy="86" rx="7" ry="6" fill="${c.body}" stroke="${ink}" stroke-width="2"/>
      <path class="tail" d="M48 58 q24 -24 10 26 q-10 10 -24 2" fill="${c.body}" stroke="${ink}" stroke-width="2.2"/>
      <ellipse cx="32" cy="68" rx="16" ry="16" fill="${c.body}" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="32" cy="74" rx="9" ry="8" fill="${c.belly}"/>
      <circle cx="24" cy="38" r="16" fill="${c.body}" stroke="${ink}" stroke-width="2.3"/>
      <polygon points="14,30 16,12 26,28" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      <polygon points="26,28 34,12 36,30" fill="${c.ear}" stroke="${ink}" stroke-width="2"/>
      ${eyes(24, 38)}
      <ellipse cx="16" cy="46" rx="3.2" ry="2.2" fill="${c.ear}"/>`,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 96" aria-hidden="true">${bodies[id] || bodies.fox}</svg>`;
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
