export default class Game {
    animationFrameId;

    constructor(world) {
        this.world = world;
        this.lastTimestamp = null;
    }

    start(delayInMilliseconds = 0) {
        setTimeout(() => {
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

        if (deltaTime > 25) { // 1000 / 40, every 25 milliseconds
            this.world.updateWorld(this.world.worldRefs, deltaTime);
            this.world.drawWorld();
            this.lastTimestamp = timestamp;
        }

        this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
    }
}