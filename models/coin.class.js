import GameItem from "./game-item.class.js";

export default class Coin extends GameItem {
    constructor(segmentIndex, y, width, height) {
        const randomX = window.world.level.getRandomXInSegment(segmentIndex);
        const randomY = y -= Coin.getRandomY();
        super(randomX, randomY, width, height);
        this.offset = { left: 65, top: 65, right: 65, bottom: 65 };
        this.loadImage('./img/8_coin/coin_2.png');
    }

    static getRandomY() {
        return Math.random() * (window.world.canvas.height / 2);
    }
}