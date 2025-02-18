import GameItem from "./game-item.class.js";

export default class Bottle extends GameItem {
    constructor(x, y, width, height, horizontalSpeed) {
        super(x, y, width, height);
        this.speedX = horizontalSpeed;
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.collisionBoxOffsets = { left: 5, top: 5, right: 5, bottom: 5 };
        this.damage = 20;
    }

    update(deltaTime) {
        this.x += this.speedX;
        // Remove bottle if it goes off screen (arbitrary bounds)
        if (this.x < -this.width || this.x > 3000) {
            this.isRemoved = true;
        }
    }
}
