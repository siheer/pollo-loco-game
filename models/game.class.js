export default class Game {
    constructor(world) {
        this.world = world;
        this.animationFrameId = null;
        this.lastTimestamp = null;
        this.isGameRunning = false;
        this.gameOver = { isOver: false, playerHasWon: false };
        this.reducingLoadInterval = false;
        this.waitOnStartIntervalId = setInterval(() => this.waitOnStart(), 1000);
        this.worldPaintedBeforeStartCount = 0;
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
            this.world.deltaTime = 0;
            this.lastTimestamp = null;
            this.isGameRunning = true;
            clearInterval(this.waitOnStartIntervalId);
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        }, delayInMilliseconds);
    }

    stop() {
        this.isGameRunning = false;
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
}