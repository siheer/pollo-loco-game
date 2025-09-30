import WorldImagePreloader from "./world-image-preloader.class.js";

/**
 * Represents an object to be drawn on a canvas.
 */
export default class CanvasObject {
    /**
     * Creates a new CanvasObject instance.
     * @param {number} x - The x-coordinate; also assigned to initialX.
     * @param {number} y - The y-coordinate; also assigned to initialY.
     * @param {number} width - The width of the object.
     * @param {number} height - The height of the object.
     */
    constructor(x, y, width, height) {
        this.x = this.initialX = x;
        this.y = this.initialY = y;
        this.width = width;
        this.height = height;
        this.img = null;
    }

    /**
     * Loads an image from the specified source path and assigns it to the img property.
     * @param {string} src - The source path of the image.
     */
    loadImage(src) {
        this.img = new Image();
        this.img.src = src;
        WorldImagePreloader.add(this.img.decode());
    }

    /**
     * Creates and returns a new HTMLImageElement.
     * @param {string} src - The source path of the image.
     * @returns {HTMLImageElement} The created image element.
     */
    createImage(src) {
        const img = new Image();
        img.src = src;
        WorldImagePreloader.add(img.decode());
        return img;
    }
}