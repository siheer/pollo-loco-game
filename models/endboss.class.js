import GameItem from './game-item.class.js';

export default class Endboss extends GameItem {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.offset = { left: 80, top: 120, right: 60, bottom: 50 };
        this.speed = 3;
        this.loadImage('./img/4_enemie_boss_chicken/1_walk/G4.png');
        this.provideAnimations()
    }

    provideAnimations() {
        this.walkingAnimation = this.createAnimation([
            './img/4_enemie_boss_chicken/1_walk/G1.png',
            './img/4_enemie_boss_chicken/1_walk/G2.png',
            './img/4_enemie_boss_chicken/1_walk/G3.png',
            './img/4_enemie_boss_chicken/1_walk/G4.png'
        ]);
    }

    update(deltaTime) {
        this.updateAnimation(this.walkingAnimation, deltaTime);
        this.moveLeft();
    }
}