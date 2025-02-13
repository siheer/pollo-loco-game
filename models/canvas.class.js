export default class Canvas {
    constructor(canvasElement, baseWidth = 1920, canvasAspectRatio = 16 / 9) {
        if (!(canvasElement instanceof HTMLCanvasElement))
            throw new Error('Provided element is not a valid HTMLCanvasElement.');
        this.canvasElement = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.baseWidth = baseWidth;
        this.baseHeight = this.baseWidth / canvasAspectRatio;
        this.width = this.baseWidth;
        this.height = this.baseHeight;
        this.currentDPR = window.devicePixelRatio || 1;
    }

    get width() {
        return this.canvasElement.width;
    }

    set width(value) {
        if (typeof value !== 'number')
            throw new TypeError('Width must be a number.');
        value = value < 0 ? (console.warn(`Canvas drawing width received a negative value (${value}). Using absolute value instead.`), Math.abs(value)) : value;
        this.canvasElement.width = value;
    }

    get height() {
        return this.canvasElement.height;
    }

    set height(value) {
        if (typeof value !== 'number')
            throw new TypeError('Height must be a number.');
        value = value < 0 ? (console.warn(`Canvas drawing height received a negative value (${value}). Using absolute value instead.`), Math.abs(value)) : value;
        this.canvasElement.height = value;
    }

    get styleWidth() {
        return this.canvasElement.style.width;
    }

    get clientWidth() {
        return this.canvasElement.clientWidth;
    }

    set styleWidth(value) {
        if (typeof value !== 'number' && typeof value !== 'string')
            throw new TypeError('Style width must be a number or a valid string value for this css property.');
        this.canvasElement.style.width = typeof value === 'number' ? `${value}px` : value;
    }

    get styleHeight() {
        return this.canvasElement.style.height;
    }

    get clientHeight() {
        return this.canvasElement.clientHeight;
    }

    set styleHeight(value) {
        if (typeof value !== 'number' && typeof value !== 'string')
            throw new TypeError('Style height must be a number or a valid string value for this css property.');
        this.canvasElement.style.height = typeof value === 'number' ? `${value}px` : value;
    }

    resizeToDevicePixelRatio() {
        const dpr = window.devicePixelRatio || 1;
        if (dpr === this.currentDPR) return;
        this.currentDPR = dpr;
        this.width = this.baseWidth * dpr;
        this.height = this.baseHeight * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
}