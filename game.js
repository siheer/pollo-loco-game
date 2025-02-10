import Canvas from './models/canvas.class.js';
import World from './models/world.class.js';
import Game from './models/game.class.js';
import KeyboardEvents from './models/keyboardEvents.class.js';

let canvasElement = null;
const keyboardEvents = new KeyboardEvents();
window.keyboardEvents = keyboardEvents;

document.addEventListener('DOMContentLoaded', () => {
    registerKeyboardListener();
    canvasElement = document.getElementById('canvas');
    const gameCanvas = new Canvas(canvasElement);
    const world = new World(gameCanvas);
    const game = new Game(world);
    window.game = game;
    game.start();
    // setTimeout(() => {
    //     game.stop();
    // }, 250);
    document.body.style.visibility = 'visible';
});

function registerKeyboardListener() {
    window.addEventListener('keydown', (event) => {
        keyboardEvents.handleKeyDown(event);
    })
    window.addEventListener('keyup', (event) => {
        keyboardEvents.handleKeyUp(event);
    })
}