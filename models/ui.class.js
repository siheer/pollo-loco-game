export default class UI {
    constructor(game) {
        this.game = game;
        this.registerPlayPauseButton(game);
        this.registerFullScreenButton(game);
        this.registerGoTos();
    }

    registerPlayPauseButton(game) {
        let isPlaying = false;
        window.playPauseButton.addEventListener('click', () => {
            if (isPlaying) {
                game.stop();
                window.playPauseButton.innerHTML = playSVG;
            } else {
                game.start();
                window.playPauseButton.innerHTML = pauseSVG;
            }
            isPlaying = !isPlaying;
            window.playPauseButton.blur();
        });
    }

    registerFullScreenButton(game) {
        const fullScreenBtn = document.getElementById('full-screen');
        fullScreenBtn.addEventListener('click', () => {
            this.toggleFullScreen(document.getElementById('game-container'));
        })
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                this.handleFullScreen(fullScreenBtn);
            } else {
                this.handleExitFullScreen(fullScreenBtn);
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

    handleFullScreen(fullScreenBtn) {
        fullScreenBtn.innerHTML = exitFullScreenSVG;
        fullScreenBtn.title = 'Exit fullscreen (f)';
    }

    handleExitFullScreen(fullScreenBtn) {
        fullScreenBtn.innerHTML = fullScreenSVG;
        fullScreenBtn.title = 'Enter fullscreen (f)';
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