// registro.js - Sistema de registro para GaleryArt

// ===============================
// CONSTANTES Y VARIABLES
// ===============================
const USUARIOS_KEY = 'galeryart_usuarios';

// Cargar usuarios del localStorage
let usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];

// ===============================
// FUNCIONES DE UTILIDAD
// ===============================

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
            input.classList.remove('success');
        }
    }
}

/**
 * Muestra un estado de éxito en un input
 * @param {string} inputId - ID del input a marcar como exitoso
 */
function mostrarExito(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.classList.remove('error');
        input.classList.add('success');
        
        // Limpiar mensaje de error si existe
        const errorId = 'error-' + inputId;
        limpiarError(errorId);
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
 * Verifica si un email ya está registrado
 * @param {string} email - Email a verificar
 * @returns {boolean} - True si el email ya existe
 */
function emailExiste(email) {
    return usuarios.some(usuario => usuario.email === email);
}

/**
 * Valida la fortaleza de una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} - Objeto con validación y fortaleza
 */
function validarPassword(password) {
    const validaciones = {
        longitud: password.length >= 8,
        minuscula: /[a-z]/.test(password),
        mayuscula: /[A-Z]/.test(password),
        numero: /\d/.test(password),
        especial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    // Calcular fortaleza
    const puntos = Object.values(validaciones).filter(v => v).length;
    let fortaleza = 'débil';
    
    if (puntos >= 4) fortaleza = 'fuerte';
    else if (puntos >= 3) fortaleza = 'media';
    
    return {
        valida: validaciones.longitud,
        fortaleza: fortaleza,
        detalles: validaciones
    };
}

/**
 * Actualiza la barra de fortaleza de contraseña
 * @param {string} password - Contraseña actual
 */
function actualizarFortalezaPassword(password) {
    const resultado = validarPassword(password);
    const barra = document.querySelector('.password-strength-bar');
    const texto = document.querySelector('.strength-text');
    
    if (barra && texto) {
        // Resetear clases
        barra.className = 'password-strength-bar';
        
        // Actualizar según fortaleza
        switch(resultado.fortaleza) {
            case 'débil':
                barra.classList.add('strength-weak');
                texto.textContent = 'Débil';
                texto.style.color = 'var(--error)';
                break;
            case 'media':
                barra.classList.add('strength-medium');
                texto.textContent = 'Media';
                texto.style.color = '#ffc107';
                break;
            case 'fuerte':
                barra.classList.add('strength-strong');
                texto.textContent = 'Fuerte';
                texto.style.color = 'var(--exito)';
                break;
        }
    }
}

/**
 * Guarda un nuevo usuario en el sistema
 * @param {Object} usuario - Datos del usuario a guardar
 * @returns {Object} - Resultado de la operación
 */
function guardarUsuario(usuario) {
    // Verificar si el email ya existe
    if (emailExiste(usuario.email)) {
        return { 
            success: false, 
            message: 'Este correo electrónico ya está registrado' 
        };
    }

    // Generar ID único
    usuario.id = Date.now().toString();
    usuario.fechaRegistro = new Date().toISOString();
    usuario.favoritos = [];
    usuario.compras = [];
    usuario.ultimoAcceso = null;

    // Guardar usuario
    usuarios.push(usuario);
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));

    return { 
        success: true, 
        message: 'Usuario registrado exitosamente',
        usuario: usuario
    };
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
            password: 'Password123!',
            fechaRegistro: new Date().toISOString(),
            favoritos: [],
            compras: []
        };
        usuarios.push(usuarioDemo);
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
        
        console.log('Usuario demo creado: demo@galeryart.com / Password123!');
    }
}

/**
 * Valida el formulario de registro
 * @returns {boolean} - True si el formulario es válido
 */
function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    let valido = true;

    // Limpiar errores anteriores
    ['error-nombre', 'error-email', 'error-password'].forEach(limpiarError);

    // Validar nombre (mínimo 2 caracteres)
    if (!nombre || nombre.length < 2) {
        mostrarError('error-nombre', 'El nombre debe tener al menos 2 caracteres');
        valido = false;
    } else {
        mostrarExito('nombre');
    }

    // Validar email
    if (!email) {
        mostrarError('error-email', 'Ingresa tu correo electrónico');
        valido = false;
    } else if (!validarEmail(email)) {
        mostrarError('error-email', 'Ingresa un correo electrónico válido');
        valido = false;
    } else if (emailExiste(email)) {
        mostrarError('error-email', 'Este correo ya está registrado');
        valido = false;
    } else {
        mostrarExito('email');
    }

    // Validar contraseña
    const validacionPassword = validarPassword(password);
    if (!password) {
        mostrarError('error-password', 'Ingresa una contraseña');
        valido = false;
    } else if (!validacionPassword.valida) {
        mostrarError('error-password', 'La contraseña debe tener al menos 8 caracteres');
        valido = false;
    } else {
        mostrarExito('password');
    }

    return valido;
}

/**
 * Maneja el envío del formulario de registro
 * @param {Event} e - Evento del formulario
 */
function manejarSubmitFormulario(e) {
    e.preventDefault();

    // Validar formulario
    if (!validarFormulario()) {
        return;
    }

    // Obtener valores
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btnRegistrar = document.getElementById('btn-registrar');
    const mensajeExito = document.getElementById('mensaje-exito');

    // Deshabilitar botón y mostrar estado de carga
    btnRegistrar.disabled = true;
    btnRegistrar.classList.add('loading');

    // Crear objeto usuario
    const usuario = {
        nombre,
        email,
        password
    };

    // Intentar guardar usuario
    setTimeout(() => {
        const resultado = guardarUsuario(usuario);

        if (resultado.success) {
            // Registro exitoso
            mensajeExito.classList.add('show');
            document.getElementById('registroForm').style.display = 'none';

            // Redirigir a inicio de sesión después de 2 segundos
            setTimeout(() => {
                window.location.href = 'inicio.html';
            }, 2000);
        } else {
            // Mostrar error
            mostrarError('error-email', resultado.message);
            btnRegistrar.disabled = false;
            btnRegistrar.classList.remove('loading');
            btnRegistrar.textContent = 'Registrarse';
            
            // Enfocar campo de email
            document.getElementById('email').focus();
            document.getElementById('email').select();
        }
    }, 1000);
}

/**
 * Configura los event listeners del formulario
 */
function configurarEventListeners() {
    const formulario = document.getElementById('registroForm');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (formulario) {
        // Envío del formulario
        formulario.addEventListener('submit', manejarSubmitFormulario);

        // Validación en tiempo real del nombre
        nombreInput.addEventListener('blur', function() {
            if (this.value && this.value.length < 2) {
                mostrarError('error-nombre', 'El nombre debe tener al menos 2 caracteres');
            } else if (this.value) {
                mostrarExito('nombre');
                limpiarError('error-nombre');
            }
        });

        // Validación en tiempo real del email
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !validarEmail(email)) {
                mostrarError('error-email', 'Ingresa un correo electrónico válido');
            } else if (email && emailExiste(email)) {
                mostrarError('error-email', 'Este correo ya está registrado');
            } else if (email) {
                mostrarExito('email');
                limpiarError('error-email');
            }
        });

        // Validación en tiempo real de la contraseña
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            
            // Limpiar error mientras se escribe
            if (password) {
                limpiarError('error-password');
            }
            
            // Actualizar fortaleza de contraseña
            actualizarFortalezaPassword(password);
            
            // Validar cuando se pierde el foco
            if (!passwordInput.matches(':focus')) {
                const validacion = validarPassword(password);
                if (password && !validacion.valida) {
                    mostrarError('error-password', 'La contraseña debe tener al menos 8 caracteres');
                } else if (password) {
                    mostrarExito('password');
                }
            }
        });

        // Validar contraseña al perder foco
        passwordInput.addEventListener('blur', function() {
            const password = this.value;
            const validacion = validarPassword(password);
            
            if (password && !validacion.valida) {
                mostrarError('error-password', 'La contraseña debe tener al menos 8 caracteres');
            } else if (password) {
                mostrarExito('password');
            }
        });

        // Limpiar errores al escribir
        nombreInput.addEventListener('input', function() {
            if (this.value) {
                limpiarError('error-nombre');
                this.classList.remove('error');
            }
        });

        emailInput.addEventListener('input', function() {
            if (this.value) {
                limpiarError('error-email');
                this.classList.remove('error');
            }
        });

        // Permitir registro con Enter en cualquier campo
        [nombreInput, emailInput, passwordInput].forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    formulario.dispatchEvent(new Event('submit'));
                }
            });
        });
    }
}

/**
 * Inicializa la interfaz de usuario
 */
function inicializarUI() {
    // Crear elementos para fortaleza de contraseña si no existen
    const passwordGroup = document.querySelector('#password').closest('.form-group');
    if (passwordGroup) {
        // Crear contenedor de fortaleza
        const strengthContainer = document.createElement('div');
        strengthContainer.className = 'password-strength';
        
        const strengthBar = document.createElement('div');
        strengthBar.className = 'password-strength-bar';
        
        const strengthText = document.createElement('div');
        strengthText.className = 'strength-text';
        strengthText.textContent = '';
        
        strengthContainer.appendChild(strengthBar);
        passwordGroup.appendChild(strengthContainer);
        passwordGroup.appendChild(strengthText);
    }
}

// ===============================
// INICIALIZACIÓN
// ===============================

document.addEventListener('DOMContentLoaded', function() {
    // Crear usuario demo si no hay usuarios
    crearUsuarioDemo();

    // Inicializar interfaz de usuario
    inicializarUI();

    // Configurar event listeners
    configurarEventListeners();
});