import GameItem from "./game-item.class.js";

export default class Bottle extends GameItem {
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

    update(deltaTime) {
        if (this.isThrowable) {
            if (this.isBroken) {
                this.handleSplash(deltaTime);
            } else if (window.world.isAboveGround(this)) {
                this.updateAnimation(this.thrownAnimation, deltaTime, 40);
                this.moveX();
                this.applyGravity(deltaTime, MIN_INTERVAL_IN_MILLISECONDS);
            } else {
                this.setBottleOnGround();
            }
        }
    }

    handleSplash(deltaTime) {
        this.updateAnimation(this.splashingAnimation, deltaTime, 50);
        if (this.isAnimationAfterLastFrame(this.splashingAnimation)) {
            callAfterCurrentGameLoop(() => window.world.removeBottle(this));
        }
    }

    moveX() {
        if (this.flyingToLeft) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    setBottleOnGround() {
        window.world.removeBottle(this);
        callAfterCurrentGameLoop(() => {
            window.world.level.levelItems.push(new Bottle(this.x, window.world.groundLevelY - this.height + 10, 120, 120, false, false, false));
        });
    }

    breakBottle() {
        callAfterCurrentGameLoop(() => { this.isBroken = true });
    }
}