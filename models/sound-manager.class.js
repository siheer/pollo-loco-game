export default class SoundManager {
    constructor() {
        window.soundManager = this;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = 0.5;
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

    initSoundVolumes() {
        this.soundVolumes = {
            background: 0.5,
            walking: 0.4,
            coinCollected: 0.8,
            bottleCollected: 0.7,
            bottleSmash: 0.5,
            chickenStomped: 0.4,
        };
    }

    provideSoundSources() {
        this.soundKeySources = {
            backgroundStart: '../audio/game-start.mp3',
            backgroundLoop: '../audio/game-loop.mp3',
            jump: '../audio/jump.mp3',
            throw: '../audio/throw.mp3',
            walking: '../audio/walking.mp3',
            coinCollected: '../audio/coin-collected.mp3',
            bottleCollected: '../audio/bottle-collected.mp3',
            chickStomped: '../audio/chick-stomped.mp3',
            chickenStomped: '../audio/chicken-stomped.mp3',
            bottleSmash: '../audio/bottle-smash.mp3',
            buyBottle: '../audio/buy-bottle.mp3',
            endbossHurt: '../audio/endboss-hurt.mp3',
            characterHurt: '../audio/character-hurt.mp3',
            gameWon: '../audio/game-won.mp3',
            gameLost: '../audio/game-lost.mp3',
        };
    }

    async preloadSounds() {
        const soundKeys = Object.keys(this.soundKeySources);
        const buffers = await Promise.all(
            soundKeys.map(key => this.loadSound(this.soundKeySources[key]))
        );
        soundKeys.forEach((key, index) => {
            this.buffers[key] = buffers[index];
        });
    }

    async loadSound(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }

    createGainForSound(soundKey) {
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.getSoundVolume(soundKey);
        gainNode.connect(this.masterGain);
        return gainNode;
    }

    fadeGain(gainNode, targetValue, duration, callback) {
        const currentTime = this.audioContext.currentTime;
        gainNode.gain.cancelScheduledValues(currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
        gainNode.gain.linearRampToValueAtTime(targetValue, currentTime + duration);
        setTimeout(() => {
            if (callback) callback();
        }, duration * 1000);
    }

    stopSound(source, gainNode, duration, callback) {
        this.fadeGain(gainNode, 0, duration, () => {
            if (source) source.stop();
            if (callback) callback();
        });
    }

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

    stopBackgroundMusic() {
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource = null;
        }
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.audioContext.currentTime);
    }

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

    handlePlayingStatus(soundKey, bufferSource) {
        this.currentlyPlaying[soundKey] = bufferSource;
        bufferSource.onended = () => this.currentlyPlaying[soundKey] = null;
    }

    playNonOverlapping(soundKey) {
        if (this.currentlyPlaying[soundKey]) return;
        this.play(soundKey);
    }

    // --- Loopende Sounds verwalten ---

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

    stopLoopingSound(soundKey, duration = 2) {
        if (this.loopingSources[soundKey]) {
            const { source, gainNode } = this.loopingSources[soundKey];
            this.stopSound(source, gainNode, duration, () => {
                delete this.loopingSources[soundKey];
            });
        }
    }

    // Für den Walking-Sound: sofort starten und sofort stoppen (ohne Fade)
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

    // --- Neue Methode: MasterGain zurücksetzen ---
    resetMasterGain() {
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
    }

    // --- Mute/Unmute und Volume-Methoden ---

    fadeMute() {
        this.fadeGain(this.masterGain, 0, this.fadeDuration, () => {
            this.isMuted = true;
            localStorage.setItem('soundMuted', 'true');
        });
    }

    fadeUnmute() {
        this.fadeGain(this.masterGain, this.masterVolume, this.fadeDuration, () => {
            this.isMuted = false;
            localStorage.setItem('soundMuted', 'false');
        });
    }

    toggleMute() {
        if (this.isMuted) {
            this.fadeUnmute();
        } else {
            this.fadeMute();
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = volume;
        if (!this.isMuted) {
            this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }
    }

    setSoundVolume(soundKey, volume) {
        this.soundVolumes[soundKey] = volume;
    }

    getSoundVolume(soundKey) {
        return this.soundVolumes[soundKey] !== undefined ? this.soundVolumes[soundKey] : 1.0;
    }
}