// bariables


const USUARIOS_KEY = 'galeryart_usuarios';
const USUARIO_ACTUAL_KEY = 'galeryart_usuario_actual';
const RECUERDAME_KEY = 'galeryart_recuerdame';
const ULTIMO_EMAIL_KEY = 'galeryart_ultimo_email';

// Cargar usuarios del localStorage
let usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];

// funciones utilizadas 

/**
 * Muestra un mensaje de error en un elemento
 * @param {string} elementId - ID del elemento donde mostrar el error
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(elementId, mensaje) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.classList.add('show');
        
        // Añadir clase de error al input correspondiente
        const inputId = elementId.replace('error-', '');
        const input = document.getElementById(inputId);
        if (input) {
            input.classList.add('error');
        }
    }
}

/**
 * Limpia el mensaje de error de un elemento
 * @param {string} elementId - ID del elemento a limpiar
 */
function limpiarError(elementId) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.textContent = '';
        elemento.classList.remove('show');
        
        // Quitar clase de error del input correspondiente
        const inputId = elementId.replace('error-', '');
        const input = document.getElementById(inputId);
        if (input) {
            input.classList.remove('error');
        }
    }
}

/**
 * Valida si un email tiene formato válido
 * @param {string} email - Email a validar
 * @returns {boolean} - True si el email es válido
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Busca un usuario por email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object|null} - Usuario encontrado o null
 */
function buscarUsuario(email, password) {
    return usuarios.find(u => u.email === email && u.password === password);
}

/**
 * Inicia sesión con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object} - Resultado de la operación
 */
function iniciarSesion(email, password) {
    // Buscar usuario
    const usuario = buscarUsuario(email, password);
    
    if (!usuario) {
        return { 
            success: false, 
            message: 'Correo electrónico o contraseña incorrectos' 
        };
    }

    // Crear datos de sesión
    const datosSesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        fechaLogin: new Date().toISOString()
    };

    // Guardar sesión en localStorage
    localStorage.setItem(USUARIO_ACTUAL_KEY, JSON.stringify(datosSesion));

    // Guardar preferencia "recordarme"
    const recuerdame = document.getElementById('recuerdame').checked;
    if (recuerdame) {
        localStorage.setItem(RECUERDAME_KEY, 'true');
        localStorage.setItem(ULTIMO_EMAIL_KEY, email);
    } else {
        localStorage.removeItem(RECUERDAME_KEY);
        localStorage.removeItem(ULTIMO_EMAIL_KEY);
    }

    return { 
        success: true, 
        message: 'Inicio de sesión exitoso',
        usuario: datosSesion
    };
}

/**
 * Verifica si ya hay una sesión activa
 * @returns {boolean} - True si hay sesión activa
 */
function verificarSesionActiva() {
    const usuario = localStorage.getItem(USUARIO_ACTUAL_KEY);
    if (usuario) {
        // Si hay sesión activa, redirigir a la página principal
        window.location.href = 'index.html';
        return true;
    }
    return false;
}

/**
 * Crea un usuario demo para pruebas
 */
function crearUsuarioDemo() {
    if (usuarios.length === 0) {
        const usuarioDemo = {
            id: '1',
            nombre: 'Usuario Demo',
            email: 'demo@galeryart.com',
            password: 'password123',
            fechaRegistro: new Date().toISOString(),
            favoritos: [],
            compras: []
        };
        usuarios.push(usuarioDemo);
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
        
        console.log('Usuario demo creado: demo@galeryart.com / password123');
    }
}

/**
 * Carga las preferencias del usuario
 */
function cargarPreferencias() {
    const recuerdameGuardado = localStorage.getItem(RECUERDAME_KEY);
    if (recuerdameGuardado === 'true') {
        document.getElementById('recuerdame').checked = true;
        
        // Cargar último email usado
        const ultimoEmail = localStorage.getItem(ULTIMO_EMAIL_KEY);
        if (ultimoEmail) {
            document.getElementById('email').value = ultimoEmail;
            // Poner foco en el campo de contraseña
            document.getElementById('password').focus();
        }
    }
}

/**
 * Valida el formulario de login
 * @returns {boolean} - True si el formulario es válido
 */
function validarFormulario() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    let valido = true;

    // Limpiar errores anteriores
    ['error-email', 'error-password'].forEach(limpiarError);

    // Validar email
    if (!email) {
        mostrarError('error-email', 'Ingresa tu correo electrónico');
        valido = false;
    } else if (!validarEmail(email)) {
        mostrarError('error-email', 'Ingresa un correo electrónico válido');
        valido = false;
    }

    // Validar contraseña
    if (!password) {
        mostrarError('error-password', 'Ingresa tu contraseña');
        valido = false;
    }

    return valido;
}

/**
 * Maneja el envío del formulario de login
 * @param {Event} e - Evento del formulario
 */
function manejarSubmitFormulario(e) {
    e.preventDefault();

    // Validar formulario
    if (!validarFormulario()) {
        return;
    }

    // Obtener valores
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btnLogin = document.getElementById('btn-login');
    const mensajeExito = document.getElementById('mensaje-exito');

    // Deshabilitar botón y mostrar estado de carga
    btnLogin.disabled = true;
    btnLogin.classList.add('loading');

    // Intentar iniciar sesión
    setTimeout(() => {
        const resultado = iniciarSesion(email, password);

        if (resultado.success) {
            // Login exitoso
            mensajeExito.classList.add('show');
            document.getElementById('loginForm').style.display = 'none';
            
            // Redirigir a la página principal después de 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            // Mostrar error
            mostrarError('error-password', resultado.message);
            btnLogin.disabled = false;
            btnLogin.classList.remove('loading');
            btnLogin.textContent = 'Entrar';
            
            // Enfocar campo de contraseña
            document.getElementById('password').focus();
            document.getElementById('password').select();
        }
    }, 1000);
}

/**
 * Configura los event listeners del formulario
 */
function configurarEventListeners() {
    const formulario = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (formulario) {
        // Envío del formulario
        formulario.addEventListener('submit', manejarSubmitFormulario);

        // Validación en tiempo real del email
        emailInput.addEventListener('blur', function() {
            if (this.value && !validarEmail(this.value)) {
                mostrarError('error-email', 'Ingresa un correo electrónico válido');
            } else {
                limpiarError('error-email');
            }
        });

        // Limpiar error de contraseña al escribir
        passwordInput.addEventListener('input', function() {
            if (this.value) {
                limpiarError('error-password');
            }
        });

        // Limpiar error de email al escribir
        emailInput.addEventListener('input', function() {
            limpiarError('error-email');
        });

        // Permitir login con Enter en el campo de contraseña
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                formulario.dispatchEvent(new Event('submit'));
            }
        });
    }
}



document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya hay sesión activa
    verificarSesionActiva();

    // Crear usuario demo si no hay usuarios
    crearUsuarioDemo();

    // Cargar preferencias del usuario
    cargarPreferencias();

    // Configurar event listeners
    configurarEventListeners();
});