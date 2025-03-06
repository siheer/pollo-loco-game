/**
 * Manages game sound effects and background music using the Web Audio API.
 */
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
        this.isMuted = localStorage.getItem('soundMuted') === 'true';
        this.masterGain.gain.value = this.isMuted ? 0 : this.masterVolume;
        this.masterGain.connect(this.audioContext.destination);
        this.buffers = {};
        this.currentSource = null;
        this.fadeDuration = 1; // Für alle Sounds außer walking
        this.currentlyPlaying = {};
        this.loopingSources = {};
        this.initSoundVolumes();
        this.provideSoundSources();
        this.loadPromise = this.preloadSounds();
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
     * Fades a gain node to a target value over a specified duration and executes an optional callback.
     * @param {GainNode} gainNode - The gain node to fade.
     * @param {number} targetValue - The target gain value.
     * @param {number} duration - Duration in seconds.
     * @param {Function} [callback] - Optional immediate callback.
     */
    fadeGain(gainNode, targetValue, duration, callback) {
        callback?.();
        const currentTime = this.audioContext.currentTime;
        gainNode.gain.cancelScheduledValues(currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
        gainNode.gain.linearRampToValueAtTime(targetValue, currentTime + duration);
    }

    /**
     * Stops a sound source by fading its gain to 0 over the specified duration, then stopping the source.
     * @param {AudioBufferSourceNode} source - The sound source.
     * @param {GainNode} gainNode - The associated gain node.
     * @param {number} duration - Duration in seconds for the fade out.
     * @param {Function} [callback] - Optional callback after stopping.
     */
    stopSound(source, gainNode, duration, callback) {
        this.fadeGain(gainNode, 0, duration, () => {
            if (source) source.stop();
            if (callback) callback();
        });
    }

    /**
     * Immediately stops a sound by its key, handling both looping and non-looping sounds.
     * @param {string} soundKey - The key of the sound to stop.
     */
    stopSoundImmediatelyByKey(soundKey) {
        // Falls der Sound als Loop läuft, stoppen wir ihn sofort:
        if (this.loopingSources[soundKey]) {
            const { source, gainNode } = this.loopingSources[soundKey];
            source.stop(); // sofort stoppen
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            delete this.loopingSources[soundKey];
        }
        // Falls der Sound als einzelner (non-looping) Sound gerade läuft:
        if (this.currentlyPlaying[soundKey]) {
            this.currentlyPlaying[soundKey].stop();
            this.currentlyPlaying[soundKey] = null;
        }
    }

    /**
     * Plays background music by scheduling a start sound and a looping sound.
     */
    playBackground() {
        this.loadPromise.then(() => {
            const bgGain = this.createGainForSound("background");
            const startTime = this.audioContext.currentTime;

            // Background-Start-Sound
            const sourceStart = this.audioContext.createBufferSource();
            sourceStart.buffer = this.buffers.backgroundStart;
            sourceStart.connect(bgGain);
            sourceStart.start(startTime);

            // Background-Loop-Sound, der nahtlos anschließt
            const sourceLoop = this.audioContext.createBufferSource();
            sourceLoop.buffer = this.buffers.backgroundLoop;
            sourceLoop.loop = true;
            sourceLoop.connect(bgGain);
            sourceLoop.start(startTime + sourceStart.buffer.duration);

            this.currentSource = sourceLoop;
        });
    }

    /**
     * Stops the background music and resets the master gain.
     */
    stopBackgroundMusic() {
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource = null;
        }
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.audioContext.currentTime);
    }

    /**
     * Plays a sound effect identified by soundKey.
     * @param {string} soundKey - The key identifying the sound.
     */
    play(soundKey) {
        this.loadPromise.then(() => {
            if (this.buffers[soundKey]) {
                const source = this.audioContext.createBufferSource();
                source.buffer = this.buffers[soundKey];
                const gainNode = this.createGainForSound(soundKey);
                source.connect(gainNode);
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
            if (this.loopingSources[soundKey]) return; // Sound läuft bereits
            const source = this.audioContext.createBufferSource();
            source.buffer = this.buffers[soundKey];
            source.loop = true;
            const gainNode = this.createGainForSound(soundKey);
            source.connect(gainNode);
            source.start();
            this.loopingSources[soundKey] = { source, gainNode };
        });
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
     * Plays the walking sound as a looping sound immediately.
     */
    playWalkingSound() {
        this.loadPromise.then(() => {
            if (this.loopingSources["walking"]) return; // läuft bereits
            const source = this.audioContext.createBufferSource();
            source.buffer = this.buffers.walking;
            source.loop = true;
            const gainNode = this.createGainForSound("walking");
            source.connect(gainNode);
            source.start();
            this.loopingSources["walking"] = { source, gainNode };
        });
    }

    /**
     * Immediately stops all sounds and mutes the master gain.
     */
    muteAllImmediately() {
        this.stopBackgroundMusic();
        // Stoppe alle loopenden Sounds
        for (const key in this.loopingSources) {
            const { source } = this.loopingSources[key];
            if (source) {
                source.stop();
            }
        }
        this.loopingSources = {};
        // Stoppe alle aktuell spielenden Sounds
        for (const key in this.currentlyPlaying) {
            const source = this.currentlyPlaying[key];
            if (source) {
                source.stop();
            }
        }
        this.currentlyPlaying = {};
        // Setze Master-Gain sofort auf 0
        this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    }

    /**
     * Resets the master gain to the master volume.
     */
    resetMasterGain() {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.audioContext.currentTime);
    }

    /**
     * Fades the master gain to 0 over the fade duration and sets the muted flag.
     */
    fadeMute() {
        this.fadeGain(this.masterGain, 0, this.fadeDuration, () => {
            this.isMuted = true;
            localStorage.setItem('soundMuted', 'true');
        });
    }

    /**
     * Fades the master gain to the master volume over the fade duration and clears the muted flag.
     */
    fadeUnmute() {
        this.fadeGain(this.masterGain, this.masterVolume, this.fadeDuration, () => {
            this.isMuted = false;
            localStorage.setItem('soundMuted', 'false');
        });
    }

    /**
     * Toggles the mute state by fading the master gain accordingly.
     */
    toggleMute() {
        if (this.isMuted) {
            this.fadeUnmute();
        } else {
            this.fadeMute();
        }
    }

    /**
     * Retrieves the volume for a specific sound key.
     * @param {string} soundKey - The key identifying the sound.
     * @returns {number} The volume level (default is 1.0 if not set).
     */
    getSoundVolume(soundKey) {
        return this.soundVolumes[soundKey] !== undefined ? this.soundVolumes[soundKey] : 1.0;
    }
}