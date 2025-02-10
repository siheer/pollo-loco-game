export default class Game {
    animationFrameId;

    constructor(world) {
        this.world = world;
        this.lastTimestamp = null;
    }

    start() {
        this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
    }

    stop() {
        cancelAnimationFrame(this.animationFrameId);
    }

    gameLoop(timestamp) {
        this.lastTimestamp ??= timestamp;

        const deltaTime = timestamp - this.lastTimestamp;

        if (deltaTime > 25) { // 1000 / 40, every 25 milliseconds
            // console.log(`Another loop! Time elapsed: ${deltaTime}`);
            this.world.updateWorld(deltaTime);
            this.world.drawWorld();
            this.lastTimestamp = timestamp;
        }

        this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
    }
}