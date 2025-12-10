// script de compra 

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const btnMenos = document.querySelector('.btn-contador.menos');
    const btnMas = document.querySelector('.btn-contador.mas');
    const cantidadSpan = document.querySelector('.cantidad');
    const precioElemento = document.querySelector('.precio');
    const btnEliminar = document.querySelector('.btn-eliminar');
    const formCompra = document.getElementById('form-compra');
    const btnFinalizar = document.querySelector('.btn-finalizar');
    const modalExito = document.getElementById('modal-exito');
    const btnVolverInicio = document.getElementById('btn-volver-inicio');
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    
    // Precio base de la obra
    const precioBase = 2450000;
    const envio = 5000;
    const seguro = 10000;
    
    /*hamburguesa*/
    if (hamburger && menu) {
        hamburger.addEventListener('click', function(event) {
            event.stopPropagation();
            menu.classList.toggle('active');
            
            // Cambiar ícono
            hamburger.innerHTML = menu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (menu.classList.contains('active') && 
                !hamburger.contains(event.target) && 
                !menu.contains(event.target)) {
                menu.classList.remove('active');
                hamburger.innerHTML = '☰';
            }
        });
    }
    
  /*contador de cantidad*/
    if (btnMenos && btnMas && cantidadSpan) {
        btnMenos.addEventListener('click', function() {
            let cantidad = parseInt(cantidadSpan.textContent);
            if (cantidad > 1) {
                cantidad--;
                cantidadSpan.textContent = cantidad;
                actualizarPrecio(cantidad);
            }
        });
        
        btnMas.addEventListener('click', function() {
            let cantidad = parseInt(cantidadSpan.textContent);
            cantidad++;
            cantidadSpan.textContent = cantidad;
            actualizarPrecio(cantidad);
        });
    }
    
    // Función para actualizar el precio
    function actualizarPrecio(cantidad) {
        const subtotal = precioBase * cantidad;
        const total = subtotal + envio + seguro;
        
        // Actualizar precio del item
        precioElemento.textContent = `$${subtotal.toLocaleString()} USD`;
        
        // Actualizar resumen de costos
        document.querySelector('.resumen-costos .costo-item:nth-child(1) span:nth-child(2)').textContent = 
            `$${subtotal.toLocaleString()} USD`;
        
        document.querySelector('.resumen-costos .costo-item.total span:nth-child(2)').textContent = 
            `$${total.toLocaleString()} USD`;
    }
    
    
    /*ELIMINAR ITEM*/
    
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres eliminar esta obra de tu carrito?')) {
                // Aquí normalmente redirigiríamos a la página principal
                // o actualizaríamos el carrito
                window.location.href = 'index.html';
            }
        });
    }
    
    
    /*VALIDACIÓN DEL FORMULARIO*/
    
    if (formCompra) {
        formCompra.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validar todos los campos requeridos
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            const ciudad = document.getElementById('ciudad').value.trim();
            const cp = document.getElementById('cp').value.trim();
            const pais = document.getElementById('pais').value;
            const terminos = document.getElementById('terminos').checked;
            
            // Validación simple
            if (!nombre || !email || !telefono || !direccion || !ciudad || !cp || !pais || !terminos) {
                alert('Por favor, completa todos los campos requeridos y acepta los términos.');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingresa un email válido.');
                return;
            }
            
            // Deshabilitar botón para prevenir múltiples clics
            btnFinalizar.disabled = true;
            btnFinalizar.textContent = 'PROCESANDO...';
            
            // Simular procesamiento de pago
            setTimeout(function() {
                // Mostrar modal de éxito
                modalExito.style.display = 'flex';
                
                // Aquí normalmente enviaríamos los datos al servidor
                console.log('Datos de compra:', {
                    nombre,
                    email,
                    telefono,
                    direccion,
                    ciudad,
                    cp,
                    pais,
                    cantidad: cantidadSpan.textContent
                });
            }, 2000);
        });
    }
    
    /*apartado de verificacion*/
    if (btnVolverInicio) {
        btnVolverInicio.addEventListener('click', function() {
            // Redirigir a la página principal
            window.location.href = 'index.html';
        });
    }
    
    // Cerrar modal al hacer clic fuera
    if (modalExito) {
        modalExito.addEventListener('click', function(event) {
            if (event.target === modalExito) {
                modalExito.style.display = 'none';
            }
        });
    }
    
  
    
    // Validación en tiempo real
    const inputs = document.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#ff4444';
            } else {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    });
    
    // Animación para cambio de paso
    const pasos = document.querySelectorAll('.paso');
    let pasoActual = 0;
    
    // Simular progreso (en una implementación real esto se actualizaría con el formulario)
    function avanzarPaso() {
        if (pasoActual < pasos.length - 1) {
            pasos[pasoActual].classList.remove('activo');
            pasoActual++;
            pasos[pasoActual].classList.add('activo');
        }
    }
    
    // Para demo: avanzar paso al completar cada sección
    const seccionesForm = document.querySelectorAll('.form-group');
    seccionesForm.forEach((seccion, index) => {
        const input = seccion.querySelector('input, select, textarea');
        if (input) {
            input.addEventListener('change', function() {
                if (this.value.trim() && index % 3 === 0) {
                    avanzarPaso();
                }
            });
        }
    });
    
    // Mostrar alerta al intentar salir sin completar
    window.addEventListener('beforeunload', function(event) {
        if (formCompra && formCompra.querySelector('input[value]')) {
            event.preventDefault();
            event.returnValue = '';
        }
    });
});