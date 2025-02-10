import GameItem from "./game-item.class.js";

export default class Chicken extends GameItem {
    constructor(y, width, height) {
        super(0, y, width, height);
        this.x = this.getRandomChickenPosition();
        this.speed = 1.5 + Math.random() * 3;
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        this.walkingAnimation = this.createAnimation([
            './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
        ]);
    }

    getRandomChickenPosition() {
        return 200 + Math.random() * (canvas.width - 200);
    }

    update(deltaTime) {
        this.updateAnimation(this.walkingAnimation, deltaTime);
        this.moveLeft();
    }
}  