import Statusbar from './statusbar.class.js';
export default class Game {
    constructor(world) {
        window.game = this;
        this.containerElem = document.getElementById('canvas-container');
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
        if (this.worldPaintedBeforeStartCount < 20) {
            this.world.drawWorld();
            this.worldPaintedBeforeStartCount++;
        }
    }

    start(delayInMilliseconds = 0) {
        setTimeout(() => {
            window.gameOverlay.remove();
            this.containerElem.classList.remove('opacity-0');
            this.isGameRunning = true;
            this.world.deltaTime = 0;
            this.lastTimestamp = null;
            clearInterval(this.waitOnStartIntervalId);
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        }, delayInMilliseconds);
    }

    stop() {
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
        this.world.updateWorld(this.world.level.levelItems, deltaTime);
        this.world.checkCollisions(deltaTime);
        this.world.drawWorld();
    }

    handleGameOver() {
        window.playPauseButton.disabled = true;
        window.playPauseButton.innerHTML = playSVG;
        if (this.gameOver.playerHasWon) {
            this.showGameOverDisplay(true, 'game-won-img');
        } else {
            this.showGameOverDisplay(true, 'game-over-img');
        }
    }

    showGameOverDisplay(show, elementId) {
        const gameOverDisplayElem = document.getElementById(elementId);
        show ? gameOverDisplayElem.classList.remove('dn') : gameOverDisplayElem.classList.add('dn');
    }

    setUpStatusbars() {
        new Statusbar('character-energy', 'characterEnergyEvent');
        new Statusbar('bottles', 'bottleEvent');
        new Statusbar('coins', 'coinEvent');
        new Statusbar('endboss-energy', 'endbossEnergyEvent');
    }
}