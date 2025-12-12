// compra.js - Script para la página de compra

document.addEventListener('DOMContentLoaded', function() {
    // Elementos principales
    const form = document.getElementById('compraForm');
    const btnFinalizar = document.querySelector('.btn-finalizar');
    const btnVolver = document.querySelector('.btn-volver');
    
    if (!form) {
        console.error('No se encontró el formulario de compra');
        return;
    }
    
    // ====================
    // 1. VALIDACIÓN DEL FORMULARIO
    // ====================
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const ciudad = document.getElementById('ciudad').value.trim();
        const postal = document.getElementById('postal').value.trim();
        const pais = document.getElementById('pais').value;
        const terminos = document.getElementById('terminos').checked;
        
        // Limpiar errores previos
        clearErrors();
        
        let isValid = true;
        
        // Validar campos obligatorios
        if (!nombre) {
            showError('nombre', 'Nombre completo es requerido');
            isValid = false;
        }
        
        if (!email) {
            showError('email', 'Email es requerido');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Ingresa un email válido');
            isValid = false;
        }
        
        if (!telefono) {
            showError('telefono', 'Teléfono es requerido');
            isValid = false;
        }
        
        if (!direccion) {
            showError('direccion', 'Dirección es requerida');
            isValid = false;
        }
        
        if (!ciudad) {
            showError('ciudad', 'Ciudad es requerida');
            isValid = false;
        }
        
        if (!postal) {
            showError('postal', 'Código postal es requerido');
            isValid = false;
        }
        
        if (!pais) {
            showError('pais', 'Selecciona un país');
            isValid = false;
        }
        
        if (!terminos) {
            alert('Debes aceptar los términos y condiciones');
            isValid = false;
        }
        
        if (isValid) {
            procesarCompra();
        }
    });
    
    // ====================
    // 2. PROCESAR COMPRA
    // ====================
    function procesarCompra() {
        // Cambiar estado del botón
        const originalText = btnFinalizar.textContent;
        btnFinalizar.textContent = 'PROCESANDO...';
        btnFinalizar.disabled = true;
        btnFinalizar.style.opacity = '0.7';
        
        // Simular petición al servidor (2 segundos)
        setTimeout(() => {
            // Éxito en la compra
            btnFinalizar.textContent = '¡COMPRA EXITOSA!';
            btnFinalizar.style.background = '#27ae60';
            
            // Mostrar mensaje de confirmación
            mostrarMensajeExito();
            
            // Redirigir después de 3 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
            
        }, 2000);
    }
    
    // ====================
    // 3. MOSTRAR MENSAJE DE ÉXITO
    // ====================
    function mostrarMensajeExito() {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        // Crear mensaje
        const mensaje = document.createElement('div');
        mensaje.className = 'success-message';
        mensaje.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            animation: slideUp 0.3s ease;
        `;
        
        mensaje.innerHTML = `
            <div style="font-size: 40px; color: #27ae60; margin-bottom: 20px;">✓</div>
            <h2 style="color: #1a1a1a; margin-bottom: 15px;">¡Compra realizada con éxito!</h2>
            <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">
                Te hemos enviado un correo de confirmación con los detalles de tu compra.<br>
                Tu pedido será procesado y enviado en 3-5 días hábiles.
            </p>
            <p style="color: #999; font-size: 14px;">
                Redirigiendo a la galería...
            </p>
        `;
        
        overlay.appendChild(mensaje);
        document.body.appendChild(overlay);
        
        // Agregar estilos CSS para animaciones
        if (!document.querySelector('#success-styles')) {
            const style = document.createElement('style');
            style.id = 'success-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ====================
    // 4. VALIDACIÓN EN TIEMPO REAL
    // ====================
    const campos = form.querySelectorAll('input, select');
    campos.forEach(campo => {
        // Validar al perder el foco
        campo.addEventListener('blur', function() {
            if (this.value.trim() && this.id) {
                validateField(this.id, this.value);
            }
        });
        
        // Limpiar error al escribir
        campo.addEventListener('input', function() {
            clearFieldError(this.id);
        });
    });
    
    // ====================
    // 5. FUNCIONES AUXILIARES
    // ====================
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        // Crear elemento de error
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Agregar estilo de error al campo
        field.style.borderColor = '#e74c3c';
    }
    
    function clearErrors() {
        // Limpiar mensajes de error
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.style.display = 'none';
        });
        
        // Restaurar bordes de campos
        const campos = form.querySelectorAll('input, select, textarea');
        campos.forEach(campo => {
            campo.style.borderColor = '#ddd';
        });
    }
    
    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        // Restaurar borde
        field.style.borderColor = '#ddd';
        
        // Ocultar mensaje de error
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    function validateField(fieldId, value) {
        switch(fieldId) {
            case 'email':
                if (!isValidEmail(value)) {
                    showError(fieldId, 'Ingresa un email válido');
                }
                break;
                
            case 'telefono':
                if (!isValidPhone(value)) {
                    showError(fieldId, 'Ingresa un teléfono válido');
                }
                break;
                
            case 'postal':
                if (!/^\d{4,6}$/.test(value)) {
                    showError(fieldId, 'Código postal inválido');
                }
                break;
        }
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidPhone(phone) {
        // Permitir números, espacios, guiones, paréntesis y signo +
        const re = /^[\d\s\-\+\(\)]{8,}$/;
        return re.test(phone);
    }
    
    // ====================
    // 6. AGREGAR ESTILOS PARA ERRORES
    // ====================
    if (!document.querySelector('#error-styles')) {
        const style = document.createElement('style');
        style.id = 'error-styles';
        style.textContent = `
            .error-message {
                color: #e74c3c;
                font-size: 12px;
                margin-top: 5px;
                display: none;
            }
            
            input.error, select.error {
                border-color: #e74c3c !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ====================
    // 7. EVENTO BOTÓN VOLVER
    // ====================
    if (btnVolver) {
        btnVolver.addEventListener('click', function(e) {
            e.preventDefault();
            // Preguntar antes de salir si hay datos ingresados
            const camposLlenos = Array.from(campos).some(campo => 
                campo.value.trim() && campo.type !== 'checkbox' && campo.type !== 'radio'
            );
            
            if (camposLlenos) {
                if (confirm('¿Seguro que quieres salir? Se perderán los datos ingresados.')) {
                    window.location.href = 'index.html';
                }
            } else {
                window.location.href = 'index.html';
            }
        });
    }
    
    // ====================
    // 8. GUARDAR DATOS EN LOCALSTORAGE (OPCIONAL)
    // ====================
    // Guardar datos al salir
    window.addEventListener('beforeunload', function() {
        const formData = {};
        campos.forEach(campo => {
            if (campo.name || campo.id) {
                const key = campo.name || campo.id;
                formData[key] = campo.value;
            }
        });
        
        localStorage.setItem('compraDraft', JSON.stringify(formData));
    });
    
    // Cargar datos guardados al cargar la página
    const savedData = localStorage.getItem('compraDraft');
    if (savedData) {
        const formData = JSON.parse(savedData);
        Object.keys(formData).forEach(key => {
            const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
            if (field && formData[key]) {
                field.value = formData[key];
            }
        });
        
        // Limpiar datos guardados después de cargarlos
        localStorage.removeItem('compraDraft');
    }
});