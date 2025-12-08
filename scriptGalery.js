
const obras = [
  { nombre: "Atardecer en La Paz", info: "Obra inspirada en los colores del altiplano.", imagen: "img/obra1.jpg" },
  { nombre: "Rostro Andino", info: "Retrato de identidad cultural.", imagen: "img/obra2.jpg" },
  { nombre: "Camino de Llamas", info: "Paisaje con llamas en movimiento.", imagen: "img/obra3.jpg" },
  { nombre: "Fiesta de Colores", info: "Celebración de la diversidad.", imagen: "img/obra4.jpg" },
  { nombre: "Silencio Nevado", info: "Montañas nevadas en calma.", imagen: "img/obra5.jpg" },
  { nombre: "Mirada Aymara", info: "Retrato con mirada profunda.", imagen: "img/obra6.jpg" }
];

const items = document.querySelectorAll(".galeria .item");
const imagenGrande = document.querySelector(".imagen-grande");
const nombreObra = document.querySelector(".info h3");
const infoObra = document.querySelector(".info p");
const btnFavoritos = document.querySelector(".botones button:nth-child(2)");
const btnCompartir = document.querySelector(".btn-sec");

items.forEach((item, index) => {
  item.addEventListener("click", () => {
    const obra = obras[index];
    imagenGrande.style.backgroundImage = `url('${obra.imagen}')`;
    nombreObra.textContent = obra.nombre;
    infoObra.textContent = obra.info;

    items.forEach(i => i.classList.remove("seleccionado"));
    item.classList.add("seleccionado");
  });
});

btnFavoritos.addEventListener("click", () => {
  btnFavoritos.textContent = "★ Favorito";
  btnFavoritos.style.backgroundColor = "#facc15";
});

btnCompartir.addEventListener("click", () => {
  alert("¡Has compartido esta obra!");
});