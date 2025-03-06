export default class Canvas {
    /**
     * Creates a new Canvas instance.
     * @param {HTMLCanvasElement} canvasElement - The HTML canvas element.
     * @param {number} [scale=1] - The scaling factor for internal resolution (e.g., 0.5 reduces resolution by half).
     * @param {number} [baseWidth=1920] - The logical width for the canvas.
     * @param {number} [canvasAspectRatio=16/9] - The aspect ratio of the canvas.
     * @throws {Error} If the provided element is not a valid HTMLCanvasElement.
     */
    constructor(canvasElement, scale = 1, baseWidth = 1920, canvasAspectRatio = 16 / 9) {
        if (!(canvasElement instanceof HTMLCanvasElement))
            throw new Error('Provided element is not a valid HTMLCanvasElement.');
        this.canvasElement = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.logicalWidth = baseWidth;
        this.logicalHeight = baseWidth / canvasAspectRatio;
        this.setDimensionsAndScale(scale);
    }

    /**
     * Sets width and height and scales depending on scaling factor
     * @param {number} scale - The scaling factor for internal resolution (e.g., 0.5 reduces resolution by half).
     */
    setDimensionsAndScale(scale) {
        this.scale = localStorage.getItem('scale') ?? scale;
        this.canvasElement.width = this.logicalWidth * this.scale;
        this.canvasElement.height = this.logicalHeight * this.scale;
        this.ctx.scale(this.scale, this.scale);
    }

    /**
     * Gets the logical width of the canvas.
     * @returns {number}
     */
    get width() {
        return this.logicalWidth;
    }

    /**
     * Sets the logical width of the canvas and updates internal resolution.
     * @param {number} value - The new logical width.
     * @throws {TypeError} If value is not a number.
     */
    set width(value) {
        if (typeof value !== 'number' || value <= 0)
            throw new TypeError('Width must be a positive number.');
        this.logicalWidth = value;
        this.canvasElement.width = this.logicalWidth * this.scale;
    }

    /**
     * Gets the logical height of the canvas.
     * @returns {number}
     */
    get height() {
        return this.logicalHeight;
    }

    /**
     * Sets the logical height of the canvas and updates internal resolution.
     * @param {number} value - The new logical height.
     * @throws {TypeError} If value is not a number.
     */
    set height(value) {
        if (typeof value !== 'number' || value <= 0)
            throw new TypeError('Height must be a positive number.');
        this.logicalHeight = value;
        this.canvasElement.height = this.logicalHeight * this.scale;
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