import BackgroundObject from '../models/background-object.class.js';
import Character from '../models/character.class.js';
import { createEnemies, createCoins, createBottles } from "../levels/level-1.js";

export default class Level {
    constructor(canvas, pathToLevelItems, levelXLengthFactor = 1) {
        this.canvas = canvas;
        this.pathToLevelItems = pathToLevelItems;
        this.levelItems = [];
        this.backgroundParts = 2;
        this.levelXLengthFactor = levelXLengthFactor * this.backgroundParts;
        this.levelEndX = this.canvas.width * this.levelXLengthFactor - this.canvas.width;
        this.spawnOutsideLevel = false;
        this.groundLevel = 140;
        this.groundLevelY = this.canvas.height - this.groundLevel;
    }

    async init() {
        try {
            this.character = new Character(100, this.getYPositionForObject(1000) /* + 18 */, 250, 500, this); // correct y position by ca. + 18 if character should not start in air
            const level = await import(this.pathToLevelItems);
            this.levelItems = level.createLevelItems(this, this.canvas, this.levelXLengthFactor);
            this.levelItems.push(this.character);
            this.spawnRegularly();
        } catch (error) {
            console.error('Error loading level items:', error);
        }
    }

    spawnRegularly() {
        setInterval(() => {
            this.spawnEnemies();
        }, 10000);
        setInterval(() => {
            this.spawnItems();
        }, 15000);
        this.moveCharacterReferenceToPaintLast();
    }

    spawnEnemies() {
        if (!window.game.isGameRunning) return;
        this.spawnOutsideLevel = true;
        this.levelItems[1].push([
            createEnemies(this)
        ]);
        this.spawnOutsideLevel = false;
    }

    spawnItems() {
        if (!window.game.isGameRunning) return;
        this.levelItems.push([
            createCoins(this),
            createBottles(this),
        ]);
    }

    moveCharacterReferenceToPaintLast() {
        const characterIndex = this.levelItems.findIndex(item => item instanceof Character);
        const character = this.levelItems.splice(characterIndex, 1);
        this.levelItems.push(character);
    }

    static getBackgroundFirstPart(canvas, shift = 0) {
        return [
            new BackgroundObject('./img/5_background/layers/air.png', shift, 0, canvas.width + 1), // +1 to remove a strange line on the left
            new BackgroundObject('./img/5_background/layers/3_third_layer/1.png', shift),
            new BackgroundObject('./img/5_background/layers/2_second_layer/1.png', shift),
            new BackgroundObject('./img/5_background/layers/1_first_layer/1.png', shift),
        ];
    }

    static getBackgroundSecondPart(canvas, shift = canvas.width) {
        return [
            new BackgroundObject('./img/5_background/layers/air.png', shift, 0, canvas.width + 1), // +1 to remove a strange line on the left
            new BackgroundObject('./img/5_background/layers/3_third_layer/2.png', shift),
            new BackgroundObject('./img/5_background/layers/2_second_layer/2.png', shift),
            new BackgroundObject('./img/5_background/layers/1_first_layer/2.png', shift),
        ];
    }

    static getFullBackground(canvas, count) {
        let items = [];
        for (let i = 0; i < count; i++) {
            items.push(...Level.getBackgroundFirstPart(canvas, canvas.width * i));
            items.push(...Level.getBackgroundSecondPart(canvas, canvas.width * ++i));
        }
        return items;
    }

    getRandomXInSegment(segmentIndex) {
        return segmentIndex * this.canvas.width + Math.random() * this.canvas.width;
    }

    repeatAcrossLevelSegments(callback, repeatCount = this.levelXLengthFactor - 1) {
        if (this.spawnOutsideLevel) {
            return callback(this.levelXLengthFactor - 1);
        }

        let result = [];
        for (let canvasOffset = 1; canvasOffset < repeatCount; canvasOffset++) {
            result.push(callback(canvasOffset));
        }
        return result;
    }

    getYPositionForObject(shiftUpBy) { // argument value is normally height of canvas object
        return this.canvas.height - shiftUpBy - this.groundLevel;
    }

    isAboveGround(item) {
        return (item.y + item.height) < this.groundLevelY;
    }

    removeEnemy(enemy) {
        removeItemFromNestedArray(this.levelItems, enemy);
    }

    removeBottle(bottle) {
        removeItemFromNestedArray(this.levelItems, bottle);
    }

    removeCoin(coin) {
        removeItemFromNestedArray(this.levelItems, coin);
    }
}