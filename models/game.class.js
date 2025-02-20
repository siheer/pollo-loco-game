export default class Game {
    animationFrameId;

    constructor(world) {
        this.world = world;
        this.lastTimestamp = null;
        this.gameOver = false;
        this.reducingLoadInterval = false;
        // this.addEnemiesAfterSomeTime();
    }

    start(delayInMilliseconds = 0) {
        setTimeout(() => {
            this.world.deltaTime = 0;
            this.lastTimestamp = null;
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        }, delayInMilliseconds);
    }

    stop() {
        cancelAnimationFrame(this.animationFrameId);
    }

    gameLoop(timestamp) {
        this.lastTimestamp ??= timestamp;

        const deltaTime = timestamp - this.lastTimestamp;

        if (deltaTime > MIN_INTERVAL_IN_MILLISECONDS) {
            this.world.checkForInitializingKeyboardEvents(deltaTime);
            this.world.updateWorld(this.world.worldRefs, deltaTime);
            this.world.checkCollisions(deltaTime);
            this.world.drawWorld();
            this.lastTimestamp = timestamp;
        }

        if (!this.gameOver) {
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        }
    }

    // addEnemiesAfterSomeTime() {
    //     setInterval(() => {
    //         this.world.level.levelItems.push(this.world.level.))
    //     }, 2*60*1000);
    // }
}