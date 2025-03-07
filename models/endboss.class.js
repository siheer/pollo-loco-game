import GameItem from './game-item.class.js';
import ActionTimer from './action-timer.class.js';

/**
 * Represents the endboss enemy in the game.
 * Extends GameItem.
 */
export default class Endboss extends GameItem {
    /**
     * Creates a new Endboss instance with initial energy, speed, and image.
     * Sets up animations and action timers after a delay.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {number} width - The width of the endboss.
     * @param {number} height - The height of the endboss.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.offset = { left: 80, top: 120, right: 60, bottom: 50 };
        this.speedX = 5;
        this.energy = this.maxEnergy = 100;
        this.takesDamageAmount = 5;
        this.hurtingDuration = 500;
        this.loadImage('./img/4_enemie_boss_chicken/1_walk/G4.png');
        this.allLoaded = false;
        setTimeout(() => {
            this.provideAnimations();
            this.initializeActionTimer();
            this.allLoaded = true;
        }, 2000);
    }

    /**
     * Initializes animations for walking, alerted, attacking, hurting, and dying states.
     */
    provideAnimations() {
        this.walkingAnimation = this.createAnimation([
            './img/4_enemie_boss_chicken/1_walk/G1.png',
            './img/4_enemie_boss_chicken/1_walk/G2.png',
            './img/4_enemie_boss_chicken/1_walk/G3.png',
            './img/4_enemie_boss_chicken/1_walk/G4.png',
        ]);
        this.alertedAnimation = this.createAnimation([
            './img/4_enemie_boss_chicken/2_alert/G5.png',
            './img/4_enemie_boss_chicken/2_alert/G6.png',
            './img/4_enemie_boss_chicken/2_alert/G7.png',
            './img/4_enemie_boss_chicken/2_alert/G8.png',
            './img/4_enemie_boss_chicken/2_alert/G9.png',
            './img/4_enemie_boss_chicken/2_alert/G10.png',
            './img/4_enemie_boss_chicken/2_alert/G11.png',
            './img/4_enemie_boss_chicken/2_alert/G12.png',
        ]);
        this.attackingAnimation = this.createAnimation([
            './img/4_enemie_boss_chicken/3_attack/G13.png',
            './img/4_enemie_boss_chicken/3_attack/G14.png',
            './img/4_enemie_boss_chicken/3_attack/G15.png',
            './img/4_enemie_boss_chicken/3_attack/G16.png',
            './img/4_enemie_boss_chicken/3_attack/G17.png',
            './img/4_enemie_boss_chicken/3_attack/G18.png',
            './img/4_enemie_boss_chicken/3_attack/G19.png',
            './img/4_enemie_boss_chicken/3_attack/G20.png',
        ]);
        this.hurtingAnimation = this.createAnimation([
            './img/4_enemie_boss_chicken/4_hurt/G21.png',
            './img/4_enemie_boss_chicken/4_hurt/G22.png',
            './img/4_enemie_boss_chicken/4_hurt/G23.png',
        ]);
        this.dyingAnimation = this.createAnimation([
            './img/4_enemie_boss_chicken/5_dead/G24.png',
            './img/4_enemie_boss_chicken/5_dead/G25.png',
            './img/4_enemie_boss_chicken/5_dead/G26.png',
        ]);
    }

    /**
     * Initializes action timers for direction updates, hurting, alerted, and attacking actions.
     */
    initializeActionTimer() {
        this.directionAction = new ActionTimer(
            () => true,
            () => this.updateDirection(),
            0,
            200
        );
        this.hurtingAction = new ActionTimer(
            () => this.isHurt,
            deltaTime => this.updateAnimation(this.hurtingAnimation, deltaTime, 150),
            500,
            0,
            () => this.isHurt = false
        );
        this.alertedAction = new ActionTimer(
            () => this.isEnemyClose() && !this.isAnimationAfterLastFrame(this.alertedAnimation),
            deltaTime => this.updateAnimation(this.alertedAnimation, deltaTime),
            2000,
            1500,
            () => this.alertedAnimation.currentImageIndex = 0
        );
        this.attackAction = new ActionTimer(
            () => this.isEnemyVeryClose(),
            deltaTime => {
                this.updateAnimation(this.attackingAnimation, deltaTime);
                if (this.attackingAnimation.currentImageIndex === 5) {
                    this.isFacingOtherDirection ? this.moveRight(40) : this.moveLeft(40);
                }
            },
            2000,
            1000
        );
    }

    /**
     * Determines if an enemy is within a close range of the endboss.
     * @returns {boolean} True if an enemy is close.
     */
    isEnemyClose() {
        return this.isWithinRangeOf(1300);
    }

    /**
     * Determines if an enemy is within a very close range of the endboss.
     * @returns {boolean} True if an enemy is very close.
     */
    isEnemyVeryClose() {
        return this.isWithinRangeOf(500);
    }

    /**
     * Checks if the distance between the endboss and the character is within a given range.
     * @param {number} range - The range to check.
     * @returns {boolean} True if within range.
     */
    isWithinRangeOf(range) {
        const distance = Math.abs(window.world.level.character.x - this.x);
        return this.isFacingOtherDirection ? distance < range + this.width : distance < range;
    }

    /**
     * Updates the endboss state each frame, handling action timers, animations, and game over conditions.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    update(deltaTime) {
        if (!this.allLoaded) return;
        if (this.directionAction.updateAndIsExecutable(deltaTime)) this.directionAction.execute();
        if (this.isDead) this.handleDead(deltaTime);
        else if (this.hurtingAction.updateAndIsExecutable(deltaTime)) this.hurtingAction.execute(deltaTime);
        else if (this.alertedAction.updateAndIsExecutable(deltaTime) && !this.isEnemyVeryClose()) this.alertedAction.execute(deltaTime);
        else if (this.attackAction.updateAndIsExecutable(deltaTime)) this.attackAction.execute(deltaTime);
        else {
            this.handleWalking(deltaTime);
        }
    }

    /**
     * Updates the facing direction of the endboss based on the character's position.
     */
    updateDirection() {
        if (window.world.level.character.x - this.x > this.width / 4) {
            this.isFacingOtherDirection = true;
        } else {
            this.isFacingOtherDirection = false;
        }
    }

    /**
     * Handles the death animation and triggers game over win conditions.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    handleDead(deltaTime) {
        this.updateAnimation(this.dyingAnimation, deltaTime);
        if (this.isAnimationAfterLastFrame(this.dyingAnimation)) {
            window.game.gameOver.isOver = true;
            window.game.gameOver.playerHasWon = true;
        }
    }

    /**
     * Updates the walking animation and moves the endboss based on its facing direction.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    handleWalking(deltaTime) {
        this.updateAnimation(this.walkingAnimation, deltaTime);
        this.isFacingOtherDirection ? this.moveRight() : this.moveLeft();
    }

    /**
     * Inflicts damage on the endboss, dispatching an energy update event and resetting the hurting animation.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     * @param {number} [updateInterval=0] - The update interval.
     * @param {number} [damage=this.takesDamageAmount] - The damage amount.
     */
    takeDamage(deltaTime, updateInterval = 0, damage = this.takesDamageAmount) {
        super.takeDamage(deltaTime, updateInterval, damage);
        document.dispatchEvent(new CustomEvent('endbossEnergyEvent', {
            detail: { max: this.maxEnergy, current: this.energy }
        }));
        this.hurtingAnimation.currentImageIndex = 0;
    }
}