import OverlayTemplates from "./overlay-templates.class.js";

export default class GameOverlay {
    constructor() {
        window.gameOverlay = this;
        this.container = document.getElementById('game-container');
        this.add();
        this.provideScreens();
        this.setContent(this.startScreen, null);
        this.currentReferrer = null;
    }

    provideScreens() {
        this.startScreen = OverlayTemplates.startScreen;
        this.controlsScreen = OverlayTemplates.controlScreen;
        this.legalScreen = OverlayTemplates.legalScreen;
    }

    add() {
        this.element = document.createElement('div');
        this.element.classList.add('canvas-overlay', 'navigation', 'fr', 'jcac');
        if (document.fullscreenElement) {
            this.element.classList.add('start-bg');
        }
        this.container.appendChild(this.element);
    }

    setContent(templateString, focusNextQuerySelector, referrer = null) {
        this.currentReferrer = referrer;
        if (!this.element) {
            this.add();
        }
        this.element.innerHTML = templateString;
        this.showOverlay();
        this.registerButtonEvents();
        this.element.querySelector(focusNextQuerySelector)?.focus();
    }

    showOverlay() {
        document.getElementById('canvas-container').classList.remove('transition-opacity');
        document.getElementById('canvas-container').classList.add('opacity-0');
    }

    remove() {
        if (this.element) {
            document.getElementById('canvas-container').classList.add('transition-opacity');
            document.getElementById('canvas-container').classList.remove('opacity-0');
            this.container.removeChild(this.element);
            this.element = null;
        }
    }

    registerButtonEvents() {
        const btnActions = {
            '.start-btn': () => this.resumeGame(),
            '.controls-btn': () => this.setContent(this.controlsScreen, '.back-btn'),
            '.legal-btn': () => this.setContent(this.legalScreen, '.back-btn'),
            '.back-btn': () => this.currentReferrer === 'game' ? this.resumeGame() : this.setContent(this.startScreen, '.start-btn'),
        };
        Object.entries(btnActions).forEach(([selector, action]) => {
            const btn = this.element.querySelector(selector);
            if (btn) btn.onclick = action;
        });
    }

    resumeGame() {
        this.remove();
        document.getElementById('canvas-container').classList.remove('opacity-0');
        window.game.start(1000);
    }
}