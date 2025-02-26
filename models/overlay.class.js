export default class Overlay {
    constructor() {
        this.isActive = false;
        // this.elementId = 'overlay';
        this.element = null;
    }

    addToDocument() {
        this.element = document.createElement('div');
        this.element.classList.add('canvas-overlay');
        this.element.classList.add('game-overlay');
        document.body.appendChild(this.element);
    }

    setContent(templateString) {
        this.element.innerHTML = templateString;
    }

    removeFromDocument() {
        document.body.removeChild(this.element);
    }
}