import GameItem from "./game-item.class.js";

/**
 * Represents a bottle object in the game.
 * Extends GameItem.
 */
export default class Bottle extends GameItem {
    /**
     * Creates a new Bottle instance.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {number} width - The width of the bottle.
     * @param {number} height - The height of the bottle.
     * @param {boolean} flyingToLeft - Whether the bottle flies to the left.
     * @param {boolean} isThrowable - Indicates if the bottle can be thrown.
     * @param {boolean} [canDealDamage=true] - Whether the bottle can deal damage.
     */
    constructor(x, y, width, height, flyingToLeft, isThrowable, canDealDamage = true) {
        super(x, y, width, height);
        this.offset = { left: 20, top: 20, right: 20, bottom: 20 };
        this.speedX = 15;
        this.speedY = -30;
        this.accelerationY = 2;
        this.loadImage('./img/6_salsa_bottle/salsa_bottle.png');
        this.provideAnimations();
        this.flyingToLeft = flyingToLeft;
        this.isBroken = false;
        this.isThrowable = isThrowable;
        this.canDealDamage = canDealDamage;
    }

    /**
     * Sets up the animations for the bottle.
     */
    provideAnimations() {
        this.thrownAnimation = this.createAnimation([
            './img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
            './img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
            './img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
            './img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
            './img/6_salsa_bottle/bottle_rotation/5_bottle_rotation.png',
            './img/6_salsa_bottle/bottle_rotation/6_bottle_rotation.png',
            './img/6_salsa_bottle/bottle_rotation/7_bottle_rotation.png',
            './img/6_salsa_bottle/bottle_rotation/8_bottle_rotation.png',
        ]);
        this.splashingAnimation = this.createAnimation([
            './img/6_salsa_bottle/bottle_splash/1_bottle_splash.png',
            './img/6_salsa_bottle/bottle_splash/2_bottle_splash.png',
            './img/6_salsa_bottle/bottle_splash/3_bottle_splash.png',
            './img/6_salsa_bottle/bottle_splash/4_bottle_splash.png',
            './img/6_salsa_bottle/bottle_splash/5_bottle_splash.png',
            './img/6_salsa_bottle/bottle_splash/6_bottle_splash.png',
        ]);
    }

    /**
     * Updates the bottle state including animations, movement, gravity, and state transitions.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    update(deltaTime) {
        if (this.isThrowable) {
            if (this.isBroken) {
                this.handleSplash(deltaTime);
            } else if (window.world.level.isAboveGround(this)) {
                this.updateAnimation(this.thrownAnimation, deltaTime, 40);
                this.moveX();
                this.applyGravity(deltaTime, MIN_INTERVAL_IN_MILLISECONDS);
            } else {
                this.setBottleOnGround();
            }
        }
    }

    /**
     * Handles the splash animation for a broken bottle.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    handleSplash(deltaTime) {
        this.updateAnimation(this.splashingAnimation, deltaTime, 50);
        if (this.isAnimationAfterLastFrame(this.splashingAnimation)) {
            callAfterCurrentGameLoop(() => window.world.level.removeBottle(this));
        }
    }

    /**
     * Moves the bottle horizontally based on its flying direction.
     */
    moveX() {
        if (this.flyingToLeft) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    /**
     * Sets the bottle on the ground and spawns a new static bottle.
     */
    setBottleOnGround() {
        window.world.level.removeBottle(this);
        callAfterCurrentGameLoop(() => {
            window.world.level.levelItems.push(new Bottle(this.x, window.world.level.groundLevelY - this.height + 10, 120, 120, false, false, false));
        });
    }

    /**
     * Breaks the bottle by playing a sound and marking it as broken.
     */
    breakBottle() {
        window.soundManager.play('bottleSmash');
        callAfterCurrentGameLoop(() => { this.isBroken = true });
    }
}