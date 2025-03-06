/**
 * Timer for managing actions with cooldown and duration.
 */
export default class ActionTimer {
    /**
     * Creates an ActionTimer instance.
     * @param {Function} checkCallbackFn - Function to check if action is allowed.
     * @param {Function} actionCallbackFn - Function to execute when action occurs.
     * @param {number} actionDuration - Duration (ms) for which action remains playable.
     * @param {number} minTimeBetweenActions - Minimum cooldown time (ms) between actions.
     * @param {Function} [resetStatesCallbackFn] - Optional callback to reset state when action stops.
     */
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

    /**
     * Updates the timer and checks if the action can be executed.
     * @param {number} deltaTime - Elapsed time in ms.
     * @param {*} arg - Argument passed to the check callback.
     * @param {...*} moreArgs - Additional arguments.
     * @returns {boolean} True if the action can be executed.
     * @throws {Error} If deltaTime is not a finite number.
     */
    updateAndIsExecutable(deltaTime, arg, ...moreArgs) {
        if (!Number.isFinite(deltaTime)) {
            throw new Error('deltaTime must be provided as a number in milliseconds.');
        }
        this.updateActionTimer(deltaTime);
        return (this.hasEnoughTimePassed || this.isPlayable) && this.checkCallbackFn(arg, ...moreArgs);
    }

    /**
     * Updates the internal timer based on deltaTime.
     * When not playable, decreases timeToPassBetweenActions; when playable, increases timeSinceActionStarted.
     * @param {number} deltaTime - Elapsed time in ms.
     */
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

    /**
     * Executes the action and resets the timer if necessary.
     * @param {*} arg - Argument for the action callback.
     * @param {...*} moreArgs - Additional arguments.
     */
    execute(arg, ...moreArgs) {
        if (!this.isPlayable) {
            this.hasEnoughTimePassed = false;
            this.timeSinceActionStarted = 0;
            this.isPlayable = true;
        }
        this.actionCallbackFn(arg, ...moreArgs);
    }

    /**
     * Stops the action and resets the cooldown timer.
     */
    stop() {
        this.isPlayable = false;
        this.timeToPassBetweenActions = this.minTimeBetweenActions;
        this.resetStatesCallbackFn?.();
    }
}