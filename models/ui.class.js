export default class UI {
    constructor(game) {
        this.gameContainerElem = document.getElementById('game-container');
        this.fullScreenBtn = document.getElementById('full-screen');
        this.registerPlayPauseButton(game);
        this.registerFullScreenButton();
        this.registerGoTos();
    }

    registerPlayPauseButton(game) {
        window.playPauseButton.addEventListener('click', () => {
            if (game.isGameRunning) {
                game.stop();
                window.playPauseButton.innerHTML = playSVG;
            } else {
                game.start();
                window.playPauseButton.innerHTML = pauseSVG;
            }
            game.isGameRunning = !game.isGameRunning;
            window.playPauseButton.blur();
        });
    }

    registerFullScreenButton() {
        this.fullScreenBtn.addEventListener('click', () => {
            this.toggleFullScreen(this.gameContainerElem);
        })
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.handleFullScreen();
            } else {
                this.handleExitFullScreen();
            }
        })
    }

    toggleFullScreen(elem) {
        if (!document.fullscreenElement) {
            elem.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    handleFullScreen() {
        this.gameContainerElem.classList.remove('border-radius-1rem');
        this.fullScreenBtn.innerHTML = exitFullScreenSVG;
        this.fullScreenBtn.title = 'Exit fullscreen (f)';
    }

    handleExitFullScreen() {
        this.gameContainerElem.classList.add('border-radius-1rem');
        this.fullScreenBtn.innerHTML = fullScreenSVG;
        this.fullScreenBtn.title = 'Enter fullscreen (f)';
    }

    registerGoTos() {
        const gameUIBtns = [document.getElementById('go-to-legal-notice'), document.getElementById('go-to-start'), document.getElementById('go-to-controls')];
        gameUIBtns.forEach(button => {
            button.addEventListener('click', () => {
                game.stop();
                window.playPauseButton.innerHTML = playSVG;
                this.openGameOverlay(button.dataset.goTo);
            });
        });
    }

    openGameOverlay(goTo) {
        switch (goTo) {
            case 'legal-notice':
                break;
            case 'start':
                break;
            case 'controls':
                break;
            case null:
                break;
            default:
                throw new Error('Invalid goTo: ' + goTo);
        }
    }
}