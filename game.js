import Canvas from './models/canvas.class.js';
import World from './models/world.class.js';
import Game from './models/game.class.js';

let canvasElement = null;

document.addEventListener('DOMContentLoaded', () => {
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