import GameOverlay from "./models/overlay.class.js";
import KeyboardEvents from "./models/keyboard-events.class.js";
import Canvas from "./models/canvas.class.js";
import Level from "./models/level.class.js";
import World from "./models/world.class.js";
import Game from "./models/game.class.js";
import UI from "./models/ui.class.js";
import SoundManager from "./models/sound-manager.class.js";

let firstStart = true;

/**
 * Handles the DOMContentLoaded event to initialize the game.
 * Registers keyboard events, creates the overlay and UI, then starts the game.
 */
document.addEventListener("DOMContentLoaded", async () => {
    new KeyboardEvents();
    new GameOverlay();
    new UI();
    await initGame();
});

/**
 * Initializes the game by setting up the canvas, level, world, game and sound manager.
 */
window.initGame = async (pathToLevel = "../levels/level-1.js") => {
    if (firstStart) deactivateStartButton();
    const canvasElement = document.getElementById("canvas");
    const gameCanvas = new Canvas(canvasElement, 0.5);
    const level = new Level(gameCanvas, pathToLevel, 4);
    await level.init();
    const world = new World(level);
    new Game(world);
    new SoundManager();
    if (firstStart) await world.warmupCanvasTranslate();
    if (firstStart) activateStartButton();
};

/**
 * Deactivates the start button and shows a loading message.
 */
function deactivateStartButton() {
    const startBtn = document.querySelector(".start-btn");
    startBtn.setAttribute("disabled", "disabled");
    startBtn.textContent = "Lädt...";
}

/**
 * Handle user feedback on first startup - consider load time and decoding of images
 */
function activateStartButton() {
    const startBtn = document.querySelector(".start-btn");
    startBtn.removeAttribute("disabled");
    startBtn.textContent = "Spielen";
    firstStart = false;
}