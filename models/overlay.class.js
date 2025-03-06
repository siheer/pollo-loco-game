import OverlayTemplates from "./overlay-templates.class.js";

/**
 * Manages the game overlay which displays menus and screens over the game canvas.
 */
export default class GameOverlay {
    /**
     * Creates a new GameOverlay instance, attaches the overlay element to the container,
     * sets up available screens, and initializes with the start screen.
     */
    constructor() {
        window.gameOverlay = this;
        this.container = document.getElementById('game-container');
        this.add();
        this.provideScreens();
        this.setContent(this.startScreen, null);
        this.currentReferrer = null;
        this.resolutionHigh = false;
    }

    /**
     * Initializes overlay screen templates from OverlayTemplates.
     */
    provideScreens() {
        this.startScreen = OverlayTemplates.startScreen;
        this.controlsScreen = OverlayTemplates.controlScreen;
        this.legalScreen = OverlayTemplates.legalScreen;
    }

    /**
     * Creates and appends the overlay element to the game container.
     */
    add() {
        this.element = document.createElement('div');
        this.element.classList.add('canvas-overlay', 'menu', 'fr', 'jcac');
        if (document.fullscreenElement) {
            this.element.classList.add('start-bg');
        }
        this.container.appendChild(this.element);
    }

    /**
     * Sets the overlay content to the specified template, optionally focusing on a query selector,
     * and stores the referrer.
     * @param {string} templateString - The HTML template to set.
     * @param {string|null} focusNextQuerySelector - The CSS selector to focus after setting content.
     * @param {string|null} [referrer=null] - The current referrer identifier.
     */
    setContent(templateString, focusNextQuerySelector, referrer = this.currentReferrer) {
        this.currentReferrer = referrer;
        if (!this.element) {
            this.add();
        }
        this.element.innerHTML = templateString;
        if (this.resolutionHigh) this.element.querySelector('.resolution-btn').textContent = OverlayTemplates.lowResolutionText;
        this.showOverlay();
        this.registerButtonEvents();
        this.element.querySelector(focusNextQuerySelector)?.focus();
    }

    /**
     * Applies CSS classes to hide the canvas container while the overlay is visible.
     */
    showOverlay() {
        document.getElementById('canvas-container').classList.remove('transition-opacity');
        document.getElementById('canvas-container').classList.add('opacity-0');
        document.getElementById('canvas-container').classList.add('visibility-hidden');
    }

    /**
     * Removes the overlay element and restores the canvas container's visibility.
     */
    remove() {
        if (this.element) {
            document.getElementById('canvas-container').classList.remove('visibility-hidden');
            document.getElementById('canvas-container').classList.add('transition-opacity');
            document.getElementById('canvas-container').classList.remove('opacity-0');
            this.container.removeChild(this.element);
            this.element = null;
        }
    }

    /**
     * Registers click events for overlay buttons to navigate between screens or resume the game.
     */
    registerButtonEvents() {
        const btnActions = {
            '.start-btn': () => this.resumeGame(),
            '.controls-btn': () => this.setContent(this.controlsScreen, '.back-btn'),
            '.legal-btn': () => this.setContent(this.legalScreen, '.back-btn'),
            '.back-btn': () => this.currentReferrer === 'game' ? this.resumeGame() : this.setContent(this.startScreen, '.start-btn'),
            '.resolution-btn': this.setResolution,
        };
        Object.entries(btnActions).forEach(([selector, action]) => {
            const btn = this.element.querySelector(selector);
            if (btn) btn.onclick = action;
        });
    }

    /**
     * Sets resolution of canvas and updates button-text
     */
    setResolution = () => {
        const btn = this.element.querySelector('.resolution-btn');
        if (!window.world) return;
        if (!this.resolutionHigh) {
            localStorage.setItem('scale', 1);
            window.world.canvas.setDimensionsAndScale(1);
            btn.textContent = OverlayTemplates.lowResolutionText;
        } else {
            localStorage.setItem('scale', 0.5);
            window.world.canvas.setDimensionsAndScale(0.5);
            btn.textContent = OverlayTemplates.highResolutionText;
        }
        this.resolutionHigh = !this.resolutionHigh;
    }

    /**
     * Resumes the game by removing the overlay and restarting the game loop after a delay.
     */
    resumeGame() {
        this.remove();
        document.getElementById('canvas-container').classList.remove('opacity-0');
        window.game.start(1000);
    }
}