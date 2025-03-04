export default class KeyboardEvents {
    constructor() {
        this.keys = {
            'Enter': false,
            ' ': false,
            'ArrowRight': false,
            'ArrowLeft': false,
            'ArrowUp': false,
            'ArrowDown': false,
            'a': false,
        };
        window.keyboardEvents = this;
    }

    registerKeyboardListener() {
        window.onkeydown = (event) => {
            this.handleKeyDown(event);
        };
        window.onkeyup = (event) => {
            this.handleKeyUp(event);
            this.handleUIKeyEvent(event);
        };
    }

    handleUIKeyEvent(event) {
        if (event.key === 'p') {
            window.playPauseButton.click();
        } else if (event.key === 'f') {
            document.getElementById('full-screen').click();
        } else if (event.key === 'm') {
            document.getElementById('music-btn').click();
        } else if (event.key === 'Escape') {
            document.activeElement.blur();
        }
    }

    handleKeyDown(event) {
        if (event.key in this.keys) {
            this.keys[event.key] = true;
        }
    }

    handleKeyUp(event) {
        if (event.key in this.keys) {
            this.keys[event.key] = false;
        }
    }

    nokeyPressed() {
        return Object.values(this.keys).every(key => key === false);
    }
}