// Definimos credenciales válidas (ejemplo simple)
const usuarioValido = "admin";
const claveValida = "1234";

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // Evita recargar la página

  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;

  if (usuario === usuarioValido && clave === claveValida) {
    // Redirige al dashboard si las credenciales son correctas
    window.location.href = "dashboard.html";
  } else {
    // Muestra mensaje de error
    errorMsg.style.display = "block";
  }
});