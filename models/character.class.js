import GameItem from "./game-item.class.js";
import Bottle from "./bottle.class.js";
import ActionTimer from "./action-timer.class.js";

/**
 * Represents the main character in the game.
 * Extends GameItem.
 */
export default class Character extends GameItem {
    /**
     * Creates a new Character instance.
     * @param {number} x - The starting x-coordinate.
     * @param {number} y - The starting y-coordinate.
     * @param {number} width - The width of the character.
     * @param {number} height - The height of the character.
     * @param {Level} level - The current level instance.
     */
    constructor(x, y, width, height, level) {
        super(x, y, width, height);
        this.level = level;
        this.fixCameraOnCharacter = false;
        this.fixCameraOnCharacterXPosition = 500;
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.idleImg = this.img;
        this.speedX = 30;
        this.initialSpeedY = -50;
        this.isFacingOtherDirection = false;
        this.offset = { left: 60, top: 200, right: 70, bottom: 30 };
        this.provideAnimations();
        this.energy = this.maxEnergy = 200;
        this.takesDamageAmount = 5;
        this.hurtingAction = new ActionTimer(
            () => this.isHurt,
            deltaTime => this.updateAnimation(this.hurtingAnimation, deltaTime, 20),
            300,
            0,
            () => this.isHurt = false
        );
        this.healingAction = new ActionTimer(
            () => true,
            () => this.heal(2),
            0,
            1000
        );
        this.bottleSupply = 5;
        this.maxBottleSupply = 10;
        this.coinSupply = 50;
        this.maxCoinSupply = 100;
        this.bottlePurchaseCost = 10;
    }

    /**
     * Sets up the walking, jumping, hurting, and dying animations for the character.
     */
    provideAnimations() {
        this.walkingAnimation = this.createAnimation([
            './img/2_character_pepe/2_walk/W-21.png',
            './img/2_character_pepe/2_walk/W-22.png',
            './img/2_character_pepe/2_walk/W-23.png',
            './img/2_character_pepe/2_walk/W-24.png',
            './img/2_character_pepe/2_walk/W-25.png',
            './img/2_character_pepe/2_walk/W-26.png',
        ]);
        this.jumpingAnimation = this.createAnimation([
            './img/2_character_pepe/3_jump/J-31.png',
            './img/2_character_pepe/3_jump/J-32.png',
            './img/2_character_pepe/3_jump/J-33.png',
            './img/2_character_pepe/3_jump/J-34.png',
            './img/2_character_pepe/3_jump/J-35.png',
            './img/2_character_pepe/3_jump/J-36.png',
            './img/2_character_pepe/3_jump/J-37.png',
            './img/2_character_pepe/3_jump/J-38.png',
            './img/2_character_pepe/3_jump/J-39.png',
        ]);
        this.hurtingAnimation = this.createAnimation([
            './img/2_character_pepe/4_hurt/H-41.png',
            './img/2_character_pepe/4_hurt/H-42.png',
            './img/2_character_pepe/4_hurt/H-43.png',
        ]);
        this.dyingAnimation = this.createAnimation([
            './img/2_character_pepe/5_dead/D-51.png',
            './img/2_character_pepe/5_dead/D-52.png',
            './img/2_character_pepe/5_dead/D-53.png',
            './img/2_character_pepe/5_dead/D-54.png',
            './img/2_character_pepe/5_dead/D-55.png',
            './img/2_character_pepe/5_dead/D-56.png',
            './img/2_character_pepe/5_dead/D-57.png',
        ]);
    }

    /**
     * Updates the character state each frame.
     * Handles death, healing, camera fixing, jumping, horizontal movement, idle state, and hurt animation.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    update(deltaTime) {
        if (this.isDead) {
            this.handleDead(deltaTime);
        } else {
            if (this.healingAction.updateAndIsExecutable(deltaTime)) this.healingAction.execute();
            this.isCameraToBeFixed();
            this.handleJump(deltaTime);
            this.handleHorizontalMovement(deltaTime);
            if (this.isIdle()) this.img = this.idleImg;
            if (this.hurtingAction.updateAndIsExecutable(deltaTime)) this.hurtingAction.execute(deltaTime);
        }
    }

    /**
     * Handles the character's death by updating the dying animation and triggering game over.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    handleDead(deltaTime) {
        window.soundManager.stopSoundImmediatelyByKey('walking');
        window.soundManager.stopSoundImmediatelyByKey('characterHurt');
        this.updateAnimation(this.dyingAnimation, deltaTime, 150);
        if (this.dyingAnimation.currentImageIndex === this.dyingAnimation.imageCache.length) {
            window.game.gameOver.isOver = true;
        }
    }

    /**
     * Checks and fixes the camera on the character if the x-coordinate exceeds a threshold.
     * @returns {boolean} True if camera is set to be fixed.
     */
    isCameraToBeFixed() {
        if (!this.fixCameraOnCharacter && this.x > this.fixCameraOnCharacterXPosition) {
            this.fixCameraOnCharacter = true;
        }
    }

    /**
     * Handles horizontal movement based on arrow key input and plays walking sound.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    handleHorizontalMovement(deltaTime) {
        if ((keyboardEvents.keys['ArrowRight'] || keyboardEvents.keys['ArrowLeft']) && !this.justJumped) {
            window.soundManager.playWalkingSound();
        } else {
            window.soundManager.stopSoundImmediatelyByKey("walking");
        }
        if (keyboardEvents.keys['ArrowRight'] && this.x < this.level.levelEndX) {
            this.onRight(deltaTime);
        } else if (keyboardEvents.keys['ArrowLeft'] && this.x > 0) {
            this.onLeft(deltaTime);
        }
    }

    /**
     * Determines if the character is idle (no movement keys pressed and not jumping).
     * @returns {boolean} True if idle.
     */
    isIdle() {
        return !this.justJumped && keyboardEvents.nokeyPressed();
    }

    /**
     * Handles movement to the right, updates walking animation and camera position.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    onRight(deltaTime) {
        this.isFacingOtherDirection = false;
        if (!this.justJumped) {
            this.updateAnimation(this.walkingAnimation, deltaTime, 60);
        }
        this.moveRight();
        this.setCameraXPosition();
    }

    /**
     * Handles movement to the left, updates walking animation and camera position.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    onLeft(deltaTime) {
        this.isFacingOtherDirection = true;
        if (!this.justJumped) {
            this.updateAnimation(this.walkingAnimation, deltaTime, 60);
        }
        this.moveLeft();
        this.setCameraXPosition();
    }

    /**
     * Sets the camera's X position based on the character's fixed position.
     */
    setCameraXPosition() {
        if (this.fixCameraOnCharacter) {
            window.world.cameraX = this.fixCameraOnCharacterXPosition - this.x;
        }
    }

    /**
     * Manages the jump input and state.
     * Applies gravity, updates jump state, and plays jump sound when initiating jump.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    handleJump(deltaTime) {
        const onGround = !this.level.isAboveGround(this);
        if (keyboardEvents.keys[' '] && onGround) {
            window.soundManager.play('jump');
            this.speedY = this.initialSpeedY;
            this.justJumped = true;
            this.applyGravity(deltaTime, 0);
        } else if (!onGround) {
            this.justJumped = true;
            this.onJump(deltaTime);
        } else {
            this.justJumped = false;
            this.speedY = 0;
            this.jumpingAnimation.currentImageIndex = 0;
        }
    }

    /**
     * Handles the jump state by updating the jump animation, applying gravity, and setting the character on the ground if necessary.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    onJump(deltaTime) {
        this.updateAnimation(this.jumpingAnimation, deltaTime);
        this.applyGravity(deltaTime);
        this.setItemOnGroundIfUnderGround(18);
    }

    /**
     * Determines if the character is stomping an enemy.
     * @param {*} enemy - The enemy object to check against.
     * @returns {boolean} True if stomping based on vertical speed.
     */
    isStomping(enemy) {
        if (enemy.constructor.name === 'Chicken' || enemy.constructor.name === 'Chick') {
            return this.speedY > 0;
        }
        return false;
    }

    /**
     * Applies a recoil effect to the character after stomping an enemy.
     * @param {number} recoil - The recoil speed to apply.
     */
    giveRecoilOnStomp(recoil) {
        this.speedY = -recoil;
        this.applyGravity(1, 0); // always make character jump on kill, even if notAboveGround
    }

    /**
     * Inflicts damage to the character and dispatches an energy update event.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     * @param {number} [updateInterval=STANDARD_INTERVAL_IN_MILLISECONDS] - The update interval for taking damage.
     * @param {number} [damage=this.takesDamageAmount] - The damage amount.
     */
    takeDamage(deltaTime, updateInterval = STANDARD_INTERVAL_IN_MILLISECONDS, damage = this.takesDamageAmount) {
        if (!this.isDead) window.soundManager.playNonOverlapping('characterHurt');
        super.takeDamage(deltaTime, updateInterval, damage);
        this.dispatchCharacterEnergyEvent();
    }

    /**
     * Throws a bottle from the character's current position.
     * Decreases bottle supply and dispatches a bottle event.
     */
    throwBottle() {
        window.soundManager.play('throw');
        const x = this.isFacingOtherDirection ? this.x : this.x + this.width - this.offset.right;
        this.level.levelItems.push(new Bottle(x, this.y + this.offset.top, 120, 120, this.isFacingOtherDirection, true));
        this.bottleSupply--;
        this.dispatchBottleEvent();
    }

    /**
     * Collects a bottle if below maximum supply and dispatches a bottle event.
     * @param {*} bottle - The bottle object to collect.
     */
    collectBottle(bottle) {
        if (this.bottleSupply < this.maxBottleSupply) {
            window.soundManager.play('bottleCollected');
            this.bottleSupply++;
            this.dispatchBottleEvent();
            this.level.removeBottle(bottle);
        }
    }

    /**
     * Collects a coin if below maximum supply and dispatches a coin event.
     * @param {*} coin - The coin object to collect.
     */
    collectCoin(coin) {
        if (this.coinSupply < this.maxCoinSupply) {
            window.soundManager.play('coinCollected');
            this.coinSupply++;
            this.dispatchCoinEvent();
            this.level.removeCoin(coin);
        }
    }

    /**
     * Determines if the character can purchase a bottle.
     * @returns {boolean} True if the character has enough coins and bottle supply is below maximum.
     */
    canBuyBottle() {
        return this.coinSupply >= this.bottlePurchaseCost && this.bottleSupply < this.maxBottleSupply;
    }

    /**
     * Buys a bottle by reducing coin supply, increasing bottle supply, and dispatching events.
     */
    buyBottle() {
        if (this.canBuyBottle()) {
            window.soundManager.play('buyBottle');
            this.coinSupply -= this.bottlePurchaseCost;
            this.bottleSupply++;
            this.dispatchBottleEvent();
            this.dispatchCoinEvent();
        }
    }

    /**
     * Increases the character's energy by a specified amount, not exceeding maximum energy.
     * @param {number} energy - The energy amount to add.
     */
    heal(energy) {
        if (this.energy + energy <= this.maxEnergy) {
            this.energy += energy;
            this.dispatchCharacterEnergyEvent();
        }
    }

    /**
     * Dispatches a custom event to update the bottle status.
     */
    dispatchBottleEvent() {
        document.dispatchEvent(new CustomEvent('bottleEvent', {
            detail: { max: this.maxBottleSupply, current: this.bottleSupply }
        }));
    }

    /**
     * Dispatches a custom event to update the coin status.
     */
    dispatchCoinEvent() {
        document.dispatchEvent(new CustomEvent('coinEvent', {
            detail: { max: this.maxCoinSupply, current: this.coinSupply }
        }));
    }

    /**
     * Dispatches a custom event to update the character's energy status.
     */
    dispatchCharacterEnergyEvent() {
        document.dispatchEvent(new CustomEvent('characterEnergyEvent', {
            detail: { max: this.maxEnergy, current: this.energy }
        }));
    }
}