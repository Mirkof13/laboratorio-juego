class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmOsc = null;
    this.bgmGain = null;
    this.bgmInterval = null;
    this.isPlayingBgm = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.bgmGain) this.bgmGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else {
      if (this.bgmGain) this.bgmGain.gain.setValueAtTime(0.08, this.ctx?.currentTime || 0);
    }
    return this.isMuted;
  }

  playStep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90 + Math.random() * 30, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playDeath() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const noise = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);

    noise.type = 'square';
    noise.frequency.setValueAtTime(120, now);
    noise.frequency.exponentialRampToValueAtTime(20, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    noise.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    noise.start(now);
    osc.stop(now + 0.5);
    noise.stop(now + 0.5);
  }

  playPickup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [329.63, 440.0, 554.37, 659.25, 880.0];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    });
  }

  playGate() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.8);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const melody = [
      { f: 220.0, d: 0.2 },
      { f: 277.18, d: 0.2 },
      { f: 329.63, d: 0.2 },
      { f: 440.0, d: 0.35 },
      { f: 415.3, d: 0.2 },
      { f: 440.0, d: 0.6 },
    ];

    let current = this.ctx.currentTime;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, current);

      gain.gain.setValueAtTime(0.25, current);
      gain.gain.exponentialRampToValueAtTime(0.001, current + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(current);
      osc.stop(current + note.d);
      current += note.d * 0.9;
    });
  }

  startBGM() {
    if (this.isPlayingBgm) return;
    this.initContext();
    if (!this.ctx) return;

    this.isPlayingBgm = true;
    const chords = [
      [110, 164.81, 220],
      [98.0, 146.83, 196],
      [87.31, 130.81, 174.61],
      [82.41, 123.47, 164.81],
    ];
    let step = 0;

    const playChordStep = () => {
      if (!this.isPlayingBgm || !this.ctx) return;
      const currentChord = chords[step % chords.length];
      step++;

      currentChord.forEach((f) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        const volume = this.isMuted ? 0 : 0.04;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 1.2);
        gain.gain.linearRampToValueAtTime(0.001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 4.0);
      });
    };

    playChordStep();
    this.bgmInterval = setInterval(playChordStep, 4000);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.isPlayingBgm = false;
  }
}

export const sound = new SoundEngine();
