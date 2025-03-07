export default class SoundManager {
    /**
     * Creates a new SoundManager instance.
     * Initializes the audio context, master gain node, volume settings, and preloads sounds.
     */
    constructor() {
        window.soundManager = this;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = 0.6;
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = this.hasUserMuted() ? 0 : this.masterVolume;
        this.masterGain.connect(this.audioContext.destination);
        this.buffers = {};
        this.currentSource = null;
        this.fadeDuration = 1;
        this.currentlyPlaying = {};
        this.loopingSources = {};
        this.initSoundVolumes();
        this.provideSoundSources();
        this.loadPromise = this.preloadSounds();
    }

    /**
     * Retrieves the user's muted state from localStorage.
     * @returns {boolean} True if the muted state is set to true.
     */
    hasUserMuted() {
        return JSON.parse(localStorage.getItem('hasUserMuted')) === true;
    }

    /**
     * Stores the user's muted state in localStorage.
     * @param {boolean} value The muted state to be stored.
     */
    setHasUserMuted(value) {
        localStorage.setItem('hasUserMuted', JSON.stringify(value));
    }

    /**
     * Initializes the volume levels for various sound effects.
     */
    initSoundVolumes() {
        this.soundVolumes = {
            background: 0.7,
            jump: 0.5,
            walking: 0.4,
            coinCollected: 0.8,
            bottleCollected: 0.7,
            bottleSmash: 0.5,
            chickenStomped: 0.4,
            gameLost: 0.8,
        };
    }

    /**
     * Defines the source URLs for different game sounds.
     */
    provideSoundSources() {
        this.soundKeySources = {
            backgroundStart: 'audio/game-start.mp3',
            backgroundLoop: 'audio/game-loop.mp3',
            jump: 'audio/jump.mp3',
            throw: 'audio/throw.mp3',
            walking: 'audio/walking.mp3',
            coinCollected: 'audio/coin-collected.mp3',
            bottleCollected: 'audio/bottle-collected.mp3',
            chickStomped: 'audio/chick-stomped.mp3',
            chickenStomped: 'audio/chicken-stomped.mp3',
            bottleSmash: 'audio/bottle-smash.mp3',
            buyBottle: 'audio/buy-bottle.mp3',
            endbossHurt: 'audio/endboss-hurt.mp3',
            characterHurt: 'audio/character-hurt.mp3',
            gameWon: 'audio/game-won.mp3',
            gameLost: 'audio/game-over.mp3',
        };
    }

    /**
     * Preloads all sound buffers asynchronously.
     * @returns {Promise<void>}
     */
    async preloadSounds() {
        const soundKeys = Object.keys(this.soundKeySources);
        const buffers = await Promise.all(
            soundKeys.map(key => this.loadSound(this.soundKeySources[key]))
        );
        soundKeys.forEach((key, index) => {
            this.buffers[key] = buffers[index];
        });
    }

    /**
     * Loads and decodes an audio file from the given URL.
     * @param {string} url - The URL of the sound file.
     * @returns {Promise<AudioBuffer>} The decoded audio buffer.
     */
    async loadSound(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }

    /**
     * Plays background music by scheduling a start sound and a looping sound.
     */
    playBackground() {
        this.loadPromise.then(() => {
            if (this.audioContext.state !== 'running') this.audioContext.resume();
            const bgGain = this.createGainForSound("background");
            const startTime = this.audioContext.currentTime;
            const { source: sourceStart } = this.createSource('backgroundStart', false, bgGain);
            sourceStart.start(startTime);
            const { source: sourceLoop } = this.createSource('backgroundLoop', true, bgGain);
            sourceLoop.start(startTime + sourceStart.buffer.duration);
            this.currentSource = sourceLoop;
        });
    }

    /**
     * Create an AudioBufferSourceNode and associated GainNode for a sound.
     * @param {string} soundKey - The key identifying the sound.
     * @param {boolean} loop - Whether the source should loop.
     * @returns {object} An object containing the source and gainNode.
     */
    createSource(soundKey, loop, gainNode) {
        const source = this.audioContext.createBufferSource();
        source.buffer = this.buffers[soundKey];
        source.loop = loop;
        if (!gainNode) gainNode = this.createGainForSound(soundKey);
        source.connect(gainNode);
        return { source, gainNode };
    }

    /**
     * Creates a gain node for a specific sound and connects it to the master gain.
     * @param {string} soundKey - The key identifying the sound.
     * @returns {GainNode} The created gain node.
     */
    createGainForSound(soundKey) {
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.getSoundVolume(soundKey);
        gainNode.connect(this.masterGain);
        return gainNode;
    }

    /**
     * Retrieves the volume for a specific sound key.
     * @param {string} soundKey - The key identifying the sound.
     * @returns {number} The volume level (default is 1.0 if not set).
     */
    getSoundVolume(soundKey) {
        return this.soundVolumes[soundKey] !== undefined ? this.soundVolumes[soundKey] : 1.0;
    }

    /**
     * Plays a sound effect identified by soundKey.
     * @param {string} soundKey - The key identifying the sound.
     */
    play(soundKey) {
        this.loadPromise.then(() => {
            if (this.buffers[soundKey]) {
                const { source } = this.createSource(soundKey, false);
                this.handlePlayingStatus(soundKey, source);
                source.start();
            }
        });
    }

    /**
     * Registers the sound source as currently playing and clears it when finished.
     * @param {string} soundKey - The key of the sound.
     * @param {AudioBufferSourceNode} bufferSource - The sound source.
     */
    handlePlayingStatus(soundKey, bufferSource) {
        this.currentlyPlaying[soundKey] = bufferSource;
        bufferSource.onended = () => this.currentlyPlaying[soundKey] = null;
    }

    /**
     * Plays a sound effect if it is not already playing.
     * @param {string} soundKey - The key identifying the sound.
     */
    playNonOverlapping(soundKey) {
        if (this.currentlyPlaying[soundKey]) return;
        this.play(soundKey);
    }

    /**
     * Starts playing a looping sound for the given sound key if not already playing.
     * @param {string} soundKey - The key identifying the sound.
     */
    playLoopingSound(soundKey) {
        this.loadPromise.then(() => {
            if (this.loopingSources[soundKey]) return;
            const { source, gainNode } = this.createSource(soundKey, true);
            source.start();
            this.loopingSources[soundKey] = { source, gainNode };
        });
    }

    /**
     * Plays the walking sound as a looping sound immediately.
     */
    playWalkingSound() {
        this.playLoopingSound("walking");
    }

    /**
     * Fades the master gain to 0 over the fade duration.
     */
    fadeMute() {
        this.fadeGain(this.masterGain, 0, this.fadeDuration);
    }

    /**
     * Fades the master gain to the master volume over the fade duration.
     */
    fadeUnmute() {
        this.fadeGain(this.masterGain, this.masterVolume, this.fadeDuration);
    }

    /**
     * Fades a gain node to a target value over a specified duration.
     * @param {GainNode} gainNode - The gain node to fade.
     * @param {number} targetValue - The target gain value.
     * @param {number} duration - Duration in seconds.
     */
    fadeGain(gainNode, targetValue, duration) {
        const currentTime = this.audioContext.currentTime;
        gainNode.gain.cancelScheduledValues(currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
        gainNode.gain.linearRampToValueAtTime(targetValue, currentTime + duration);
    }

    /**
     * Stops the background music and resets the master gain.
     */
    stopBackgroundMusic() {
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource = null;
        }
        this.masterGain.gain.setValueAtTime(this.hasUserMuted() ? 0 : this.masterVolume, this.audioContext.currentTime);
    }

    /**
     * Stops a sound source by fading its gain to 0 over the specified duration, then stopping the source.
     * @param {AudioBufferSourceNode} source - The sound source.
     * @param {GainNode} gainNode - The associated gain node.
     * @param {number} duration - Duration in seconds for the fade out.
     * @param {Function} [callback] - Optional callback after stopping.
     */
    stopSound(source, gainNode, duration, callback) {
        this.fadeGain(gainNode, 0, duration);
        setTimeout(() => {
            if (source) source.stop();
            if (callback) callback();
        }, duration * 1000);
    }

    /**
     * Immediately stops a sound by its key, handling both looping and non-looping sounds.
     * @param {string} soundKey - The key of the sound to stop.
     */
    stopSoundImmediatelyByKey(soundKey) {
        if (this.loopingSources[soundKey]) {
            const { source, gainNode } = this.loopingSources[soundKey];
            source.stop();
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            delete this.loopingSources[soundKey];
        }
        if (this.currentlyPlaying[soundKey]) {
            this.currentlyPlaying[soundKey].stop();
            this.currentlyPlaying[soundKey] = null;
        }
    }

    /**
     * Stops a looping sound with a fade-out over the specified duration.
     * @param {string} soundKey - The key identifying the sound.
     * @param {number} [duration=2] - Duration in seconds for the fade-out.
     */
    stopLoopingSound(soundKey, duration = 2) {
        if (this.loopingSources[soundKey]) {
            const { source, gainNode } = this.loopingSources[soundKey];
            this.stopSound(source, gainNode, duration, () => {
                delete this.loopingSources[soundKey];
            });
        }
    }

    /**
     * Immediately stops all sounds and mutes the master gain.
     */
    muteAllImmediately() {
        this.stopBackgroundMusic();
        for (const key in this.loopingSources) {
            const { source } = this.loopingSources[key];
            if (source) source.stop();
        }
        this.loopingSources = {};
        for (const key in this.currentlyPlaying) {
            const source = this.currentlyPlaying[key];
            if (source) source.stop();
        }
        this.currentlyPlaying = {};
        this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    }

    /**
     * Resets the master gain to the master volume.
     */
    resetMasterGain() {
        this.masterGain.gain.setValueAtTime(
            this.hasUserMuted() ? 0 : this.masterVolume,
            this.audioContext.currentTime
        );
    }
}