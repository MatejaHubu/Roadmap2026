let map;
let currentLayer;
const markers = {};

let addMode = false;

/* =========================
   SUPABASE
========================= */

const SUPABASE_URL =
  "https://ynexnpdwqnwfufjphcay.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_qnwTt7otwlcjCUX35s0fJw_DG34I6xN";

const db = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* =========================
   TILE LAYERS
========================= */

const layers = {
  dark: L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  ),
  light: L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  )
};

/* =========================
   THEME
========================= */

function applyTheme(mode) {
  document.body.classList.toggle("light", mode === "light");

  if (currentLayer) map.removeLayer(currentLayer);

  currentLayer = mode === "light" ? layers.light : layers.dark;
  currentLayer.addTo(map);

  localStorage.setItem("theme", mode);
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);

  document.getElementById("themeToggle")
    .addEventListener("click", () => {
      const light = document.body.classList.contains("light");
      applyTheme(light ? "dark" : "light");
    });
}

/* =========================
   MAP
========================= */

function initMap() {

  map = L.map("map", {
    minZoom: 2,
    maxZoom: 18
  }).setView([20,0],2);

  initTheme();

  /* MODE AJOUT */
  map.on("click", async (e) => {

    if (!addMode) return;

    const name = prompt("Nom du lieu :");
    if (!name) return;

    const dateLabel = prompt("Date (ex: Mars 2026)");
    const description = prompt("Description");

    const newPlace = {
      name,
      date_label: dateLabel,
      description,
      lat: e.latlng.lat,
      lng: e.latlng.lng
    };

    const { data, error } = await db
      .from("voyages")
      .insert([newPlace])
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    addMarker(data);

    addMode = false;
    document.body.classList.remove("add-mode");

  });

}

/* =========================
   MARKERS
========================= */

function addMarker(v){

  const marker = L.marker([v.lat,v.lng]).addTo(map);

  marker.bindPopup(`
    <strong>${v.name}</strong><br>
    ${v.date_label || ""}<br>
    ${v.description || ""}
  `);

  marker.on("click", () => {
    map.flyTo([v.lat,v.lng],8,{duration:1.5});
  });

  markers[v.id] = marker;
}

/* =========================
   LOAD DB
========================= */

async function loadVoyages(){

  const { data, error } = await db
    .from("voyages")
    .select("*");

  if(error){
    console.error(error);
    return;
  }

  data.forEach(addMarker);
}

/* =========================
   DEEP LINK (GOALS → MAP)
========================= */

function handleDeepLink(){

  const id = location.hash.replace("#","");
  if(!id) return;

  const marker = markers[id];
  if(!marker) return;

  const latlng = marker.getLatLng();

  map.flyTo(latlng,8,{duration:1.6});

  setTimeout(()=>marker.openPopup(),500);
}

/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", async ()=>{

  initMap();

  await loadVoyages();

  handleDeepLink();

  document.getElementById("addPlaceBtn")
    .addEventListener("click", () => {

      addMode = !addMode;

      document.body.classList.toggle("add-mode", addMode);

      alert(addMode
        ? "Clique sur la carte pour placer la punaise"
        : "Mode ajout désactivé");
    });
});
