import CanvasObject from './canvas-object.class.js';

export default class Cloud extends CanvasObject {
    constructor(srcPath, x = 0, y = 0, width = canvas.width, height = canvas.height) {
        super(x, y, width, height);
        this.loadImage(srcPath);
        this.speed = 0.5;
    }

    update() {
        this.moveLeft();
    }

    moveLeft() {
        this.x -= this.speed;
    }
}