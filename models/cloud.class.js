import CanvasObject from './canvas-object.class.js';

export default class Cloud extends CanvasObject {
    constructor(srcPath, segmentIndex = 0, y = 0, width = canvas.width, height = canvas.height) {
        const x = window.world.level.getRandomXInSegment(segmentIndex);
        super(x, y, width, height);
        this.loadImage(srcPath);
        this.speedX = 0.5;
    }

    update() {
        this.moveLeft();
    }

    moveLeft() {
        this.x -= this.speedX;
    }
}