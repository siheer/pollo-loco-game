import GameItem from "./game-item.class.js";

/**
 * Represents a small chicken enemy (Chick) in the game.
 * Extends GameItem.
 */
export default class Chick extends GameItem {
    /**
     * Creates a new Chick enemy instance.
     * @param {number} segmentIndex - The segment index used to determine the x-coordinate.
     * @param {number} y - The y-coordinate for the chick.
     * @param {number} width - The width of the chick.
     * @param {number} height - The height of the chick.
     */
    constructor(segmentIndex, y, width, height) {
        const x = window.world.level.getRandomXInSegment(segmentIndex);
        super(x, y, width, height);
        this.speedX = this.initialSpeedX = 1.5 + Math.random() * 3;
        this.offset = { left: 10, top: 10, right: 10, bottom: 10 };
        this.loadImage('./img/3_enemies_chicken/chicken_small/1_walk/2_w.png');
        this.deadImg = this.createImage('./img/3_enemies_chicken/chicken_small/2_dead/dead.png');
        this.walkingAnimation = this.createAnimation([
            './img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            './img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            './img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
        ]);
        this.lastJumpingTime = 0;
        this.justJumped = false;
        this.initialSpeedY = -40;
        this.jumpingSpeedX = 10;
    }

    /**
     * Updates the chick's state, handling jumping, gravity, and leftward movement.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    update(deltaTime) {
        if (this.isDead) {
            if (window.world.level.isAboveGround(this)) this.y += 20;
            return;
        }
        else if (this.isJumpingDue()) this.handleJump(deltaTime);
        else if (window.world.level.isAboveGround(this)) this.applyGravity(deltaTime);
        else this.handleOnGround(deltaTime);
        this.moveLeft();
    }

    /**
     * Determines whether the chick should initiate a jump based on time since the last jump.
     * @returns {boolean} True if it is time to jump.
     */
    isJumpingDue() {
        let isJumpingDue = performance.now() - this.lastJumpingTime > 1800 + Math.random() * 1500;
        if (isJumpingDue) {
            this.lastJumpingTime = performance.now();
        }
        return isJumpingDue;
    }

    /**
     * Handles the jump action by updating speeds and applying gravity.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    handleJump(deltaTime) {
        this.speedX = this.jumpingSpeedX;
        this.speedY = this.initialSpeedY;
        this.applyGravity(deltaTime, 0);
        this.justJumped = true;
    }

    /**
     * Handles the chick's behavior when on the ground, resetting jump state and updating animation.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    handleOnGround(deltaTime) {
        if (this.justJumped) {
            this.speedX = this.initialSpeedX;
            this.setItemOnGroundIfUnderGround();
            this.justJumped = false;
        }
        this.updateAnimation(this.walkingAnimation, deltaTime);
    }
}