export default class ActionTimer {
    constructor(checkCallbackFn, actionCallbackFn, actionDuration, minTimeBetweenActions, restoreStatesCallbackFn = null) {
        this.checkCallbackFn = checkCallbackFn;
        this.actionCallbackFn = actionCallbackFn;
        this.actionDuration = actionDuration;
        this.minTimeBetweenActions = minTimeBetweenActions;
        this.restoreStatesCallbackFn = restoreStatesCallbackFn;
        this.isPlaying = false;
        this.hasEnoughTimePassed = true;
    }

    isPlayable(arg, ...moreArgs) {
        if (this.checkCallbackFn(arg, ...moreArgs) && this.hasEnoughTimePassed) {
            return true;
        }
        return false;
    }

    play(arg, ...moreArgs) {
        if (this.isPlaying) {
            this.actionCallbackFn(arg, ...moreArgs);
        } else if (this.hasEnoughTimePassed) {
            this.isPlaying = true;
            if (this.hasNoPositiveDuration()) {
                this.playActionOnce(arg, ...moreArgs);
            } else {
                setTimeout(() => {
                    this.stop();
                }, this.actionDuration);
            }
        }
    }

    hasNoPositiveDuration() {
        return this.actionDuration <= 0;
    }

    playActionOnce(arg, ...moreArgs) {
        if (this.actionDuration <= 0) {
            this.actionCallbackFn(arg, ...moreArgs);
            this.stop();
        }
    }

    stop() {
        this.isPlaying = false;
        this.hasEnoughTimePassed = false;
        this.restoreStatesCallbackFn?.();
        setTimeout(() => {
            this.hasEnoughTimePassed = true;
        }, this.minTimeBetweenActions);
    }
}