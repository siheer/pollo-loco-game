export default class SoundManager {
    constructor() {
        window.soundManager = this;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.audioContext.destination);
        this.buffers = {};
        this.currentSource = null;
        this.loadPromise = this.preloadSounds();
    }

    async preloadSounds() {
        this.buffers.backgroundStart = await this.loadSound("../audio/game-start.mp3");
        this.buffers.backgroundLoop = await this.loadSound("../audio/game-loop.mp3");
    }

    async loadSound(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }

    playBackground() {
        this.loadPromise.then(() => {
            const startTime = this.audioContext.currentTime;
            const sourceStart = this.audioContext.createBufferSource();
            sourceStart.buffer = this.buffers.backgroundStart;
            sourceStart.connect(this.masterGain);
            sourceStart.start(startTime);
            // plane den nahtlosen Übergang: backgroundLoop startet exakt wenn backgroundStart endet
            const sourceLoop = this.audioContext.createBufferSource();
            sourceLoop.buffer = this.buffers.backgroundLoop;
            sourceLoop.loop = true;
            sourceLoop.connect(this.masterGain);
            sourceLoop.start(startTime + sourceStart.buffer.duration);
            this.currentSource = sourceLoop;
        });
    }

    stopBackgroundMusic() {
        const currentTime = this.audioContext.currentTime;
        this.masterGain.gain.cancelScheduledValues(currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0, currentTime + 2);
        setTimeout(() => {
            if (this.currentSource) {
                this.currentSource.stop();
                this.currentSource = null;
            }
            this.masterGain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        }, 2000);
    }
}  