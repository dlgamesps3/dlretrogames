const search=document.querySelector("#search"),grid=document.querySelector("#games");let active="Todos",term="";
function applyFilters(){document.querySelectorAll(".game-card").forEach(card=>{const matchSystem=active==="Todos"||card.dataset.system===active;const matchText=card.dataset.name.includes(term)||card.dataset.system.toLowerCase().includes(term);card.hidden=!(matchSystem&&matchText)});}
document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{active=btn.dataset.filter;document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b===btn));applyFilters();}));
if(search)search.addEventListener("input",()=>{term=search.value.trim().toLowerCase();applyFilters();});
document.querySelectorAll("[data-pick]").forEach(link=>link.addEventListener("click",()=>{active=link.dataset.pick;document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b.dataset.filter===active));applyFilters();}));
