import GameItem from "./game-item.class.js";

export default class Chick extends GameItem {
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

    isJumpingDue() {
        let isJumpingDue = performance.now() - this.lastJumpingTime > 1800 + Math.random() * 1500;
        if (isJumpingDue) {
            this.lastJumpingTime = performance.now();
        }
        return isJumpingDue;
    }

    handleJump(deltaTime) {
        this.speedX = this.jumpingSpeedX;
        this.speedY = this.initialSpeedY;
        this.applyGravity(deltaTime, 0);
        this.justJumped = true;
    }

    handleOnGround(deltaTime) {
        if (this.justJumped) {
            this.speedX = this.initialSpeedX;
            this.setItemOnGroundIfUnderGround();
            this.justJumped = false;
        }
        this.updateAnimation(this.walkingAnimation, deltaTime);
    }
}