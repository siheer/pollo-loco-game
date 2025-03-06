import GameItem from "./game-item.class.js";

/**
 * Represents a coin object in the game.
 * Extends GameItem.
 */
export default class Coin extends GameItem {
    /**
     * Creates a new Coin instance with a random x-coordinate in the segment and a random vertical shift.
     * @param {number} segmentIndex - The segment index used to determine the x-coordinate.
     * @param {number} y - The base y-coordinate for the coin.
     * @param {number} width - The width of the coin.
     * @param {number} height - The height of the coin.
     */
    constructor(segmentIndex, y, width, height) {
        const randomX = window.world.level.getRandomXInSegment(segmentIndex);
        const randomY = y -= Coin.getRandomY();
        super(randomX, randomY, width, height);
        this.offset = { left: 65, top: 65, right: 65, bottom: 65 };
        this.loadImage('./img/8_coin/coin_2.png');
    }

    /**
     * Generates a random y-offset for coin placement.
     * @returns {number} A random number representing the vertical offset.
     */
    static getRandomY() {
        return Math.random() * (window.world.canvas.height / 2.5);
    }
}