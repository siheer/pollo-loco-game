export default class GameOverlay {
    constructor(templateString = null) {
        window.gameOverlay = this;
        this.container = document.getElementById('game-container');
        this.add();
        this.setContent(templateString);
    }

    add() {
        this.element = document.createElement('div');
        this.element.classList.add('canvas-overlay');
        this.element.classList.add('game-overlay');
        this.container.appendChild(this.element);
    }

    setContent(templateString) {
        this.element.innerHTML = templateString;
    }

    remove() {
        if (this.element) {
            this.container.removeChild(this.element);
            this.element = null;
        }
    }

    startScreen = `

    `
}