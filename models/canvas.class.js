export default class Canvas {
    /**
     * Creates a new Canvas instance.
     * @param {HTMLCanvasElement} canvasElement - The HTML canvas element.
     * @param {number} [baseWidth=1920] - The base width for the canvas.
     * @param {number} [canvasAspectRatio=16/9] - The aspect ratio of the canvas.
     * @throws {Error} If the provided element is not an HTMLCanvasElement.
     */
    constructor(canvasElement, baseWidth = 1920, canvasAspectRatio = 16 / 9) {
        if (!(canvasElement instanceof HTMLCanvasElement))
            throw new Error('Provided element is not a valid HTMLCanvasElement.');
        this.canvasElement = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.baseWidth = baseWidth;
        this.baseHeight = this.baseWidth / canvasAspectRatio;
        this.width = this.baseWidth;
        this.height = this.baseHeight;
    }

    /**
     * Gets the width of the canvas element.
     * @returns {number}
     */
    get width() {
        return this.canvasElement.width;
    }

    /**
     * Sets the width of the canvas element.
     * @param {number} value - The new width.
     * @throws {TypeError} If value is not a number.
     */
    set width(value) {
        if (typeof value !== 'number')
            throw new TypeError('Width must be a number.');
        value = value < 0 ? (console.warn(`Canvas drawing width received a negative value (${value}). Using absolute value instead.`), Math.abs(value)) : value;
        this.canvasElement.width = value;
    }

    /**
     * Gets the height of the canvas element.
     * @returns {number}
     */
    get height() {
        return this.canvasElement.height;
    }

    /**
     * Sets the height of the canvas element.
     * @param {number} value - The new height.
     * @throws {TypeError} If value is not a number.
     */
    set height(value) {
        if (typeof value !== 'number')
            throw new TypeError('Height must be a number.');
        value = value < 0 ? (console.warn(`Canvas drawing height received a negative value (${value}). Using absolute value instead.`), Math.abs(value)) : value;
        this.canvasElement.height = value;
    }

    /**
     * Gets the CSS style width of the canvas element.
     * @returns {string}
     */
    get styleWidth() {
        return this.canvasElement.style.width;
    }

    /**
     * Gets the client width of the canvas element.
     * @returns {number}
     */
    get clientWidth() {
        return this.canvasElement.clientWidth;
    }

    /**
     * Sets the CSS style width of the canvas element.
     * @param {number|string} value - A number (interpreted as pixels) or a valid CSS string.
     * @throws {TypeError} If value is not a number or string.
     */
    set styleWidth(value) {
        if (typeof value !== 'number' && typeof value !== 'string')
            throw new TypeError('Style width must be a number or a valid string value for this css property.');
        this.canvasElement.style.width = typeof value === 'number' ? `${value}px` : value;
    }

    /**
     * Gets the CSS style height of the canvas element.
     * @returns {string}
     */
    get styleHeight() {
        return this.canvasElement.style.height;
    }

    /**
     * Gets the client height of the canvas element.
     * @returns {number}
     */
    get clientHeight() {
        return this.canvasElement.clientHeight;
    }

    /**
     * Sets the CSS style height of the canvas element.
     * @param {number|string} value - A number (interpreted as pixels) or a valid CSS string.
     * @throws {TypeError} If value is not a number or string.
     */
    set styleHeight(value) {
        if (typeof value !== 'number' && typeof value !== 'string')
            throw new TypeError('Style height must be a number or a valid string value for this css property.');
        this.canvasElement.style.height = typeof value === 'number' ? `${value}px` : value;
    }
}