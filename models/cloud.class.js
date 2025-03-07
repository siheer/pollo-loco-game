import CanvasObject from './canvas-object.class.js';

/**
 * Represents a cloud object in the game.
 * Extends CanvasObject.
 */
export default class Cloud extends CanvasObject {
    /**
     * Creates a new Cloud instance positioned at a random x-coordinate in the given segment.
     * Loads the image from the provided source and sets a horizontal speed.
     * @param {Level} level - The level instance in which the cloud exists.
     * @param {string} srcPath - The source path of the cloud image.
     * @param {number} [segmentIndex=0] - The segment index used for horizontal placement.
     * @param {number} [y=0] - The y-coordinate.
     * @param {number} [width=level.canvas.width] - The width of the cloud.
     * @param {number} [height=level.canvas.height] - The height of the cloud.
     */
    constructor(level, srcPath, segmentIndex = 0, y = 0, width = level.canvas.width, height = level.canvas.height) {
        const x = level.getRandomXInSegment(segmentIndex);
        super(x, y, width, height);
        this.loadImage(srcPath);
        this.speedX = 0.5;
    }

    /**
     * Updates the cloud's state by moving it to the left.
     */
    update() {
        this.moveLeft();
    }

    /**
     * Moves the cloud to the left by subtracting its speed from its x-coordinate.
     */
    moveLeft() {
        this.x -= this.speedX;
    }
}