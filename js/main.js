const searchInput = document.querySelector("#search-game");
const consoleFilter = document.querySelector("#filter-console");
const grid = document.querySelector("#games-list");

function normalizeConsole(value) {
  const text = String(value || "").toLowerCase();

  if (text.includes("snes") || text.includes("super nintendo")) {
    return "snes";
  }

  return text;
}

function normalizeName(value) {
  return String(value || "").trim().toLowerCase();
}

function applyFilters() {
  const term = normalizeName(searchInput?.value);
  const system = consoleFilter?.value || "todos";

  document.querySelectorAll("#games-list .game").forEach(card => {
    const name = normalizeName(card.dataset.name);
    const consoleName = normalizeConsole(card.dataset.console);

    const matchesName = name.includes(term);
    const matchesConsole =
      system === "todos" || consoleName === system;

    card.style.display =
      matchesName && matchesConsole ? "" : "none";
  });
}

function addGame(game) {
  if (!grid || !game.name) return;

  const name = String(game.name).trim();

  const alreadyExists = [...grid.querySelectorAll(".game")]
    .some(card => normalizeName(card.dataset.name) === normalizeName(name));

  if (alreadyExists) return;

  const consoleName = normalizeConsole(game.console);
  const card = document.createElement("article");

  card.className = "game";
  card.dataset.name = normalizeName(name);
  card.dataset.console = consoleName;

  const image = document.createElement("img");
  image.src = game.coverUrl || "img/capas/sem-capa.jpg";
  image.alt = name;
  image.loading = "lazy";

  const info = document.createElement("div");
  info.className = "game-info";

  const title = document.createElement("h3");
  title.textContent = name;

  info.appendChild(title);

  if (game.onlineUrl) {
    const online = document.createElement("a");
    online.className = "btn";
    online.href = game.onlineUrl;
    online.textContent = "JOGAR ONLINE";
    online.target = "_blank";
    online.rel = "noopener noreferrer";
    info.appendChild(online);
  }

  if (game.downloadUrl) {
    const download = document.createElement("a");
    download.className = "btn";
    download.href = game.downloadUrl;
    download.textContent = "BAIXAR JOGO";
    download.target = "_blank";
    download.rel = "noopener noreferrer";
    download.style.marginTop = "8px";
    info.appendChild(download);
  }

  card.append(image, info);
  grid.appendChild(card);
}

async function loadNewGames() {
  try {
    const response = await fetch("./games.json", {
      cache: "no-store"
    });

    if (!response.ok) return;

    const games = await response.json();

    if (Array.isArray(games)) {
      games.forEach(addGame);
    }
  } catch (error) {
    console.error("Não foi possível carregar os novos jogos:", error);
  }

  applyFilters();
}

searchInput?.addEventListener("input", applyFilters);
consoleFilter?.addEventListener("change", applyFilters);

loadNewGames();
