import GameItem from "./game-item.class.js";

export default class Chicken extends GameItem {
    constructor(segmentIndex, y, width, height) {
        const x = window.world.level.getRandomXInSegment(segmentIndex);
        super(x, y, width, height);
        this.speed = 1.5 + Math.random() * 3;
        this.offset = { left: 10, top: 10, right: 10, bottom: 20 };
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.provideAnimations();
    }

    provideAnimations() {
        this.walkingAnimation = this.createAnimation([
            './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
        ]);
    }

    update(deltaTime) {
        this.updateAnimation(this.walkingAnimation, deltaTime);
        this.moveLeft();
    }
}