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
        this.registerGameKeyboardListener();
        this.registerUIKeyboardListener();
    }

    registerGameKeyboardListener() {
        window.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
        window.addEventListener('keyup', (event) => {
            this.handleKeyUp(event);
        });
    }

    registerUIKeyboardListener() {
        window.addEventListener('keyup', (event) => {
            if (event.key === 'Escape') {
                window.playPauseButton.click();
            }
        });
        window.addEventListener('keyup', (event) => {
            if (event.key === 'f') {
                document.getElementById('full-screen').click();
            }
        })
    }

    handleKeyDown(event) {
        if (event.key in this.keys) {
            this.keys[event.key] = true;
            // console.log(`${event.key} key is pressed`);
        }
    }

    handleKeyUp(event) {
        if (event.key in this.keys) {
            this.keys[event.key] = false;
            // console.log(`${event.key} key is released`);
        }
    }

    nokeyPressed() {
        return Object.values(this.keys).every(key => key === false);
    }
}