import Bottle from './bottle.class.js';

export default class StandingBottle extends Bottle {
    constructor(segmentX, y, width, height) {
        const x = window.world.level.getRandomXInSegment(segmentX);
        super(x, y, width, height, false, false, false);
        this.setImage();
    }

    setImage() {
        const random = Math.random() * 3;
        if (random < 1) {
            this.loadImage('./img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        } else if (random < 2) {
            this.loadImage('./img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        }
    }
}   