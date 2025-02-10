import CanvasObject from './canvas-object.class.js';

export default class BackgroundObject extends CanvasObject {
    constructor(srcPath, x = 0, y = 0, width = canvas.width, height = canvas.height) {
        super(x, y, width, height);
        this.loadImage(srcPath);
    }

    shiftLeft(x) {
        this.x -= x;
    }

    shiftRight(x) {
        this.x += x;
    }
}