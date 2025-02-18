import GameItem from "./game-item.class.js";

export default class Coin extends GameItem {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.loadImage('img/8_coin/coin_1.png');
        this.collisionBoxOffsets = { left: 5, top: 5, right: 5, bottom: 5 };
        this.coinAnimation = this.createAnimation([
            'img/8_coin/coin_1.png',
            'img/8_coin/coin_2.png'
        ]);
    }

    update(deltaTime) {
        this.updateAnimation(this.coinAnimation, deltaTime, 200);
    }
}