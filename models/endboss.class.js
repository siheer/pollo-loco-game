import GameItem from './game-item.class.js';
import ActionTimer from './action-timer.class.js';

export default class Endboss extends GameItem {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.offset = { left: 80, top: 120, right: 60, bottom: 50 };
        this.speedX = 3;
        this.energy = this.maxEnergy = 100;
        this.takesDamageAmount = 10;
        this.hurtingDuration = 500;
        this.loadImage('./img/4_enemie_boss_chicken/1_walk/G4.png');
        this.allLoaded = false;
        setTimeout(() => {
            this.provideAnimations();
            this.initializeActionTimer();
            this.allLoaded = true;
        }, 2000);
    }

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

    initializeActionTimer() {
        this.hurtingActionTimer = new ActionTimer(
            () => this.isHurt,
            deltaTime => this.updateAnimation(this.hurtingAnimation, deltaTime, 150),
            500,
            0,
            () => this.isHurt = false
        )
        this.alertedActionTimer = new ActionTimer(
            () => this.isEnemyClose() && !this.isAnimationAfterLastFrame(this.alertedAnimation),
            deltaTime => this.updateAnimation(this.alertedAnimation, deltaTime),
            2000,
            3000,
            () => this.alertedAnimation.currentImageIndex = 0
        );
        this.attackActionTimer = new ActionTimer(
            () => this.isEnemyVeryClose(),
            deltaTime => {
                this.updateAnimation(this.attackingAnimation, deltaTime);
                if (this.attackingAnimation.currentImageIndex === 5) {
                    this.moveLeft(40);
                }
            },
            2000,
            1000
        );
    }

    isEnemyClose() {
        return Math.abs(window.world.level.character.x - this.x) < 1300;
    }

    isEnemyVeryClose() {
        return Math.abs(window.world.level.character.x - this.x) < 500;
    }

    update(deltaTime) {
        if (!this.allLoaded) return;
        if (this.isDead) {
            this.handleDead(deltaTime);
        } else if (this.hurtingActionTimer.isPlayable()) {
            this.hurtingActionTimer.play(deltaTime);
        } else if (this.alertedActionTimer.isPlayable() && !this.isEnemyVeryClose()) {
            this.alertedActionTimer.play(deltaTime);
        } else if (this.attackActionTimer.isPlayable()) {
            this.attackActionTimer.play(deltaTime);
        } else {
            this.checkIfGameOver();
            this.handleWalking(deltaTime);
        }
    }

    handleDead(deltaTime) {
        this.updateAnimation(this.dyingAnimation, deltaTime);
        if (this.isAnimationAfterLastFrame(this.dyingAnimation)) {
            window.game.gameOver.isOver = true;
            window.game.gameOver.playerHasWon = true;
        }
    }

    handleWalking(deltaTime) {
        this.updateAnimation(this.walkingAnimation, deltaTime);
        this.moveLeft();
    }

    takeDamage(deltaTime, updateInterval = 0, damage = this.takesDamageAmount) {
        super.takeDamage(deltaTime, updateInterval, damage);
        document.dispatchEvent(new CustomEvent('endbossEnergyEvent', {
            detail: { max: this.maxEnergy, current: this.energy }
        }));
        this.hurtingAnimation.currentImageIndex = 0;
    }

    checkIfGameOver() {
        if (this.x < 0) {
            window.game.gameOver.isOver = true;
            window.game.gameOver.playerHasWon = false;
        }
    }
}