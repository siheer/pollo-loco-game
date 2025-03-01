import Statusbar from './statusbar.class.js';
export default class Game {
    constructor(world) {
        window.game = this;
        this.world = world;
        this.animationFrameId = null;
        this.lastTimestamp = null;
        this.gameOver = { isOver: false, playerHasWon: false };
        this.isGameRunning = false;
        this.reducingLoadInterval = false;
        this.waitOnStartIntervalId = setInterval(() => this.waitOnStart(), 1000);
        this.worldPaintedBeforeStartCount = 0;
        this.setUpStatusbars();
    }

    // repaint canvas max 20 times (during 20 seconds), so that hopefully until then all resources has been loaded.
    waitOnStart() {
        if (!this.isGameRunning && this.worldPaintedBeforeStartCount < 20) {
            this.world.drawWorld();
            this.worldPaintedBeforeStartCount++;
        }
    }

    handlePlayPauseButton() {
        this.isGameRunning ? this.stop() : this.start();
    }

    start(delayInMilliseconds = 0) {
        setTimeout(() => {
            this.updateUIOnStart();
            this.isGameRunning = true;
            this.lastTimestamp = null;
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        }, delayInMilliseconds);
    }

    updateUIOnStart() {
        window.playPauseButton.disabled = false;
        document.getElementById('go-to-controls').disabled = false;
        window.gameOverlay.remove();
        window.playPauseButton.innerHTML = pauseSVG;
        window.playPauseButton.blur();
    }

    stop() {
        this.isGameRunning = false;
        window.playPauseButton.innerHTML = playSVG;
        cancelAnimationFrame(this.animationFrameId);
    }

    gameLoop(timestamp) {
        if (!this.gameOver.isOver) {
            this.timeGameLoop(timestamp);
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        } else {
            this.handleGameOver();
        }
    }

    timeGameLoop(timestamp) {
        this.lastTimestamp ??= timestamp;
        const deltaTime = timestamp - this.lastTimestamp;
        if (deltaTime > MIN_INTERVAL_IN_MILLISECONDS) {
            this.handleisGameRunning(deltaTime);
            this.lastTimestamp = timestamp;
        }
    }

    handleisGameRunning(deltaTime) {
        this.world.checkForInitializingKeyboardEvents(deltaTime);
        this.world.updateWorld(deltaTime);
        this.world.checkCollisions(deltaTime);
        this.world.drawWorld();
    }

    handleGameOver() {
        window.playPauseButton.disabled = true;
        document.getElementById('go-to-controls').disabled = true;
        window.playPauseButton.innerHTML = playSVG;
        if (this.gameOver.playerHasWon) {
            this.showGameOverDisplay(true, 'game-won-img');
        } else {
            this.showGameOverDisplay(true, 'game-over-img');
        }
    }

    showGameOverDisplay(show, elementId) {
        const gameOverDisplayElem = document.getElementById(elementId);
        const restartBtn = document.getElementById('restart-btn');
        show ? gameOverDisplayElem.classList.remove('dn') : gameOverDisplayElem.classList.add('dn');
        show ? restartBtn.classList.remove('dn') : restartBtn.classList.add('dn');
        show ? restartBtn.focus() : null;
    }

    setUpStatusbars() {
        new Statusbar('character-energy', 'characterEnergyEvent');
        new Statusbar('bottles', 'bottleEvent');
        new Statusbar('coins', 'coinEvent');
        new Statusbar('endboss-energy', 'endbossEnergyEvent');
    }

    restart() {
        this.showGameOverDisplay(false, 'game-over-img');
        this.showGameOverDisplay(false, 'game-won-img');
        window.initGame();
        window.game.start();
    }
}