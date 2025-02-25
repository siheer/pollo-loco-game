export default class Game {
    animationFrameId;

    constructor(world) {
        this.world = world;
        this.lastTimestamp = null;
        this.gameStarted = false;
        this.gameOver = { isOver: false, playerHasWon: false };
        this.reducingLoadInterval = false;
        this.waitOnStartInterval = 1000;
        this.waitOnStartIntervalId = setInterval(() => this.waitOnStart(), this.waitOnStartInterval);
        this.worldPaintedBeforeStartCount = 0;
    }

    // repaint canvas max 20 times (during 20 seconds), so that hopefully until then all resources has been loaded.
    waitOnStart() {
        if (!this.gameStarted && this.worldPaintedBeforeStartCount < 20) {
            this.world.drawWorld();
            this.worldPaintedBeforeStartCount++;
        } else {
            clearInterval(this.waitOnStartIntervalId);
        }
    }

    start(delayInMilliseconds = 0) {
        setTimeout(() => {
            this.world.deltaTime = 0;
            this.lastTimestamp = null;
            this.gameStarted = true;
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        }, delayInMilliseconds);
    }

    stop() {
        cancelAnimationFrame(this.animationFrameId);
    }

    gameLoop(timestamp) {
        this.timeGameLoop(timestamp);
        if (!this.gameOver.isOver) {
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        } else {
            this.handleGameOver();
        }
    }

    timeGameLoop(timestamp) {
        this.lastTimestamp ??= timestamp;
        const deltaTime = timestamp - this.lastTimestamp;
        if (deltaTime > MIN_INTERVAL_IN_MILLISECONDS) {
            this.handleGameRunning(deltaTime);
            this.lastTimestamp = timestamp;
        }
    }

    handleGameRunning(deltaTime) {
        this.world.checkForInitializingKeyboardEvents(deltaTime);
        this.world.updateWorld(this.world.level.levelItems, deltaTime);
        this.world.checkCollisions(deltaTime);
        this.world.drawWorld();
    }

    handleGameOver() {

    }
}