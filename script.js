/* =====================================
   DATA
===================================== */

const VOYAGES = [
  {
    id: "newyork",
    name: "New York",
    date: "MARS 2026",
    description:
      "Exploration urbaine : Empire State Building, Central Park et Brooklyn Bridge au coucher du soleil.",
    lat: 40.748817,
    lng: -73.985428,
    image:
      "https://images.unsplash.com/photo-1496588152823-e8f25d7c7d9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "aiguilles",
    name: "Aiguilles Rouges",
    date: "MAI 2026",
    description:
      "Aventure nature : bivouac en altitude et randonnée face au Mont-Blanc.",
    lat: 45.9599,
    lng: 6.8766,
    image:
      "https://images.unsplash.com/photo-1464822759844-d150baec0494?auto=format&fit=crop&w=1200&q=80"
  }
];

let map, currentLayer;
const markers = {};

/* =====================================
   THEME
===================================== */

const tiles = {
  dark: L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  ),
  light: L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  )
};

function applyTheme(theme) {
  document.body.classList.toggle("light", theme === "light");

  if (map) {
    if (currentLayer) map.removeLayer(currentLayer);
    currentLayer = theme === "light" ? tiles.light : tiles.dark;
    currentLayer.addTo(map);
  }

  localStorage.setItem("theme", theme);
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);

  const btn = document.getElementById("themeToggle");

  if (btn) {
    btn.addEventListener("click", () => {
      const light = document.body.classList.contains("light");
      applyTheme(light ? "dark" : "light");
    });
  }
}

/* =====================================
   MAP PAGE
===================================== */

function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  map = L.map("map", {
    minZoom: 2,
    maxZoom: 18
  }).setView([20,0], 2);

  applyTheme(localStorage.getItem("theme") || "dark");

  VOYAGES.forEach(v => {
    const marker = L.marker([v.lat, v.lng]).addTo(map);

    marker.bindPopup(`
      <strong>${v.name}</strong><br>
      ${v.date}<br>
      ${v.description}
    `);

    markers[v.id] = marker;
  });

  handleDeepLink();
}

/* =====================================
   DEEP LINK (GOALS -> MAP)
===================================== */

function handleDeepLink() {
  const hash = location.hash.replace("#", "");
  if (!hash) return;

  const v = VOYAGES.find(x => x.id === hash);
  if (!v) return;

  setTimeout(() => {
    map.flyTo([v.lat, v.lng], 8, { duration: 1.6 });
    markers[v.id].openPopup();
  }, 400);
}

/* =====================================
   GOALS PAGE
===================================== */

function initGoals() {
  const grid = document.getElementById("goalsGrid");
  if (!grid) return;

  VOYAGES.forEach(v => {
    const card = document.createElement("article");
    card.className = "goal-card";

    card.innerHTML = `
      <img loading="lazy" src="${v.image}" alt="${v.name}">
      <div class="goal-content">
        <h3>${v.name}</h3>
        <div class="badge">${v.date}</div>
        <p>${v.description}</p>
        <a class="goal-link" href="index.html#${v.id}">
          Voir sur la carte
        </a>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =====================================
   INIT SAFE
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMap();
  initGoals();
});
