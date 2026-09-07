/* ============ DATA — Catálogo (RF03, RF04, RF05) ============ */
const productos = [
  { nombre:"Rollitos de primavera", cat:"entradas", precio:14000, desc:"Crujientes rollos rellenos de vegetales salteados, con salsa agridulce." },
  { nombre:"Dumplings de cerdo al vapor", cat:"entradas", precio:18000, desc:"Seis unidades rellenas de cerdo y jengibre, con salsa de soya." },
  { nombre:"Sopa miso", cat:"entradas", precio:12000, desc:"Caldo de miso con tofu, alga wakame y cebolla larga." },
  { nombre:"Ensalada de pepino picante", cat:"entradas", precio:10000, desc:"Pepino fresco, ajonjolí tostado y aderezo picante ligero." },
  { nombre:"Ramen tonkotsu", cat:"platos", precio:32000, desc:"Caldo de cerdo cocido a fuego lento, huevo marinado y cerdo chashu." },
  { nombre:"Pad thai de camarones", cat:"platos", precio:34000, desc:"Fideos de arroz salteados con camarones, maní y tamarindo." },
  { nombre:"Arroz frito con vegetales", cat:"platos", precio:24000, desc:"Arroz salteado al wok con vegetales de estación y huevo." },
  { nombre:"Pollo teriyaki", cat:"platos", precio:30000, desc:"Pollo a la plancha bañado en salsa teriyaki, con arroz al vapor." },
  { nombre:"Curry rojo de pollo", cat:"platos", precio:29000, desc:"Curry cremoso con leche de coco, pollo y vegetales de estación." },
  { nombre:"Té verde jazmín", cat:"bebidas", precio:8000, desc:"Infusión aromática servida caliente o fría." },
  { nombre:"Limonada de jengibre", cat:"bebidas", precio:9000, desc:"Limonada natural con un toque picante de jengibre fresco." },
  { nombre:"Cerveza asiática", cat:"bebidas", precio:12000, desc:"Cerveza lager tipo asiática, servida bien fría." },
  { nombre:"Agua con gas", cat:"bebidas", precio:6000, desc:"Botella individual de agua con gas." }
];

const money = n => "$" + n.toLocaleString("es-CO");

function renderMenu(filter="todos", query=""){
  const grid = document.getElementById("menuGrid");
  const empty = document.getElementById("menuEmpty");
  const q = query.trim().toLowerCase();
  const items = productos.filter(p =>
    (filter === "todos" || p.cat === filter) &&
    (q === "" || p.nombre.toLowerCase().includes(q))
  );
  grid.innerHTML = items.map(p => `
    <article class="menu__card">
      <span class="menu__tag">${p.cat}</span>
      <div class="menu__card-top">
        <h3>${p.nombre}</h3>
        <span class="menu__price">${money(p.precio)}</span>
      </div>
      <p>${p.desc}</p>
    </article>
  `).join("");
  empty.style.display = items.length === 0 ? "block" : "none";
}
renderMenu();

/* Filtro por categoría — RF07 */
const tabs = document.querySelectorAll(".menu__tab");
let currentFilter = "todos";
tabs.forEach(tab => tab.addEventListener("click", () => {
  tabs.forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  currentFilter = tab.dataset.filter;
  renderMenu(currentFilter, document.getElementById("menuSearch").value);
}));

/* Búsqueda por nombre — RF06 */
document.getElementById("menuSearch").addEventListener("input", e => {
  renderMenu(currentFilter, e.target.value);
});

/* ============ NAV: menú móvil + estado activo ============ */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
navToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
  navToggle.classList.toggle("open");
});
document.querySelectorAll(".nav__links a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.classList.remove("open");
  });
});

const sections = document.querySelectorAll("section[id], header[id]");
const navLinks = document.querySelectorAll(".nav__links a");
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(l => l.classList.remove("active"));
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if(active) active.classList.add("active");
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => navObserver.observe(s));

/* ============ REVEAL ON SCROLL ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add("in"); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ============ VALIDACIÓN DE FORMULARIOS — RF13 ============ */
function showError(field, show){
  field.closest(".field").classList.toggle("invalid", show);
}
function validate(form, rules){
  let valid = true;
  rules.forEach(({ id, test }) => {
    const field = document.getElementById(id);
    const ok = test(field.value.trim());
    showError(field, !ok);
    if(!ok) valid = false;
  });
  return valid;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[0-9+()\s-]{7,}$/;

/* Formulario de reserva — RF10, RF11, RF12, RF13 */
const reservaForm = document.getElementById("reservaForm");
reservaForm.addEventListener("submit", e => {
  e.preventDefault();
  const todayStr = new Date().toISOString().split("T")[0];
  const valid = validate(reservaForm, [
    { id: "rNombre", test: v => v.length >= 3 },
    { id: "rTelefono", test: v => phoneRe.test(v) },
    { id: "rCorreo", test: v => emailRe.test(v) },
    { id: "rFecha", test: v => v !== "" && v >= todayStr },
    { id: "rHora", test: v => v !== "" },
    { id: "rPersonas", test: v => v !== "" }
  ]);
  const success = document.getElementById("reservaSuccess");
  if(valid){
    success.classList.add("show");
    reservaForm.reset();
    setTimeout(() => success.classList.remove("show"), 6000);
  } else {
    success.classList.remove("show");
  }
});

/* Formulario de contacto — RF14, RF13 */
const contactoForm = document.getElementById("contactoForm");
contactoForm.addEventListener("submit", e => {
  e.preventDefault();
  const valid = validate(contactoForm, [
    { id: "cNombre", test: v => v.length >= 3 },
    { id: "cCorreo", test: v => emailRe.test(v) },
    { id: "cMensaje", test: v => v.length >= 10 }
  ]);
  const success = document.getElementById("contactoSuccess");
  if(valid){
    success.classList.add("show");
    contactoForm.reset();
    setTimeout(() => success.classList.remove("show"), 6000);
  } else {
    success.classList.remove("show");
  }
});
