export default class ActionTimer {
    constructor(checkCallbackFn, actionCallbackFn, actionDuration, minTimeBetweenActions, resetStatesCallbackFn = null) {
        this.checkCallbackFn = checkCallbackFn;
        this.actionCallbackFn = actionCallbackFn;
        this.actionDuration = actionDuration;
        this.minTimeBetweenActions = minTimeBetweenActions;
        this.resetStatesCallbackFn = resetStatesCallbackFn;
        this.isPlayable = false;
        this.hasEnoughTimePassed = false;
        this.timeSinceActionStarted = 0;
        this.timeToPassBetweenActions = minTimeBetweenActions;
    }

    updateAndIsExecutable(deltaTime, arg, ...moreArgs) {
        if (!Number.isFinite(deltaTime)) {
            throw new Error('deltaTime must be provided as a number in milliseconds.');
        }
        this.updateActionTimer(deltaTime);
        return (this.hasEnoughTimePassed || this.isPlayable) && this.checkCallbackFn(arg, ...moreArgs);
    }

    updateActionTimer(deltaTime) {
        if (!this.isPlayable) {
            this.timeToPassBetweenActions -= deltaTime;
            if (this.timeToPassBetweenActions < 0) { // prevent overflow to positive
                this.timeToPassBetweenActions = 0;
            }
            this.hasEnoughTimePassed = this.timeToPassBetweenActions === 0;
        } else {
            this.timeSinceActionStarted += deltaTime;
            this.isPlayable = this.timeSinceActionStarted < this.actionDuration;
            if (!this.isPlayable) {
                this.stop();
            }
        }
    }

    execute(arg, ...moreArgs) {
        if (!this.isPlayable) {
            this.hasEnoughTimePassed = false;
            this.timeSinceActionStarted = 0;
            this.isPlayable = true;
        }
        this.actionCallbackFn(arg, ...moreArgs);
    }

    stop() {
        this.isPlayable = false;
        this.timeToPassBetweenActions = this.minTimeBetweenActions;
        this.resetStatesCallbackFn?.();
    }
}