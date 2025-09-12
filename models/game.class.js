import Statusbar from './statusbar.class.js';

/**
 * Represents the main game instance.
 * Manages the game loop, state transitions, and UI updates.
 */
export default class Game {
    /**
     * Creates a new Game instance and sets up initial game state and status bars.
     * @param {World} world - The game world instance.
     */
    constructor(world) {
        window.game = this;
        this.setUpStatusbars();
        this.world = world;
        this.animationFrameId = null;
        this.lastTimestamp = null;
        this.gameOver = { isOver: false, playerHasWon: false };
        this.wasGameRunning = true; // true, because initially game should start immediately after leaving menu
        this.isGameRunning = false;
        this.firstGameOver = true;
        this.worldPaintedBeforeStartCount = 0;
        this.registerHandlingOfFocusOut();
        this.wasDeviceTurnedIntoPortraitMode = false;
        window.addEventListener("resize", () => this.checkOrientation());
    }

    /**
     * Sets up status bars for character energy, bottles, coins, and endboss energy.
     */
    setUpStatusbars() {
        new Statusbar('character-energy', 'characterEnergyEvent');
        new Statusbar('bottles', 'bottleEvent');
        new Statusbar('coins', 'coinEvent');
        new Statusbar('endboss-energy', 'endbossEnergyEvent');
    }

    /**
     * Starts the game loop after an optional delay
     * @param {number} [delayInMilliseconds=0] - Delay before starting the game loop.
     */
    start(delayInMilliseconds = 0) {
        this.world.drawWorld();
        setTimeout(() => {
            if (this.gameOver.isOver) return;
            this.updatePlayPauseBtn();
            this.handleSoundOnStart();
            this.isGameRunning = true;
            this.wasGameRunning = false;
            this.lastTimestamp = null;
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        }, delayInMilliseconds);
    }

    /**
     * Updates play/pause button when the game starts.
     */
    updatePlayPauseBtn() {
        window.playPauseButton.innerHTML = pauseSVG;
        window.world.canvas.canvasElement.focus();
    }

    /**
     * Turn on sound, if not muted by user choice.
     */
    handleSoundOnStart() {
        if (!window.soundManager.hasUserMuted()) this.turnSoundOn();
        else this.turnSoundOff();
    }

    /**
     * Handles the play/pause button click to toggle the game running state.
     */
    handlePlayPauseButton() {
        if (this.gameOver.isOver) return;
        this.isGameRunning ? this.stop() : this.start();
    }

    /**
     * Stops the game loop and updates UI to reflect the paused state.
     */
    stop() {
        this.isGameRunning = false;
        window.playPauseButton.innerHTML = playSVG;
        cancelAnimationFrame(this.animationFrameId);
        this.turnSoundOff();
    }

    /**
     * The main game loop that updates game state and renders the world.
     * Continues until game over, then handles game over state.
     * @param {number} timestamp - The current timestamp.
     */
    gameLoop(timestamp) {
        if (!this.gameOver.isOver) {
            this.timeGameLoop(timestamp);
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        } else {
            this.handleGameOver();
        }
    }

    /**
     * Calculates deltaTime between frames and updates game state if sufficient time has passed.
     * @param {number} timestamp - The current timestamp.
     */
    timeGameLoop(timestamp) {
        this.lastTimestamp ??= timestamp;
        const deltaTime = timestamp - this.lastTimestamp;
        if (deltaTime > MIN_INTERVAL_IN_MILLISECONDS) {
            this.handleGameIsRunning(deltaTime);
            this.lastTimestamp = timestamp;
        }
    }

    /**
     * Processes game updates including keyboard events, world updates, collision checks, and drawing.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    handleGameIsRunning(deltaTime) {
        this.world.checkForInitializingKeyboardEvents(deltaTime);
        this.world.updateWorld(deltaTime);
        this.world.checkCollisions(deltaTime);
        this.world.drawWorld();
    }

    /**
     * Handles the game over state, disables UI controls, displays game over overlay, and plays appropriate sounds.
     */
    handleGameOver() {
        this.isGameRunning = false;
        const gameOverImgId = this.gameOver.playerHasWon ? 'game-won-img' : 'game-over-img';
        this.showGameOverDisplay(true, gameOverImgId);
        if (this.firstGameOver) {
            this.handleGameOverSounds(this.gameOver.playerHasWon);
            this.firstGameOver = false;
        }
    }

    /**
     * Plays game over sounds based on whether the player has won or lost.
     * @param {boolean} hasWon - True if the player has won.
     */
    handleGameOverSounds(hasWon) {
        window.soundManager.muteAllImmediately();
        window.soundManager.resetMasterGain();
        if (hasWon) {
            window.soundManager.play('gameWon');
        } else {
            window.soundManager.play('gameLost');
        }
    }

    /**
     * Shows or hides the game over overlay display.
     * @param {boolean} show - Whether to show the overlay.
     * @param {string} elementId - The id of the overlay element to display.
     */
    showGameOverDisplay(show, elementId) {
        const gameOverDisplayElem = document.getElementById(elementId);
        const restartBtns = document.getElementById('restart-btns');
        show ? gameOverDisplayElem.classList.remove('dn') : gameOverDisplayElem.classList.add('dn');
        show ? restartBtns.classList.remove('dn') : restartBtns.classList.add('dn');
    }

    /**
     * Restarts the game by hiding the game over overlay, re-initializing the game, and starting the game loop.
     */
    async restart() {
        this.showGameOverDisplay(false, 'game-over-img');
        this.showGameOverDisplay(false, 'game-won-img');
        window.soundManager.stopSoundImmediatelyByKey('gameLost');
        window.soundManager.stopSoundImmediatelyByKey('gameWon');
        await window.initGame();
        window.game.start(1000);
    }

    /**
     * Turn sound off an update UI button
     */
    turnSoundOff() {
        const soundBtn = document.getElementById('sound-btn');
        soundBtn.innerHTML = soundOnSVG;
        soundBtn.title = 'Musik an (m)';
        window.soundManager.fadeMute();
    }

    /**
     * Turn sound on an update UI button.
     * Plays background music if not already running.
     */
    turnSoundOn() {
        const soundBtn = document.getElementById('sound-btn');
        soundBtn.innerHTML = soundOffSVG;
        soundBtn.title = 'Musik aus (m)';
        window.soundManager.fadeUnmute();
        if (!this.gameOver.isOver && !window.soundManager.currentSource) window.soundManager.playBackground();
    }

    /**
     * Registers event handlers to pause the game when the window loses focus
     * and resume it when focus is regained.
     */
    registerHandlingOfFocusOut() {
        window.onblur = () => {
            this.handleOnWindowBlur();
        }
        window.onfocus = () => {
            this.handleOnWindowFocus();
        }
    }

    /**
     * Handles the window blur event by stopping the game and sound.
     * Records that the game was running before the blur.
     */
    handleOnWindowBlur() {
        if (window.matchMedia("(hover: hover)").matches) {
            if (this.isGameRunning) {
                this.wasGameRunning = true;
            }
            this.stop();
        }
    }

    /**
     * Handles the window focus event by restarting the game if it was running before blur
     * and toggling sound on if the game was not muted.
     */
    handleOnWindowFocus() {
        if (window.matchMedia("(hover: hover)").matches) {
            if (this.wasGameRunning && !window.gameOverlay.element) {
                this.start();
                this.wasGameRunning = false;
            }
        }
    }

    /**
     * Checks the device orientation and starts or stops the game accordingly.
     * If the device is in portrait mode, the game is stopped;
     * in landscape mode, the game is started (provided it isn’t already running and the game isn’t over).
     */
    checkOrientation() {
        if (window.matchMedia("(orientation: portrait)").matches) {
            this.wasDeviceTurnedIntoPortraitMode = true;
            if (this.isGameRunning) {
                this.wasGameRunning = true;
                this.stop();
            }
        } else if (this.wasDeviceTurnedIntoPortraitMode) {
            this.wasDeviceTurnedIntoPortraitMode = false;
            if (!this.gameOver.isOver && !this.isGameRunning && this.wasGameRunning) {
                this.start(1000);
            }
        }
    }
}