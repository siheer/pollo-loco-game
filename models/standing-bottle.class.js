import Bottle from './bottle.class.js';

/**
 * Represents a static bottle positioned on the ground.
 * Extends Bottle.
 */
export default class StandingBottle extends Bottle {
    /**
     * Creates a new StandingBottle instance positioned at a random x-coordinate in the given segment.
     * @param {Level} level - The level instance in which the bottle exists.
     * @param {number} segmentX - The segment index for horizontal placement.
     * @param {number} y - The y-coordinate.
     * @param {number} width - The width of the bottle.
     * @param {number} height - The height of the bottle.
     */
    constructor(level, segmentX, y, width, height) {
        const x = level.getRandomXInSegment(segmentX);
        super(x, y, width, height, false, false, false);
        this.setImage();
    }

    /**
     * Randomly selects and loads one of the available bottle images for a bottle on the ground.
     */
    setImage() {
        const random = Math.random() * 3;
        if (random < 1) {
            this.loadImage('./img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
        } else if (random < 2) {
            this.loadImage('./img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        }
    }
}