export default class Game {
    animationFrameId;

    constructor(world, gameStartDelayInMilliseconds = 0) {
        this.world = world;
        this.lastTimestamp = null;
        this.gameStartDelayInMilliseconds = gameStartDelayInMilliseconds;
    }

    start() {
        setTimeout(() => {
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        }, this.gameStartDelayInMilliseconds);
    }

    stop() {
        cancelAnimationFrame(this.animationFrameId);
    }

    gameLoop(timestamp) {
        this.lastTimestamp ??= timestamp;

        const deltaTime = timestamp - this.lastTimestamp;

        if (deltaTime > 25) { // 1000 / 40, every 25 milliseconds
            // console.log(`Another loop! Time elapsed: ${deltaTime}`);
            this.world.updateWorld(this.world.worldRefs, deltaTime);
            this.world.drawWorld();
            this.lastTimestamp = timestamp;
        }

        this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
    }
}