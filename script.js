// Module URLs
const modules = {
    bgbau: {
        url: 'https://rahimahangarzadeh.github.io/Baustellenanmeldung-BGBAU/',
        title: 'Baustellenanmeldung BG BAU'
    },
    betriebs: {
        url: 'https://rahimahangarzadeh.github.io/Betriebs_Gefaehrdungsbeurteilung/',
        title: 'Betriebs-Gefährdungsbeurteilung'
    },
    baustelle: {
        url: 'https://rahimahangarzadeh.github.io/gefaehrdungsbeurteilung/',
        title: 'Ergänzende Gefährdungsbeurteilung Baustelle'
    },
    unterweisung: {
        url: 'https://rahimahangarzadeh.github.io/Projektbezogene-Unterweisung/',
        title: 'Projektbezogene Unterweisung'
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

    const homeView = document.getElementById('home-view');
    const moduleView = document.getElementById('module-view');
    const moduleFrame = document.getElementById('module-frame');
    const moduleSubtitle = document.getElementById('module-subtitle');

    moduleSubtitle.textContent = module.title;
    moduleFrame.src = module.url;

    homeView.classList.remove('active');
    moduleView.classList.add('active');

    sessionStorage.setItem('currentModule', moduleKey);
    window.scrollTo(0, 0);
}

// Go back to home
function goHome() {
    const homeView = document.getElementById('home-view');
    const moduleView = document.getElementById('module-view');
    const moduleFrame = document.getElementById('module-frame');

    moduleView.classList.remove('active');
    homeView.classList.add('active');

    setTimeout(() => { moduleFrame.src = ''; }, 300);
    sessionStorage.removeItem('currentModule');
    window.scrollTo(0, 0);
}

// Handle browser back button
window.addEventListener('popstate', () => {
    if (document.getElementById('module-view').classList.contains('active')) {
        goHome();
    }
});

// Add history state when opening module
const originalOpenModule = openModule;
window.openModule = function(moduleKey) {
    history.pushState({ module: moduleKey }, '', '#' + moduleKey);
    originalOpenModule(moduleKey);
};
window.goHome = goHome;

// Restore session on page load
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && modules[hash]) {
        window.openModule(hash);
    }
});

// Install prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});
window.addEventListener('appinstalled', () => {
    console.log('PWA wurde installiert');
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('module-view').classList.contains('active')) {
        goHome();
    }
});

// Network status
window.addEventListener('online', () => console.log('Verbindung wiederhergestellt'));
window.addEventListener('offline', () => console.log('Keine Internetverbindung'));
