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
        this.isGameRunning = false;
        this.firstStart = true;
        this.firstGameOver = true;
        this.reducingLoadInterval = false;
        this.waitOnStartIntervalId = setInterval(() => this.waitOnStart(), 1000);
        this.worldPaintedBeforeStartCount = 0;
        this.registerHandlingOfFocusOut();
        this.wasRunningBeforeBlur = false;
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
     * Repaints the canvas a limited number of times before the game starts,
     * allowing resources to finish loading.
     */
    waitOnStart() {
        if (!this.isGameRunning && this.worldPaintedBeforeStartCount < 20) {
            this.world.drawWorld();
            this.worldPaintedBeforeStartCount++;
        }
    }

    /**
     * Starts the game loop after an optional delay and plays background music on first start.
     * @param {number} [delayInMilliseconds=0] - Delay before starting the game loop.
     */
    start(delayInMilliseconds = 0) {
        setTimeout(() => {
            if (this.firstStart) window.soundManager.playBackground();
            this.updateUIOnStart();
            this.isGameRunning = true;
            this.lastTimestamp = null;
            this.animationFrameId = requestAnimationFrame(timestamp => this.gameLoop(timestamp));
        }, delayInMilliseconds);
    }

    /**
     * Handles the play/pause button click to toggle the game running state.
     */
    handlePlayPauseButton() {
        this.isGameRunning ? this.stop() : this.start();
    }

    /**
     * Updates UI elements when the game starts.
     */
    updateUIOnStart() {
        window.playPauseButton.disabled = false;
        document.getElementById('go-to-controls').disabled = false;
        window.gameOverlay.remove();
        window.playPauseButton.innerHTML = pauseSVG;
        window.playPauseButton.blur();
    }

    /**
     * Stops the game loop and updates UI to reflect the paused state.
     */
    stop() {
        this.firstStart = false;
        this.isGameRunning = false;
        window.playPauseButton.innerHTML = playSVG;
        cancelAnimationFrame(this.animationFrameId);
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
            this.handleisGameRunning(deltaTime);
            this.lastTimestamp = timestamp;
        }
    }

    /**
     * Processes game updates including keyboard events, world updates, collision checks, and drawing.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    handleisGameRunning(deltaTime) {
        this.world.checkForInitializingKeyboardEvents(deltaTime);
        this.world.updateWorld(deltaTime);
        this.world.checkCollisions(deltaTime);
        this.world.drawWorld();
    }

    /**
     * Handles the game over state, disables UI controls, displays game over overlay, and plays appropriate sounds.
     */
    handleGameOver() {
        window.playPauseButton.disabled = true;
        document.getElementById('go-to-controls').disabled = true;
        window.playPauseButton.innerHTML = playSVG;
        if (this.gameOver.playerHasWon) {
            this.showGameOverDisplay(true, 'game-won-img');
        } else {
            this.showGameOverDisplay(true, 'game-over-img');
        }
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
        const restartBtn = document.getElementById('restart-btn');
        const homeBtn = document.getElementById('go-to-start');
        show ? gameOverDisplayElem.classList.remove('dn') : gameOverDisplayElem.classList.add('dn');
        show ? restartBtn.classList.remove('dn') : restartBtn.classList.add('dn');
        show ? homeBtn.focus() : null;
    }

    /**
     * Restarts the game by hiding the game over overlay, re-initializing the game, and starting the game loop.
     */
    restart() {
        this.showGameOverDisplay(false, 'game-over-img');
        this.showGameOverDisplay(false, 'game-won-img');
        window.soundManager.stopSoundImmediatelyByKey('gameLost');
        window.soundManager.stopSoundImmediatelyByKey('gameWon');
        window.initGame();
        window.game.start();
    }

    /**
     * Toggles background music on or off and updates the corresponding UI button.
     */
    toggleMusicOnOff() {
        const musicBtn = document.getElementById('music-btn');
        if (window.soundManager.isMuted) {
            musicBtn.innerHTML = musicOffSVG;
            musicBtn.title = 'Musik aus (m)';
        } else {
            musicBtn.innerHTML = musicOnSVG;
            musicBtn.title = 'Musik an (m)';
        }
        window.soundManager.toggleMute();
    }

    /**
     * Stops the music if it is playing and updates local storage with the muted state.
     */
    stopMusicIfPlaying() {
        if (!window.soundManager.isMuted) {
            this.setGameWasMuted(false);
            this.toggleMusicOnOff();
        }
        else {
            this.setGameWasMuted(true);
        }
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
     * Handles the window blur event by stopping the game and music.
     * Records that the game was running before the blur.
     */
    handleOnWindowBlur() {
        if (this.isGameRunning) {
            this.wasRunningBeforeBlur = true;
        }
        this.stop();
        this.stopMusicIfPlaying();
    }

    /**
     * Handles the window focus event by restarting the game if it was running before blur
     * and toggling music on if the game was not muted.
     */
    handleOnWindowFocus() {
        if (this.wasRunningBeforeBlur) {
            this.start();
            this.wasRunningBeforeBlur = false;
        }
        if (!this.gameWasMuted()) {
            this.toggleMusicOnOff();
        }
    }

    /**
     * Set flag in localStorage if game was muted when e.g. going to menu
     * @param {boolean} wasMuted 
     */
    setGameWasMuted(wasMuted) {
        localStorage.setItem('gameWasMuted', wasMuted);
    }

    /**
     * Get flag in localStorage if game was muted from e.g. going to menu
     * @returns {boolean} - returns if game was muted.
     */
    gameWasMuted() {
        return localStorage.getItem('gameWasMuted') === 'true';
    }
}