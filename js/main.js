const searchInput = document.querySelector("#search-game");
const consoleFilter = document.querySelector("#filter-console");
const grid = document.querySelector("#games-list");

function normalizeConsole(value) {
  const text = String(value || "").toLowerCase().trim();

  if (text.includes("snes") || text.includes("super nintendo")) return "SNES";
  if (text.includes("gba") || text.includes("game boy advance")) return "GBA";
  if (text.includes("nes")) return "NES";
  if (text.includes("mega") || text.includes("genesis")) return "Mega-Drive";
  if (text.includes("ps1") || text.includes("playstation")) return "PS1";

  return text.replace(/[^a-z0-9]+/g, "-");
}

function normalizeName(value) {
  return String(value || "").trim().toLowerCase();
}

function slugify(value) {
  return String(value || "jogo")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function applyFilters() {
  const term = normalizeName(searchInput?.value);
  const system = consoleFilter?.value || "todos";

  document.querySelectorAll("#games-list .game").forEach(card => {
    const name = normalizeName(card.dataset.name);
    const consoleName = String(card.dataset.console || "").toLowerCase();

    const matchesName = name.includes(term);
    const matchesConsole =
      system === "todos" || consoleName === system.toLowerCase();

    card.style.display =
      matchesName && matchesConsole ? "" : "none";
  });
}

function addGame(game) {
  if (!grid || !game.name) return;

  const name = String(game.name).trim();
  const consoleName = normalizeConsole(game.console);
  const slug = game.slug || slugify(name);

  const existing = [...grid.querySelectorAll(".game")]
    .find(card => normalizeName(card.dataset.name) === normalizeName(name));

  const card = existing || document.createElement("article");

  card.className = "game";
  card.dataset.name = normalizeName(name);
  card.dataset.console = consoleName.toLowerCase();

  const image = card.querySelector("img") || document.createElement("img");
  image.src = game.coverUrl || "img/capas/sem-capa.jpg";
  image.alt = name;
  image.loading = "lazy";
  image.onerror = function() {
    this.onerror = null;
    this.src = "img/capas/sem-capa.jpg";
  };

  const info = document.createElement("div");
  info.className = "game-info";

  const title = document.createElement("h3");
  title.textContent = name;

  const enter = document.createElement("a");
  enter.className = "btn";
  enter.textContent = "ENTRAR";
  enter.href =
    game.pageUrl ||
    game.page ||
    `pages/jogos/${consoleName}/${slug}.html`;

  info.appendChild(title);

  if (game.onlineUrl) {
    const online = document.createElement("a");
    online.className = "btn";
    online.href = game.onlineUrl;
    online.textContent = "JOGAR ONLINE";
    online.style.marginTop = "8px";
    info.appendChild(online);
  }

  if (game.downloadUrl) {
    const download = document.createElement("a");
    download.className = "btn";
    download.href = game.downloadUrl;
    download.textContent = "BAIXAR JOGO";
    download.style.marginTop = "8px";
    download.target = "_blank";
    download.rel = "noopener noreferrer";
    info.appendChild(download);
  }

  info.appendChild(enter);
  card.replaceChildren(image, info);

  if (!existing) {
    grid.appendChild(card);
  }
}

async function loadNewGames() {
  try {
    const response = await fetch("./games.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar games.json");
    }

    const data = await response.json();
    const games = Array.isArray(data)
      ? data
      : Array.isArray(data.games) ? data.games : [];

    games.forEach(addGame);

  } catch (error) {
    console.error("Não foi possível carregar os jogos:", error);
  }

  applyFilters();
}

searchInput?.addEventListener("input", applyFilters);
consoleFilter?.addEventListener("change", applyFilters);

loadNewGames();
