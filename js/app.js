/* ESTADIA — dados demonstrativos e interações da interface */
const stays = [
  {
    id: 1, name: "Refúgio das Palmeiras", type: "Pousada", location: "Ponta Negra, Natal — RN",
    price: 289, rating: 4.9, reviews: 128, badge: "Favorito dos hóspedes",
    categories: ["Praia", "Piscina", "Romântico"], pool: true, guests: 4,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
    alt: "Piscina de hotel cercada por palmeiras",
    description: "Um refúgio acolhedor perto da praia, com piscina, café da manhã e espaços para desacelerar.",
    amenities: ["Piscina", "Wi-Fi grátis", "Café da manhã", "Ar-condicionado"]
  },
  {
    id: 2, name: "Casa Brisa do Mar", type: "Casa de temporada", location: "Praia do Francês, Marechal Deodoro — AL",
    price: 420, rating: 4.98, reviews: 86, badge: "Espaço inteiro",
    categories: ["Praia", "Piscina"], pool: true, guests: 8,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=85",
    alt: "Casa de temporada com varanda e vista para o mar",
    description: "Casa iluminada com varanda ampla, cozinha equipada e espaço para reunir família e amigos.",
    amenities: ["Piscina", "Cozinha", "Wi-Fi grátis", "Estacionamento"]
  },
  {
    id: 3, name: "Chalé Serra Verde", type: "Chalé", location: "Bananeiras — PB",
    price: 315, rating: 4.95, reviews: 64, badge: "Refúgio na natureza",
    categories: ["Natureza", "Romântico"], pool: false, guests: 3,
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1000&q=85",
    alt: "Chalé de madeira em meio à vegetação",
    description: "Um cantinho tranquilo na serra, perfeito para curtir o clima ameno e descansar a dois.",
    amenities: ["Lareira", "Wi-Fi grátis", "Cozinha", "Vista para a serra"]
  },
  {
    id: 4, name: "Hotel Jardim Central", type: "Hotel", location: "Tambaú, João Pessoa — PB",
    price: 249, rating: 4.7, reviews: 203, badge: "Ótima localização",
    categories: ["Praia", "Urbano", "Piscina"], pool: true, guests: 2,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=85",
    alt: "Interior elegante de hotel contemporâneo",
    description: "Conforto prático perto da orla, com recepção 24 horas e fácil acesso a restaurantes.",
    amenities: ["Piscina", "Recepção 24h", "Wi-Fi grátis", "Academia"]
  },
  {
    id: 5, name: "Pousada Flor de Areia", type: "Pousada", location: "Porto de Galinhas, Ipojuca — PE",
    price: 365, rating: 4.88, reviews: 142, badge: "Charme e conforto",
    categories: ["Praia", "Romântico", "Piscina"], pool: true, guests: 4,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=85",
    alt: "Piscina de pousada tropical com espreguiçadeiras",
    description: "Pousada tropical com jardins, piscina e clima descontraído para aproveitar o litoral.",
    amenities: ["Piscina", "Café da manhã", "Wi-Fi grátis", "Jardim"]
  },
  {
    id: 6, name: "Loft Centro Criativo", type: "Casa de temporada", location: "Centro, Recife — PE",
    price: 198, rating: 4.76, reviews: 91, badge: "Design urbano",
    categories: ["Urbano"], pool: false, guests: 2,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=85",
    alt: "Loft contemporâneo com sala integrada e luz natural",
    description: "Loft moderno e funcional, ideal para explorar a cidade ou trabalhar remotamente.",
    amenities: ["Wi-Fi rápido", "Cozinha", "Espaço de trabalho", "Ar-condicionado"]
  }
];

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const state = {
  category: "Todos",
  destination: "",
  maxPrice: "",
  type: "Todos",
  poolOnly: false,
  sort: "recommended",
  favorites: new Set(),
  visibleCount: 6
};

const listingGrid = $("#listingGrid");
const emptyState = $("#emptyState");
const resultsCount = $("#resultsCount");
const loadMore = $("#loadMore");
const toast = $("#toast");
let toastTimeout;

function money(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function getFilteredStays() {
  let result = stays.filter(stay => {
    const query = state.destination.trim().toLocaleLowerCase("pt-BR");
    const matchesDestination = !query || `${stay.name} ${stay.location} ${stay.type}`.toLocaleLowerCase("pt-BR").includes(query);
    const matchesCategory = state.category === "Todos" || stay.categories.includes(state.category);
    const matchesPrice = !state.maxPrice || stay.price <= Number(state.maxPrice);
    const matchesType = state.type === "Todos" || stay.type === state.type;
    const matchesPool = !state.poolOnly || stay.pool;
    return matchesDestination && matchesCategory && matchesPrice && matchesType && matchesPool;
  });

  if (state.sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (state.sort === "rating") result.sort((a, b) => b.rating - a.rating);
  return result;
}

function cardTemplate(stay) {
  const favorite = state.favorites.has(stay.id);
  return `
    <article class="stay-card">
      <div class="stay-photo">
        <img src="${escapeHTML(stay.image)}" alt="${escapeHTML(stay.alt)}" loading="lazy">
        <span class="stay-badge">${escapeHTML(stay.badge)}</span>
        <button class="favorite-button ${favorite ? "is-favorite" : ""}" data-favorite="${stay.id}" type="button"
          aria-label="${favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}" aria-pressed="${favorite}">${favorite ? "♥" : "♡"}</button>
      </div>
      <div class="stay-card-body">
        <div class="stay-card-top">
          <div><p class="stay-type">${escapeHTML(stay.type)}</p><h3 class="stay-name">${escapeHTML(stay.name)}</h3></div>
          <div class="stay-rating" aria-label="Avaliação ${stay.rating} de 5">★ <strong>${stay.rating.toFixed(2).replace(/0$/, "").replace(/\.$/, "")}</strong></div>
        </div>
        <p class="stay-location">⌖ ${escapeHTML(stay.location)}</p>
        <p class="stay-description">${escapeHTML(stay.description)}</p>
        <div class="stay-card-bottom">
          <p class="stay-price"><strong>${money(stay.price)}</strong> / diária</p>
          <button class="details-button" data-details="${stay.id}" type="button">Ver detalhes →</button>
        </div>
      </div>
    </article>`;
}

function renderStays() {
  const filtered = getFilteredStays();
  const visible = filtered.slice(0, state.visibleCount);
  listingGrid.innerHTML = visible.map(cardTemplate).join("");
  listingGrid.hidden = visible.length === 0;
  emptyState.hidden = visible.length !== 0;
  resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "hospedagem encontrada" : "hospedagens encontradas"}`;
  loadMore.hidden = filtered.length <= state.visibleCount;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2800);
}

function setCategory(category) {
  state.category = category;
  $$(".category-chip").forEach(button => {
    const active = button.dataset.category === category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  state.visibleCount = 6;
  renderStays();
}

function openDetails(id) {
  const stay = stays.find(item => item.id === Number(id));
  if (!stay) return;
  const dialogContent = $("#dialogContent");
  dialogContent.innerHTML = `
    <img class="dialog-image" src="${escapeHTML(stay.image)}" alt="${escapeHTML(stay.alt)}">
    <div class="dialog-body">
      <p class="stay-type">${escapeHTML(stay.type)}</p>
      <h2 id="dialogTitle">${escapeHTML(stay.name)}</h2>
      <p>⌖ ${escapeHTML(stay.location)} · <span style="color:#d89b32">★</span> ${stay.rating} (${stay.reviews} avaliações)</p>
      <p>${escapeHTML(stay.description)}</p>
      <div class="dialog-meta">${stay.amenities.map(item => `<span>${escapeHTML(item)}</span>`).join("")}<span>Até ${stay.guests} hóspedes</span></div>
      <div class="dialog-reserve">
        <div><strong>${money(stay.price)}</strong><span> / diária</span><p style="margin:4px 0 0;font-size:.75rem">Preço ilustrativo, sujeito a alteração.</p></div>
        <button class="primary-button" id="reserveDemo" type="button">Solicitar reserva →</button>
      </div>
    </div>`;
  $("#stayDialog").showModal();
  $("#reserveDemo").addEventListener("click", () => {
    $("#stayDialog").close();
    showToast("Este é um protótipo. Conecte um sistema de reservas para receber solicitações reais.");
  });
}

$("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  state.destination = $("#destination").value;
  state.visibleCount = 6;
  renderStays();
  $("#hospedagens").scrollIntoView({ behavior: "smooth" });
});

$("#checkin").addEventListener("change", () => {
  const checkin = $("#checkin").value;
  $("#checkout").min = checkin || "";
  if (checkin && $("#checkout").value && $("#checkout").value <= checkin) {
    $("#checkout").value = "";
  }
});

$("#categoryList").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});

listingGrid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const detailsButton = event.target.closest("[data-details]");
  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      showToast("Hospedagem removida dos favoritos.");
    } else {
      state.favorites.add(id);
      showToast("Hospedagem adicionada aos favoritos.");
    }
    renderStays();
  }
  if (detailsButton) openDetails(detailsButton.dataset.details);
});

$("#sortSelect").addEventListener("change", event => {
  state.sort = event.target.value;
  renderStays();
});

$("#filtersToggle").addEventListener("click", () => {
  const panel = $("#filterPanel");
  const isHidden = panel.hidden;
  panel.hidden = !isHidden;
  $("#filtersToggle").setAttribute("aria-expanded", String(isHidden));
});

$("#maxPrice").addEventListener("input", event => {
  state.maxPrice = event.target.value;
  state.visibleCount = 6;
  renderStays();
});

$("#typeFilter").addEventListener("change", event => {
  state.type = event.target.value;
  state.visibleCount = 6;
  renderStays();
});

$("#poolFilter").addEventListener("change", event => {
  state.poolOnly = event.target.checked;
  state.visibleCount = 6;
  renderStays();
});

$("#clearFilters").addEventListener("click", () => {
  state.maxPrice = "";
  state.type = "Todos";
  state.poolOnly = false;
  $("#maxPrice").value = "";
  $("#typeFilter").value = "Todos";
  $("#poolFilter").checked = false;
  state.visibleCount = 6;
  renderStays();
});

$("#resetSearch").addEventListener("click", () => {
  state.destination = "";
  $("#destination").value = "";
  state.category = "Todos";
  setCategory("Todos");
  $("#maxPrice").value = "";
  $("#typeFilter").value = "Todos";
  $("#poolFilter").checked = false;
  state.maxPrice = "";
  state.type = "Todos";
  state.poolOnly = false;
  renderStays();
});

loadMore.addEventListener("click", () => {
  state.visibleCount += 6;
  renderStays();
});

$("#dialogClose").addEventListener("click", () => $("#stayDialog").close());
$("#stayDialog").addEventListener("click", event => {
  if (event.target === $("#stayDialog")) $("#stayDialog").close();
});

$("#menuToggle").addEventListener("click", () => {
  const nav = $(".main-nav");
  const open = nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(open));
  $("#menuToggle").setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});

$$(".main-nav a").forEach(link => link.addEventListener("click", () => {
  $(".main-nav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
}));

$("#year").textContent = new Date().getFullYear();
renderStays();
