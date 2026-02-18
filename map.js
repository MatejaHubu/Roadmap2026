let map;
let currentLayer;
const markers = {};

const layers = {
  dark: L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  ),
  light: L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  )
};

function applyTheme(mode){
  document.body.classList.toggle("light", mode==="light");

  if(currentLayer) map.removeLayer(currentLayer);
  currentLayer = mode==="light" ? layers.light : layers.dark;
  currentLayer.addTo(map);

  localStorage.setItem("theme",mode);
}

function initTheme(){
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);

  document.getElementById("themeToggle")
    .addEventListener("click", ()=>{
      const light = document.body.classList.contains("light");
      applyTheme(light ? "dark":"light");
    });
}

function initMap(){
  map = L.map("map",{minZoom:2,maxZoom:18})
        .setView([20,0],2);

  initTheme();

  VOYAGES.forEach(v=>{
    const marker=L.marker([v.lat,v.lng]).addTo(map);

    marker.bindPopup(`
      <strong>${v.name}</strong><br>
      ${v.date}<br>
      ${v.description}
    `);

    marker.on("click",()=>{
      map.flyTo([v.lat,v.lng],8,{duration:1.5});
    });

    markers[v.id]=marker;
  });

  const id=location.hash.replace("#","");
  if(id && markers[id]){
    const v=VOYAGES.find(x=>x.id===id);
    setTimeout(()=>{
      map.flyTo([v.lat,v.lng],8,{duration:1.5});
      markers[id].openPopup();
    },400);
  }
}

document.addEventListener("DOMContentLoaded",initMap);
