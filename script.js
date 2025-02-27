import GameOverlay from './models/overlay.class.js';
import KeyboardEvents from './models/keyboard-events.class.js';
import Canvas from './models/canvas.class.js';
import Level from './models/level.class.js';
import World from './models/world.class.js';
import Game from './models/game.class.js';
import UI from './models/ui.class.js';

document.addEventListener('DOMContentLoaded', async () => {
    new GameOverlay();
    publishVariablesToWindow();
    new KeyboardEvents().registerKeyboardListener();
    initGame();
});

function publishVariablesToWindow() {
    window.playPauseButton = document.getElementById('play-pause-button');
    // window.gameCanvas = document.getElementById('canvas');
    // window.gameUI = document.getElementById('game-ui');
    // window.gameUIButtons = [document.getElementById('go-to-legal-notice'), document.getElementById('go-to-start'), document.getElementById('go-to-controls')];
    // window.gameUIButtons.forEach(button => {
    //     button.dataset.goTo = button.getAttribute('data-go-to');
    // });
}

function initGame() {
    const gameCanvas = new Canvas(document.getElementById('canvas'));
    const level = new Level(gameCanvas, '../levels/level-1.js', 2);
    level.init();
    const world = new World(level);
    const game = new Game(world);
    new UI(game);
    window.playPauseButton.focus();
}