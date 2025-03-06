/**
 * Represents a status bar UI component for displaying item counts or health.
 */
export default class Statusbar {
    /**
     * Creates a new Statusbar instance associated with a DOM element and sets its initial state.
     * @param {string} id - The id of the status bar element.
     * @param {string} eventType - The event type to listen for updates.
     */
    constructor(id, eventType) {
        this.element = document.getElementById(id);
        this.setInitialState(eventType);
        document.addEventListener(eventType, (event) => {
            this.calcRemainingOfItemOrHealth(event);
        });
    }

    /**
     * Sets the initial state of the status bar based on the event type.
     * @param {string} eventType - The event type.
     */
    setInitialState(eventType) {
        const { max, current } = Statusbar.getMaxAndCurrent(eventType);
        this.calcRemainingOfItemOrHealth({ detail: { max: max, current: current } });
    }

    /**
     * Retrieves the maximum and current values for the specified event type.
     * @param {string} eventType - The event type.
     * @returns {object} An object with 'max' and 'current' properties.
     * @throws {Error} If an invalid event type is provided.
     */
    static getMaxAndCurrent(eventType) {
        const full = 1;
        switch (eventType) {
            case 'characterEnergyEvent':
                return { max: full, current: full };
            case 'endbossEnergyEvent':
                return { max: full, current: full };
            case 'bottleEvent':
                return { max: window.world.level.character.maxBottleSupply, current: window.world.level.character.bottleSupply };
            case 'coinEvent':
                return { max: window.world.level.character.maxCoinSupply, current: window.world.level.character.coinSupply };
            default:
                throw new Error('Invalid event type: ' + eventType);
        }
    }

    /**
     * Calculates the remaining percentage based on the current and maximum values and updates the status bar.
     * @param {CustomEvent} event - The event containing detail with current and max values.
     */
    calcRemainingOfItemOrHealth(event) {
        const remainingRatio = event.detail.current / event.detail.max;
        const remainingPercent = remainingRatio * 100;
        this.setPercentage(remainingPercent);
    }

    /**
     * Sets the visual percentage of the status bar by translating the inner element.
     * @param {number} percentage - The percentage to display.
     */
    setPercentage(percentage) {
        const shiftBarToLeftBy = 100 - percentage;
        const innerElem = this.element.querySelector('.inner');
        innerElem.style.transform = `translateX( -${shiftBarToLeftBy}% )`;
    }
}