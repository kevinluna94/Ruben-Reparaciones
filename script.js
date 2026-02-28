document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('mainNavbar');
    const services = document.querySelectorAll('.service-item');
    const parallaxSection = document.querySelector('.parallax-section');
    const heroVideo = document.getElementById('hero-video'); // Seleccionamos por ID

    // --- CARRUSEL DE VIDEOS ---
    if (heroVideo) {
        // Lista de videos (puedes agregar o quitar)
        const videoSources = [
            "https://cdn.pixabay.com/video/2023/01/30/148540-794355630_large.mp4",
            "https://cdn.pixabay.com/video/2016/08/22/4728-179738645_large.mp4",
            "https://pixabay.com/es/videos/download/video-67463_medium.mp4",
        ];

        let currentVideoIndex = 0;

        // Función para cambiar el video
        function changeVideo(index) {
            const source = videoSources[index];
            // Cambiamos el atributo src del elemento <source> (o directamente el src del video)
            // Es más fiable cambiar el src del video y usar load()
            heroVideo.src = source;
            heroVideo.load(); // Recarga el video con la nueva fuente
            heroVideo.play().catch(err => console.log('Error al reproducir:', err));
        }

        // Cuando el video termina, pasamos al siguiente
        heroVideo.addEventListener('ended', function() {
            currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
            changeVideo(currentVideoIndex);
        });

        // Si hay error al cargar un video, intentamos con el siguiente
        heroVideo.addEventListener('error', function() {
            console.warn('Error cargando video, pasando al siguiente');
            currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
            changeVideo(currentVideoIndex);
        });

        // Iniciamos con el primer video (ya está cargado, pero por si acaso)
        // Si el video ya tiene un src, no es necesario cambiar, pero aseguramos que esté configurado
        // (el HTML ya tiene el primero, así que no hacemos nada)
        // Pero para tener control, podríamos setearlo explícitamente:
        // changeVideo(0); // (opcional)
    }

    // 1. PARALLAX EN MÓVILES: Efecto fixed para background incluso en dispositivos móviles
    function updateParallax() {
        if (parallaxSection) {
            const scrollPosition = window.scrollY;
            const elementOffset = parallaxSection.offsetTop;
            const elementHeight = parallaxSection.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Solo aplicar parallax si el elemento está en viewport
            if (scrollPosition + windowHeight >= elementOffset && scrollPosition <= elementOffset + elementHeight) {
                const distance = scrollPosition - elementOffset;
                // Reductor: 0.5 crea el efecto parallax
                const offset = distance * 0.5;
                parallaxSection.style.backgroundPosition = `center ${offset}px`;
            }
        }
    }
    
    // Usar requestAnimationFrame para mejor performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
        
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        animateOnScroll();
    });
    
    // 2. Animación de las Tarjetas de Servicio al cargar (con retardo)
    services.forEach((item, index) => {
        const delay = item.getAttribute('data-delay') || (index * 100);
        setTimeout(() => {
            item.classList.add('animate__fadeInUp'); 
        }, delay);
    });
    
    // 3. Animación de elementos al hacer scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-item, .section-title, .feature-icon');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            if (elementPosition < screenPosition && !element.classList.contains('animated')) {
                element.classList.add('animated');
                if (element.classList.contains('service-item')) {
                    element.classList.add('animate__fadeInUp');
                } else if (element.classList.contains('section-title')) {
                    element.classList.add('animate__fadeInDown');
                } else if (element.classList.contains('feature-icon')) {
                    element.classList.add('animate__zoomIn');
                }
            }
        });
    }
    
    // 4. Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                let offset = 70; // altura del navbar
                if (targetId === '#hero') offset = 0;
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
                // Cerrar menú móvil si está abierto
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });
    
    // 5. Actualizar año actual en el footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('footer p:first-of-type');
    if (yearElement) {
        yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }
    
    // 6. Inicializar carrusel de galería (proyectosCarousel)
    const proyectosCarousel = document.getElementById('proyectosCarousel');
    if (proyectosCarousel) {
        const carousel = new bootstrap.Carousel(proyectosCarousel, {
            interval: 5000,
            wrap: true
        });
        // Pausar al hacer hover
        proyectosCarousel.addEventListener('mouseenter', () => carousel.pause());
        proyectosCarousel.addEventListener('mouseleave', () => carousel.cycle());
    }
    
    // 7. WhatsApp flotante con animación periódica
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        setInterval(() => {
            whatsappFloat.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                whatsappFloat.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }, 10000);
    }
    
    // 8. Inicializar animaciones al cargar
    setTimeout(() => {
        animateOnScroll();
    }, 500);
    
    // 9. Estado inicial del navbar
    if (window.scrollY <= 50) {
        navbar.classList.remove('scrolled');
    } else {
        navbar.classList.add('scrolled');
    }
});