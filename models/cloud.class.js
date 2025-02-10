import GameItem from './game-item.class.js';

export default class Cloud extends GameItem {
    constructor(srcPath, x = 0, y = 0, width = canvas.width, height = canvas.height) {
        super(x, y, width, height);
        this.loadImage(srcPath);
        this.speed = 0.5;
    }

    update() {
        this.moveLeft();
    }
}