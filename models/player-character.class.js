import GameItem from "./game-item.class.js";

export default class PlayerCharacter extends GameItem {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.speed = 20;
        this.walkingAnimation = this.createAnimation([
            './img/2_character_pepe/2_walk/W-21.png',
            './img/2_character_pepe/2_walk/W-22.png',
            './img/2_character_pepe/2_walk/W-23.png',
            './img/2_character_pepe/2_walk/W-24.png',
            './img/2_character_pepe/2_walk/W-25.png',
            './img/2_character_pepe/2_walk/W-26.png',
        ]);
    }

    update(deltaTime) {
        if (keyboardEvents.keys['ArrowRight']) {
            this.updateAnimation(this.walkingAnimation, deltaTime, 60);
            this.moveRight();
        } else if (keyboardEvents.keys['ArrowLeft']) {
            this.updateAnimation(this.walkingAnimation, deltaTime, 60);
            this.moveLeft();
        }
    }

    moveUp(y) {
        this.y -= y;
    }

    moveDown(y) {
        this.y += y;
    }

    jump(y) {
        // Jump implementation (if needed) goes here.
    }
}