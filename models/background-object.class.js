import CanvasObject from './canvas-object.class.js';
/** 
 * Represents a background object displayed on canvas. Extends CanvasObject.
 */
export default class BackgroundObject extends CanvasObject {
    /**
     * Creates a BackgroundObject instance and loads the image from the provided source path.
     * @param {Canvas} canvas - The canvas instance in which the background exists.
     * @param {string} srcPath - The source path of the background image.
     * @param {number} [x=0] - The x-coordinate position.
     * @param {number} [y=0] - The y-coordinate position.
     * @param {number} [width=canvas.width] 1- The width of the object.
     * @param {number} [height=canvas.height] - The height of the object.
     */
    constructor(canvas, srcPath, x = 0, y = 0, width = canvas.width, height = canvas.height) {
        super(x, y, width, height);
        this.loadImage(srcPath);
    }

    /**
     * Shifts the background object to the left by subtracting the given value from its x-coordinate.
     * @param {number} x - The number of pixels to shift left.
     */
    shiftLeft(x) {
        this.x -= x;
    }

    /**
     * Shifts the background object to the right by adding the given value to its x-coordinate.
     * @param {number} x - The number of pixels to shift right.
     */
    shiftRight(x) {
        this.x += x;
    }
}