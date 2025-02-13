import Canvas from './models/canvas.class.js';
import World from './models/world.class.js';
import Game from './models/game.class.js';
import KeyboardEvents from './models/keyboardEvents.class.js';

document.addEventListener('DOMContentLoaded', async () => {
    registerKeyboardListener(new KeyboardEvents());
    const game = await createGame();
    initializeUI(game);
    game.start(1000);

    setTimeout(() => {
        document.getElementById('playPauseButton').click();
        document.getElementById('playPauseButton').focus();
    }, 1200);

    document.body.style.visibility = 'visible';
});

async function createGame() {
    const canvasElement = document.getElementById('canvas');
    const gameCanvas = new Canvas(canvasElement);
    registerResizeListener(gameCanvas);

    const world = new World(gameCanvas);
    window.world = world;
    world.addLevel('../levels/level-1.js', 2);
    await world.fillWorldWithObjects();

    const game = new Game(world);
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
        playPauseButton.blur();
    });
}