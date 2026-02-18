const SUPABASE_URL =
  "https://ynexnpdwqnwfufjphcay.supabase.co";

const SUPABASE_KEY =
  "TA_PUBLISHABLE_KEY";

const db = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

function initTheme(){
  const saved = localStorage.getItem("theme") || "dark";
  document.body.classList.toggle("light", saved==="light");

  document.getElementById("themeToggle")
    .addEventListener("click", ()=>{
      const light = document.body.classList.toggle("light");
      localStorage.setItem("theme", light?"light":"dark");
    });
}

async function initGoals(){

  const grid=document.getElementById("goalsGrid");

  const { data } = await db
    .from("voyages")
    .select("*");

  data.forEach(v=>{

    const card=document.createElement("article");
    card.className="goal-card";

    card.innerHTML=`
      <img src="${v.image || ""}">
      <div class="goal-content">
        <h3>${v.name}</h3>
        <span class="badge">${v.date_label || ""}</span>
        <p>${v.description || ""}</p>
        <a class="goal-link" href="index.html#${v.id}">
          Voir sur la carte
        </a>
      </div>
    `;

    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  initTheme();
  initGoals();
});
