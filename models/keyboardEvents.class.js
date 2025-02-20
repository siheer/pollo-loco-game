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