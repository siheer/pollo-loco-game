export default class UI {
    static staticButtonsAlreadyRegistered = false;

    constructor() {
        this.canvasContainerElem = document.getElementById('canvas-container');
        this.fullScreenBtn = document.getElementById('full-screen');
        if (!UI.staticButtonsAlreadyRegistered) {
            this.registerPlayPauseButton();
            this.registerFullScreenButton();
            this.registerGoTos();
            this.registerRestartButton();
            UI.staticButtonsAlreadyRegistered = true;
        }
    }

    registerPlayPauseButton() {
        window.playPauseButton = document.getElementById('play-pause-button');
        window.playPauseButton.onclick = () => {
            window.game.handlePlayPauseButton();
        };

    }

    registerFullScreenButton() {
        this.fullScreenBtn.onclick = () => {
            this.toggleFullScreen(document.getElementById('game-container'));
        };
        document.onfullscreenchange = () => {
            if (document.fullscreenElement) {
                this.handleFullScreen();
            } else {
                this.handleExitFullScreen();
            }
        };
    }

    toggleFullScreen(elem) {
        if (!document.fullscreenElement) {
            elem.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    handleFullScreen() {
        window.gameOverlay.element.classList.add('start-bg');
        this.canvasContainerElem.classList.remove('border-radius-1rem');
        this.fullScreenBtn.innerHTML = exitFullScreenSVG;
        this.fullScreenBtn.title = 'Vollbildmodus beenden (f)';
    }

    handleExitFullScreen() {
        window.gameOverlay.element.classList.remove('start-bg');
        this.canvasContainerElem.classList.add('border-radius-1rem');
        this.fullScreenBtn.innerHTML = fullScreenSVG;
        this.fullScreenBtn.title = 'Vollbild (f)';
    }

    registerGoTos() {
        const btnActions = {
            'go-to-start': () => window.gameOverlay.setContent(window.gameOverlay.startScreen, '.start-btn', 'game'),
            'go-to-controls': () => window.gameOverlay.setContent(window.gameOverlay.controlsScreen, '.back-btn', 'game'),
        }
        Object.entries(btnActions).forEach(([selector, action]) => {
            const btn = document.getElementById(selector);
            btn.onclick = () => {
                window.game.stop();
                action();
            };
        })
    }

    registerRestartButton() {
        document.getElementById('restart-btn').addEventListener('click', () => window.game.restart());
    }
}