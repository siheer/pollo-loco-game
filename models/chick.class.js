import GameItem from "./game-item.class.js";

export default class Chick extends GameItem {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    moveUp(y) {
        this.y -= y;
    }

    moveDown(y) {
        this.y += y;
    }

    jump(y) {
    }
}