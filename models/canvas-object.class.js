export default class CanvasObject {
    constructor(x, y, width, height) {
        this.x = this.initialX = x;
        this.y = this.initialY = y;
        this.width = width;
        this.height = height;
        this.img = null;
    }

    loadImage(src) {
        this.img = new Image();
        this.img.src = src;
    }
}