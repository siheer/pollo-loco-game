import Canvas from './models/canvas.class.js';
import World from './models/world.class.js';
import Game from './models/game.class.js';
import KeyboardEvents from './models/keyboardEvents.class.js';

let canvasElement = null;
const keyboardEvents = new KeyboardEvents();
window.keyboardEvents = keyboardEvents;

document.addEventListener('DOMContentLoaded', async () => {
    registerKeyboardListener();
    canvasElement = document.getElementById('canvas');
    const gameCanvas = new Canvas(canvasElement);

    const world = await intializeWorld(gameCanvas);
    const game = new Game(world);

    initializeUI(game);
    game.start(1000);

    registerResizeListener(gameCanvas);
    document.body.style.visibility = 'visible';
});

async function intializeWorld(canvas) {
    const world = new World(canvas);
    world.addLevel('../levels/level-1.js', 2);
    await world.fillWorldWithObjects();
    return world;
}

function registerKeyboardListener() {
    window.addEventListener('keydown', (event) => {
        keyboardEvents.handleKeyDown(event);
    });
    window.addEventListener('keyup', (event) => {
        keyboardEvents.handleKeyUp(event);
    });
}

// Debounced resize event: Only update canvas when the window is not resized for 100ms.
function registerResizeListener(canvas) {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            canvas.resizeToDevicePixelRatio();
        }, 100);
    });
}

function initializeUI(game) {
    registerPlayPauseButton(game);
}

function registerPlayPauseButton(game) {
    const playPauseButton = document.getElementById('playPauseButton');
    let isPlaying = true;

    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            game.stop();
            playPauseButton.innerHTML = playSVG;
        } else {
            game.start();
            playPauseButton.innerHTML = pauseSVG;
        }
        isPlaying = !isPlaying;
    });
}