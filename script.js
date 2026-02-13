// Module URLs
const modules = {
    betriebs: {
        url: 'https://rahimahangarzadeh.github.io/Betriebs_Gefaehrdungsbeurteilung/',
        title: 'Betriebs-Gefährdungsbeurteilung'
    },
    baustelle: {
        url: 'https://rahimahangarzadeh.github.io/gefaehrdungsbeurteilung/',
        title: 'Ergänzende Gefährdungsbeurteilung Baustelle'
    },
    inspektion: {
        url: 'https://rahimahangarzadeh.github.io/sgu-inspektion/',
        title: 'SGU-Inspektion'
    },
    werkstatt: {
        url: 'https://rahimahangarzadeh.github.io/SGU-Werkstatt/',
        title: 'Magazin & Werkstatt'
    }
};

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registriert:', registration);
            })
            .catch(error => {
                console.log('Service Worker Registrierung fehlgeschlagen:', error);
            });
    });
}

// Open Module
function openModule(moduleKey) {
    const module = modules[moduleKey];
    if (!module) return;

    // Get views
    const homeView = document.getElementById('home-view');
    const moduleView = document.getElementById('module-view');
    const moduleFrame = document.getElementById('module-frame');
    const moduleTitle = document.getElementById('module-title');

    // Update module view
    moduleTitle.textContent = module.title;
    moduleFrame.src = module.url;

    // Switch views
    homeView.classList.remove('active');
    moduleView.classList.add('active');

    // Save current module
    sessionStorage.setItem('currentModule', moduleKey);

    // Scroll to top
    window.scrollTo(0, 0);
}

// Go back to home
function goHome() {
    const homeView = document.getElementById('home-view');
    const moduleView = document.getElementById('module-view');
    const moduleFrame = document.getElementById('module-frame');

    // Switch views
    moduleView.classList.remove('active');
    homeView.classList.add('active');

    // Clear iframe
    setTimeout(() => {
        moduleFrame.src = '';
    }, 300);

    // Clear session
    sessionStorage.removeItem('currentModule');

    // Scroll to top
    window.scrollTo(0, 0);
}

// Handle browser back button
window.addEventListener('popstate', (event) => {
    const currentModule = sessionStorage.getItem('currentModule');
    if (currentModule && document.getElementById('module-view').classList.contains('active')) {
        goHome();
    }
});

// Add history state when opening module
const originalOpenModule = openModule;
openModule = function(moduleKey) {
    history.pushState({ module: moduleKey }, '', '#' + moduleKey);
    originalOpenModule(moduleKey);
};

// Restore session on page load
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && modules[hash]) {
        openModule(hash);
    }
});

// Install prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Optional: Show custom install button
    console.log('PWA Installation verfügbar');
});

// Handle successful installation
window.addEventListener('appinstalled', (evt) => {
    console.log('PWA wurde installiert');
});

// Prevent default context menu on long press (mobile)
window.addEventListener('contextmenu', (e) => {
    if (window.matchMedia('(max-width: 768px)').matches) {
        // Allow context menu on iframe
        if (e.target.tagName !== 'IFRAME') {
            // You can uncomment this to prevent context menu
            // e.preventDefault();
        }
    }
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key to go back
    if (e.key === 'Escape' && document.getElementById('module-view').classList.contains('active')) {
        goHome();
    }
});

// Add touch feedback for cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', function() {
        this.style.transform = '';
    });
});

// Network status monitoring
window.addEventListener('online', () => {
    console.log('Verbindung wiederhergestellt');
});

window.addEventListener('offline', () => {
    console.log('Keine Internetverbindung');
    // Optional: Show offline message
});

// Performance optimization: Lazy load iframe content
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const iframe = entry.target;
            if (iframe.dataset.src && !iframe.src) {
                iframe.src = iframe.dataset.src;
            }
        }
    });
}, observerOptions);

// Export functions for global access
window.openModule = openModule;
window.goHome = goHome;
