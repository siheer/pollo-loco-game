/**
 * Manages keyboard events and key states for the game.
 */
export default class KeyboardEvents {
    /**
     * Creates a new KeyboardEvents instance and initializes key state tracking.
     */
    constructor() {
        window.keyboardEvents = this;
        this.keys = {
            'Enter': false,
            ' ': false,
            'ArrowRight': false,
            'ArrowLeft': false,
            'ArrowUp': false,
            'ArrowDown': false,
            'a': false,
        };
        this.registerKeyboardListener();
    }

    /**
     * Registers keyboard event listeners for keydown and keyup events.
     */
    registerKeyboardListener() {
        window.onkeydown = (event) => {
            this.handleKeyDown(event);
        };
        window.onkeyup = (event) => {
            this.handleKeyUp(event);
            this.handleUIKeyEvent(event);
        };
    }

    /**
     * Handles UI-specific key events (e.g. for play/pause, full screen, and sound toggling).
     * @param {KeyboardEvent} event - The keyboard event.
     */
    handleUIKeyEvent(event) {
        if (event.key === 'p') {
            window.playPauseButton.click();
        } else if (event.key === 'f') {
            document.getElementById('full-screen').click();
        } else if (event.key === 'm') {
            document.getElementById('sound-btn').click();
        } else if (event.key === 'Escape') {
            document.activeElement.blur();
        }
    }

    /**
     * Sets the key state to true when a key is pressed.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    handleKeyDown(event) {
        if (event.key in this.keys) {
            this.keys[event.key] = true;
        }
    }

    /**
     * Sets the key state to false when a key is released.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    handleKeyUp(event) {
        if (event.key in this.keys) {
            this.keys[event.key] = false;
        }
    }

    /**
     * Checks if no keys are currently pressed.
     * @returns {boolean} True if all keys are false.
     */
    nokeyPressed() {
        return Object.values(this.keys).every(key => key === false);
    }
}