/**
 * Lógica principal de la aplicación (Máquina de Estados)
 * Maneja las transiciones suaves entre las 4 diferentes vistas de la invitación,
 * controlando la adición/eliminación de clases CSS.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================================================
       1. REFERENCIAS AL DOM (Elementos de Interfaz)
       ========================================================================= */
    
    // --- Referencia al Audio ---
    const bgAudio = document.getElementById('bg-audio');
    
    // --- Vistas (Estados) ---
    const view0 = document.getElementById('view-0'); // Estado Inicial: El Sobre
    const view1 = document.getElementById('view-1'); // Vista 1: Pregunta Inicial
    const view2 = document.getElementById('view-2'); // Vista 2: Mensaje largo
    const view3 = document.getElementById('view-3'); // Vista 3: Cierre con Imagen
    
    // --- Contenedor Global ---
    const mainContent = document.getElementById('main-content'); // Contenedor del fondo marmoleado
    
    // --- Botones Interactivos ---
    const btnOpenEnvelope = document.getElementById('btn-open-envelope'); // Sello de cera
    const btnYes = document.getElementById('btn-yes'); // Botón 'Sí' en Vista 1
    const btnContinue = document.getElementById('btn-continue'); // Botón 'Continuar' en Vista 2
    const btnBack = document.getElementById('btn-back'); // Botón 'Regresar' global
    
    // --- Elementos Animados ---
    const envelope = document.querySelector('.envelope');

    /* =========================================================================
       2. FUNCIONES DE TRANSICIÓN (HELPER FUNCTIONS)
       ========================================================================= */

    /**
     * Oculta una vista de manera animada.
     * Quita la clase 'fade-in' y añade 'fade-out'.
     * Despues del tiempo de transición en CSS, oculta el elemento del DOM.
     * 
     * @param {HTMLElement} viewElement - El nodo HTML de la vista a ocultar
     * @param {number} duration - Duración de la transición en milisegundos (default 500ms)
     */
    const fadeOutView = (viewElement, duration = 500) => {
        // Iniciar transición visual de opacidad a 0
        viewElement.classList.remove('fade-in');
        viewElement.classList.add('fade-out');
        
        // Esperar a que termine la animación de CSS antes de aplicar 'display: none'
        setTimeout(() => {
            viewElement.classList.add('hidden');
            viewElement.classList.remove('active');
        }, duration);
    };

    /**
     * Muestra una vista de manera animada.
     * Quita 'hidden' (display: none) primero, y luego de un pequeñísimo delay,
     * aplica 'fade-in' para que la transición de CSS (opacity: 1) funcione correctamente.
     * 
     * @param {HTMLElement} viewElement - El nodo HTML de la vista a mostrar
     */
    const fadeInView = (viewElement) => {
        // Remover estado oculto del DOM y estado transparente previo
        viewElement.classList.remove('hidden', 'fade-out');
        viewElement.classList.add('active');
        
        // Necesitamos un frame de respiro (ej. 50ms) para que el navegador 
        // registre el cambio en el DOM antes de aplicar la clase de transición de opacidad.
        setTimeout(() => {
            viewElement.classList.add('fade-in');
        }, 50);
    };


    /* =========================================================================
       3. EVENTOS DE USUARIO Y MÁQUINA DE ESTADOS
       ========================================================================= */

    /**
     * EVENTO: Click en el Sello de Cera (Estado 0 -> Vista 1)
     */
    btnOpenEnvelope.addEventListener('click', () => {
        
        // a) Reproducir el audio. 
        // Importante: Los navegadores modernos bloquean el autoplay, pero al estar 
        // atado a una interacción del usuario (click), sí permiten reproducirlo.
        bgAudio.play().catch(error => {
            console.warn("Autoplay prevenido. Verifique la ruta del audio o los permisos del navegador.", error);
        });

        // b) Disparar animación CSS del sobre abriéndose (Zoom-in + Fade-out)
        envelope.classList.add('opening');

        // c) Cambiar el estado a Vista 1 después de que la animación del sobre avanza
        // (La duración de la transición en CSS para 'opening' es 1.5s (1500ms))
        setTimeout(() => {
            
            // Ocultar permanentemente la vista del sobre
            view0.classList.add('hidden');
            
            // Revelar el fondo principal marmoleado
            mainContent.classList.remove('hidden');
            
            // Dar tiempo al DOM y luego hacer fade-in del fondo y de la primera vista
            setTimeout(() => {
                mainContent.classList.add('fade-in'); // Muestra fondo marmoleado
                fadeInView(view1); // Muestra caja central (Pregunta)
            }, 50);
            
        }, 1300); // Entramos a la siguiente pantalla justo antes de que termine al 100% la animación del sobre
    });

    /**
     * EVENTO: Click en 'Sí' (Vista 1 -> Vista 2)
     */
    btnYes.addEventListener('click', () => {
        // Ocultar Vista 1
        fadeOutView(view1);
        
        // Mostrar Vista 2 cuando la Vista 1 termine de desvanecerse (500ms)
        setTimeout(() => {
            fadeInView(view2);
        }, 500);
    });

    /**
     * EVENTO: Click en 'Continuar' (Vista 2 -> Vista 3)
     */
    btnContinue.addEventListener('click', () => {
        // Ocultar Vista 2
        fadeOutView(view2);
        
        // Mostrar Vista 3 
        setTimeout(() => {
            fadeInView(view3);
            
            // Mostrar también el botón global de Regresar ubicado en la esquina superior izquierda
            btnBack.classList.remove('hidden');
            setTimeout(() => {
                btnBack.classList.add('fade-in');
            }, 50);
            
        }, 500);
    });

    /**
     * EVENTO: Click en 'Regresar' (Desde Vista 3 -> Regresa a Vista 1)
     * Resetea el flujo al primer paso de las tarjetas.
     */
    btnBack.addEventListener('click', () => {
        // 1. Desvanecer y ocultar el botón de regresar
        btnBack.classList.remove('fade-in');
        setTimeout(() => {
            btnBack.classList.add('hidden');
        }, 500);
        
        // 2. Desvanecer la Vista 3 (Cierre)
        fadeOutView(view3);
        
        // 3. Volver a mostrar la Vista 1 (Pregunta Inicial)
        setTimeout(() => {
            fadeInView(view1);
        }, 500);
    });

});
