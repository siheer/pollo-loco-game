import StatusBar from "./status-bar.class.js";

export default class EnergyStatusBar extends StatusBar {
    constructor(id) {
        const eventCallback = (event) => {
            const remainingEnergyRatio = event.detail.energy / event.detail.maxEnergy;
            const remainingEnergyPercent = remainingEnergyRatio * 100;
            this.setPercentage(remainingEnergyPercent);
        }

        super(id, 'characterEnergyEvent', eventCallback);
    }
}