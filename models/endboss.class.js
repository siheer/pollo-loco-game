import GameItem from './game-item.class.js';

export default class Endboss extends GameItem {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.offset = { left: 80, top: 120, right: 60, bottom: 50 };
        this.speedX = 3;
        this.energy = this.maxEnergy = 100;
        this.hurtingDuration = 500;
        this.loadImage('./img/4_enemie_boss_chicken/1_walk/G4.png');
        this.provideAnimations()
    }

    provideAnimations() {
        this.walkingAnimation = this.createAnimation([
            './img/4_enemie_boss_chicken/1_walk/G1.png',
            './img/4_enemie_boss_chicken/1_walk/G2.png',
            './img/4_enemie_boss_chicken/1_walk/G3.png',
            './img/4_enemie_boss_chicken/1_walk/G4.png',
        ]);

        this.hurtingAnimation = this.createAnimation([
            './img/4_enemie_boss_chicken/4_hurt/G21.png',
            './img/4_enemie_boss_chicken/4_hurt/G22.png',
            './img/4_enemie_boss_chicken/4_hurt/G23.png',
        ])

        this.dyingAnimation = this.createAnimation([
            './img/4_enemie_boss_chicken/5_dead/G24.png',
            './img/4_enemie_boss_chicken/5_dead/G25.png',
            './img/4_enemie_boss_chicken/5_dead/G26.png',
        ])
    }

    update(deltaTime) {
        if (this.isDead) {
            this.updateAnimation(this.dyingAnimation, deltaTime, 200);
            if (this.isAnimationAfterLastFrame(this.dyingAnimation)) {
                window.game.gameOver = true;
            }
        } else if (this.isHurt()) {
            this.updateAnimation(this.hurtingAnimation, deltaTime, 150);
        } else {
            this.updateAnimation(this.walkingAnimation, deltaTime);
            this.moveLeft();
        }
    }

    takeDamage(deltaTime, updateInterval = 0, damage = 20) {
        super.takeDamage(deltaTime, updateInterval, damage);
        document.dispatchEvent(new CustomEvent('endbossEnergyEvent', {
            detail: { max: this.maxEnergy, current: this.energy }
        }));
        this.hurtingAnimation.currentImageIndex = 0;
    }
}