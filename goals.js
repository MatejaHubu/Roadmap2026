function initTheme(){
  const saved = localStorage.getItem("theme") || "dark";
  document.body.classList.toggle("light", saved==="light");

  document.getElementById("themeToggle")
    .addEventListener("click",()=>{
      const light=document.body.classList.toggle("light");
      localStorage.setItem("theme", light?"light":"dark");
    });
}

function initGoals(){
  const grid=document.getElementById("goalsGrid");

  VOYAGES.forEach(v=>{
    const card=document.createElement("article");
    card.className="goal-card";

    card.innerHTML=`
      <img src="${v.image}" alt="${v.name}">
      <div class="goal-content">
        <h3>${v.name}</h3>
        <span class="badge">${v.date}</span>
        <p>${v.description}</p>
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
