import GameItem from "./game-item.class.js";
import Bottle from "./bottle.class.js";
import ActionTimer from "./action-timer.class.js";

export default class Character extends GameItem {
    constructor(x, y, width, height, level) {
        super(x, y, width, height);
        this.level = level;
        this.fixCameraOnCharacter = false;
        this.fixCameraOnCharacterXPosition = 500;
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.idleImg = this.img;
        this.speedX = 40;
        this.initialSpeedY = -50;
        this.isFacingOtherDirection = false;
        this.offset = { left: 60, top: 200, right: 70, bottom: 30 };
        this.provideAnimations();
        this.energy = this.maxEnergy = 200;
        this.takesDamageAmount = 4;
        this.hurtingAction = new ActionTimer(
            () => this.isHurt,
            deltaTime => this.updateAnimation(this.hurtingAnimation, deltaTime, 20),
            300,
            0,
            () => this.isHurt = false
        )
        this.healingAction = new ActionTimer(
            () => true,
            () => this.heal(2),
            0,
            1000
        )
        this.bottleSupply = 5;
        this.maxBottleSupply = 10;
        this.coinSupply = 50;
        this.maxCoinSupply = 100;
        this.bottlePurchaseCost = 10;
    }

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
        ])

        this.dyingAnimation = this.createAnimation([
            './img/2_character_pepe/5_dead/D-51.png',
            './img/2_character_pepe/5_dead/D-52.png',
            './img/2_character_pepe/5_dead/D-53.png',
            './img/2_character_pepe/5_dead/D-54.png',
            './img/2_character_pepe/5_dead/D-55.png',
            './img/2_character_pepe/5_dead/D-56.png',
            './img/2_character_pepe/5_dead/D-57.png',
        ])
    }

    /**
     * Main update method called on every frame.
     * It updates the camera, handles jump and horizontal movement,
     * and reverts to the idle state if no movement is triggered.
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
     * Fix the camera on the character when the x-position exceeds a threshold.
     */
    isCameraToBeFixed() {
        if (!this.fixCameraOnCharacter && this.x > this.fixCameraOnCharacterXPosition) {
            this.fixCameraOnCharacter = true;
        }
    }

    /**
     * Handle horizontal movement based on left/right arrow key input.
     */
    handleHorizontalMovement(deltaTime) {
        if (keyboardEvents.keys['ArrowRight'] && this.x < this.level.levelEndX) {
            this.onRight(deltaTime);
        } else if (keyboardEvents.keys['ArrowLeft'] && this.x > 0) {
            this.onLeft(deltaTime);
        }
    }

    isIdle() {
        return !this.justJumped && keyboardEvents.nokeyPressed();
    }

    /**
     * Handle movement to the right.
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
     * Handle movement to the left.
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
     * Adjust the world camera based on the character's x-position.
     */
    setCameraXPosition() {
        if (this.fixCameraOnCharacter) {
            window.world.cameraX = this.fixCameraOnCharacterXPosition - this.x;
        }
    }

    /**
     * Handle jump logic:
     * - If the jump key is pressed while on the ground, initiate a jump.
     * - If in the air, always update the jump animation and apply gravity.
     */
    handleJump(deltaTime) {
        const onGround = !this.level.isAboveGround(this);
        if (keyboardEvents.keys[' '] && onGround) {
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
     * Update jump animation and apply gravity.
     */
    onJump(deltaTime) {
        this.updateAnimation(this.jumpingAnimation, deltaTime);
        this.applyGravity(deltaTime);
        this.setItemOnGroundIfUnderGround(18);
    }

    handleDead(deltaTime) {
        this.updateAnimation(this.dyingAnimation, deltaTime, 150);
        if (this.dyingAnimation.currentImageIndex === this.dyingAnimation.imageCache.length) {
            window.game.gameOver.isOver = true;
        }
    }

    isStomping(enemy) {
        if (enemy.constructor.name === 'Chicken' || enemy.constructor.name === 'Chick') {
            return this.speedY > 0;
        }
        return false;
    }

    giveRecoilOnStomp(recoil) {
        this.speedY = -recoil;
        this.applyGravity(1, 0); // always make character jump on kill, even if notAboveGround
    }

    takeDamage(deltaTime, updateInterval = STANDARD_INTERVAL_IN_MILLISECONDS, damage = this.takesDamageAmount) {
        super.takeDamage(deltaTime, updateInterval, damage);
        this.dispatchCharacterEnergyEvent();
    }

    throwBottle() {
        const x = this.isFacingOtherDirection ? this.x : this.x + this.width - this.offset.right;
        this.level.levelItems.push(new Bottle(x, this.y + this.offset.top, 120, 120, this.isFacingOtherDirection, true));
        this.bottleSupply--;
        this.dispatchBottleEvent();
    }

    collectBottle(bottle) {
        if (this.bottleSupply < this.maxBottleSupply) {
            this.bottleSupply++;
            this.dispatchBottleEvent();
            this.level.removeBottle(bottle);
        }
    }

    collectCoin(coin) {
        if (this.coinSupply < this.maxCoinSupply) {
            this.coinSupply++;
            this.dispatchCoinEvent();
            this.level.removeCoin(coin);
        }
    }

    canBuyBottle() {
        return this.coinSupply >= this.bottlePurchaseCost && this.bottleSupply < this.maxBottleSupply;
    }

    buyBottle() {
        if (this.canBuyBottle()) {
            this.coinSupply -= this.bottlePurchaseCost;
            this.bottleSupply++;
            this.dispatchBottleEvent();
            this.dispatchCoinEvent();
        }
    }

    heal(energy) {
        if (this.energy + energy <= this.maxEnergy) {
            this.energy += energy;
            this.dispatchCharacterEnergyEvent();
        }
    }

    dispatchBottleEvent() {
        document.dispatchEvent(new CustomEvent('bottleEvent', {
            detail: { max: this.maxBottleSupply, current: this.bottleSupply }
        }));
    }

    dispatchCoinEvent() {
        document.dispatchEvent(new CustomEvent('coinEvent', {
            detail: { max: this.maxCoinSupply, current: this.coinSupply }
        }));
    }

    dispatchCharacterEnergyEvent() {
        document.dispatchEvent(new CustomEvent('characterEnergyEvent', {
            detail: { max: this.maxEnergy, current: this.energy }
        }));
    }
}