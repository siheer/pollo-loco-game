import Canvas from './models/canvas.class.js';
import World from './models/world.class.js';
import Game from './models/game.class.js';
import KeyboardEvents from './models/keyboardEvents.class.js';
import Statusbar from './models/statusbar.class.js';

let playPauseButton;

document.addEventListener('DOMContentLoaded', async () => {
    window.playPauseButton = document.getElementById('play-pause-button');
    registerKeyboardListener(new KeyboardEvents());
    const game = await createGame();
    initializeUI(game);
});

async function createGame() {
    const canvasElement = document.getElementById('canvas');
    const gameCanvas = new Canvas(canvasElement);

    const world = new World(gameCanvas);
    window.world = world;
    world.addLevel('../levels/level-1.js', 2);
    await world.fillWorldWithObjects();

    const game = new Game(world);
    window.game = game;
    return game;
}

function registerKeyboardListener(keyboardEvents) {
    window.keyboardEvents = keyboardEvents;
    window.addEventListener('keydown', (event) => {
        keyboardEvents.handleKeyDown(event);
    });
    window.addEventListener('keyup', (event) => {
        keyboardEvents.handleKeyUp(event);
    });
    window.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            window.playPauseButton.click();
        }
    });
}

function initializeUI(game) {
    registerPlayPauseButton(game);
    registerGoTos();
    setUpStatusbars();
    window.playPauseButton.focus();
}

function registerPlayPauseButton(game) {
    let isPlaying = false;
    window.playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            game.stop();
            window.playPauseButton.innerHTML = playSVG;
        } else {
            game.start();
            window.playPauseButton.innerHTML = pauseSVG;
        }
        isPlaying = !isPlaying;
        window.playPauseButton.blur();
    });
}

function registerGoTos() {
    const gameUIBtns = [document.getElementById('go-to-legal-notice'), document.getElementById('go-to-start'), document.getElementById('go-to-controls')];
    gameUIBtns.forEach(button => {
        button.addEventListener('click', () => {
            game.stop();
            window.playPauseButton.innerHTML = playSVG;
            openGameOverlay(button.dataset.goTo);
        });
    });
}

function setUpStatusbars() {
    new Statusbar('character-energy', 'characterEnergyEvent');
    new Statusbar('endboss-energy', 'endbossEnergyEvent');
    new Statusbar('bottles', 'bottleEvent');
    new Statusbar('coins', 'coinEvent');
}

function openGameOverlay(goTo) {
    switch (goTo) {
        case 'legal-notice':
            break;
        case 'start':
            break;
        case 'controls':
            break;
        case null:
            break;
        default:
            throw new Error('Invalid goTo: ' + goTo);
    }
}