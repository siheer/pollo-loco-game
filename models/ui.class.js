/**
 * Manages the user interface elements such as buttons and full screen toggling.
 */
export default class UI {
    static staticButtonsAlreadyRegistered = false;

    /**
     * Creates a new UI instance and registers UI buttons if not already registered.
     */
    constructor() {
        this.canvasContainerElem = document.getElementById('canvas-container');
        this.fullScreenBtn = document.getElementById('full-screen');
        if (!UI.staticButtonsAlreadyRegistered) {
            this.registerPlayPauseButton();
            this.registerSoundOnOffButton();
            this.registerFullScreenButton();
            this.registerGoTos();
            this.registerMobileControls();
            this.registerRestartButton();
            this.preventContextMenuOnGameButtons();
            UI.staticButtonsAlreadyRegistered = true;
        }
    }

    /**
     * Registers the play/pause button click event to toggle the game state.
     */
    registerPlayPauseButton() {
        window.playPauseButton = document.getElementById('play-pause-button');
        window.playPauseButton.onclick = () => {
            window.game.handlePlayPauseButton();

        };
    }

    /**
     * Registers the sound on/off button to toggle background sound.
     */
    registerSoundOnOffButton() {
        document.getElementById('sound-btn').onclick = (e) => {
            updateSoundUserChoiceInLocalStorage();
            window.soundManager.hasUserMuted() ? window.game.turnSoundOff() : window.game.turnSoundOn();
            window.world.canvas.canvasElement.focus();
        }

        function updateSoundUserChoiceInLocalStorage() {
            const currentChoice = window.soundManager.hasUserMuted();
            const newChoice = !currentChoice;
            window.soundManager.setHasUserMuted(newChoice);
        }
    }

    /**
     * Registers the full screen button to toggle full screen mode and handles full screen change events.
     */
    registerFullScreenButton() {
        this.fullScreenBtn.onclick = () => {
            this.toggleFullScreen(document.getElementById('game-container'));
            window.world.canvas.canvasElement.focus();
        };
        document.onfullscreenchange = () => {
            if (document.fullscreenElement) {
                this.handleFullScreen();
            } else {
                this.handleExitFullScreen();
            }
        };
    }

    /**
     * Toggles full screen mode for the specified element.
     * @param {HTMLElement} elem - The element to toggle full screen.
     */
    toggleFullScreen(elem) {
        if (!document.fullscreenElement) {
            elem.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Updates the UI when entering full screen mode.
     */
    handleFullScreen() {
        window.gameOverlay.element?.classList.add('start-bg');
        this.canvasContainerElem.classList.remove('border-radius-1rem');
        this.fullScreenBtn.innerHTML = exitFullScreenSVG;
        this.fullScreenBtn.title = 'Vollbildmodus beenden (f)';
    }

    /**
     * Updates the UI when exiting full screen mode.
     */
    handleExitFullScreen() {
        window.gameOverlay.element?.classList.remove('start-bg');
        this.canvasContainerElem.classList.add('border-radius-1rem');
        this.fullScreenBtn.innerHTML = fullScreenSVG;
        this.fullScreenBtn.title = 'Vollbild (f)';
    }

    /**
     * Registers navigation buttons to switch between overlay screens and stops the game if needed.
     */
    registerGoTos() {
        const btnActions = {
            'go-to-start': () => window.gameOverlay.setContent(window.gameOverlay.startScreen, '.start-btn', 'game'),
            'home-btn-game-over': () => window.gameOverlay.setContent(window.gameOverlay.startScreen, '.start-btn', 'game'),
            'go-to-controls': () => window.gameOverlay.setContent(window.gameOverlay.controlsScreen, '.back-btn', 'game'),
        }
        Object.entries(btnActions).forEach(([selector, action]) => {
            const btn = document.getElementById(selector);
            btn.onclick = () => {
                window.game.wasGameRunning = window.game.isGameRunning;
                window.game.stop();
                action();
            };
        })
    }

    /**
     * Registers the restart button to restart the game.
     */
    registerRestartButton() {
        document.getElementById('restart-btn').addEventListener('click', () => window.game.restart());
    }

    /**
     * Registers touch controls for mobile devices to simulate keyboard events.
     */
    registerMobileControls() {
        document.querySelectorAll('.game-ui-btn.mobile').forEach(btn => {
            btn.onpointerdown = (e) => {
                e.preventDefault();
                btn.setPointerCapture(e.pointerId);
                window.keyboardEvents.handleKeyDown(new KeyboardEvent('keydown', { key: btn.dataset.key }));
            };
            btn.onpointerup = btn.onpointercancel = btn.onpointerleave = (e) => {
                e.preventDefault();
                btn.releasePointerCapture(e.pointerId);
                window.keyboardEvents.handleKeyUp(new KeyboardEvent('keyup', { key: btn.dataset.key }));
            };
        });
    }

    preventContextMenuOnGameButtons() {
        document.querySelectorAll('.game-ui-btn').forEach(btn => btn.oncontextmenu = (e) => e.preventDefault());
    }
}