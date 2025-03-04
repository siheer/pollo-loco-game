import GameOverlay from './models/overlay.class.js';
import KeyboardEvents from './models/keyboard-events.class.js';
import Canvas from './models/canvas.class.js';
import Level from './models/level.class.js';
import World from './models/world.class.js';
import Game from './models/game.class.js';
import UI from './models/ui.class.js';
import SoundManager from './models/sound-manager.class.js';

document.addEventListener('DOMContentLoaded', async () => {
    new KeyboardEvents().registerKeyboardListener();
    new GameOverlay();
    new UI();
    initGame();
});

window.initGame = function initGame() {
    const gameCanvas = new Canvas(document.getElementById('canvas'));
    const level = new Level(gameCanvas, '../levels/level-1.js', 4);
    level.init();
    const world = new World(level);
    new Game(world);
    new SoundManager();

}