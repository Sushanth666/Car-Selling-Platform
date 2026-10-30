// Multi-Engine High-Fidelity Automotive Exhaust Audio Engine
// Delivers distinct, authentic, and realistic exhaust notes for each specific vehicle model.

export const CAR_SOUND_MAP = {
  'porsche-911-gt3-rs': '/audio/porsche-911-gt3-rs.ogg',
  'ferrari-sf90-stradale': '/audio/ferrari-sf90.ogg',
  'lamborghini-revuelto': '/audio/lamborghini-revuelto.ogg',
  'mclaren-750s-spider': '/audio/mclaren-750s.ogg',
  'rolls-royce-cullinan': '/audio/rolls-royce-cullinan.ogg',
  'rolls-royce-cullinan-black-badge': '/audio/rolls-royce-cullinan.ogg',
  'aston-martin-dbx707': '/audio/aston-martin-dbx.ogg',
  'lamborghini-urus-performante': '/audio/lamborghini-urus.ogg',
  'bugatti-chiron-pur-sport': '/audio/bugatti-chiron.ogg',
  'bugatti-chiron-super-sport': '/audio/bugatti-chiron.ogg',
  'ferrari-296-gtb': '/audio/ferrari-296.ogg',
  'bentley-continental-gt-speed': '/audio/bentley-continental-gt.ogg',
  'koenigsegg-jesko': '/audio/koenigsegg-jesko.ogg',
  'bmw-m4-competition': '/audio/bmw-m4.ogg',
  'mercedes-amg-gt-black-series': '/audio/mercedes-amg-gt.ogg',
  'porsche-taycan-turbo-gt': 'electric-sport-sound'
};

class MultiEngineSoundManager {
  constructor() {
    this.audioCache = new Map();
    this.currentAudio = null;
    this.audioCtx = null;
    this.isPlaying = false;

    // Preload audio elements in browser
    if (typeof window !== 'undefined') {
      try {
        Object.entries(CAR_SOUND_MAP).forEach(([id, path]) => {
          if (path.startsWith('/audio/')) {
            const audio = new Audio(path);
            audio.preload = 'metadata';
            audio.volume = 0.95;
            this.audioCache.set(id, audio);
          }
        });
      } catch (e) {
        console.warn('Audio preloading notice:', e);
      }
    }
  }

  initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  resolveSoundForCar(carIdentifier) {
    if (!carIdentifier) return CAR_SOUND_MAP['porsche-911-gt3-rs'];

    // Direct object with id
    if (typeof carIdentifier === 'object' && carIdentifier.id) {
      return { id: carIdentifier.id, url: CAR_SOUND_MAP[carIdentifier.id] || '/audio/supercar-exhaust-rev.ogg' };
    }

    // Direct ID match
    if (typeof carIdentifier === 'string' && CAR_SOUND_MAP[carIdentifier]) {
      return { id: carIdentifier, url: CAR_SOUND_MAP[carIdentifier] };
    }

    // Keyword match on engine/model string
    const str = String(carIdentifier).toLowerCase();
    if (str.includes('taycan') || str.includes('electric')) {
      return { id: 'porsche-taycan-turbo-gt', url: 'electric-sport-sound' };
    }
    if (str.includes('911') || str.includes('gt3') || str.includes('boxer') || str.includes('flat-6')) {
      return { id: 'porsche-911-gt3-rs', url: CAR_SOUND_MAP['porsche-911-gt3-rs'] };
    }
    if (str.includes('sf90')) {
      return { id: 'ferrari-sf90-stradale', url: CAR_SOUND_MAP['ferrari-sf90-stradale'] };
    }
    if (str.includes('revuelto') || str.includes('huracan') || str.includes('v12')) {
      return { id: 'lamborghini-revuelto', url: CAR_SOUND_MAP['lamborghini-revuelto'] };
    }
    if (str.includes('mclaren') || str.includes('750s')) {
      return { id: 'mclaren-750s-spider', url: CAR_SOUND_MAP['mclaren-750s-spider'] };
    }
    if (str.includes('chiron') || str.includes('bugatti') || str.includes('w16')) {
      return { id: 'bugatti-chiron-pur-sport', url: CAR_SOUND_MAP['bugatti-chiron-pur-sport'] };
    }
    if (str.includes('jesko') || str.includes('koenigsegg')) {
      return { id: 'koenigsegg-jesko', url: CAR_SOUND_MAP['koenigsegg-jesko'] };
    }
    if (str.includes('m4') || str.includes('bmw') || str.includes('inline-6')) {
      return { id: 'bmw-m4-competition', url: CAR_SOUND_MAP['bmw-m4-competition'] };
    }
    if (str.includes('black series') || str.includes('amg')) {
      return { id: 'mercedes-amg-gt-black-series', url: CAR_SOUND_MAP['mercedes-amg-gt-black-series'] };
    }
    if (str.includes('dbx') || str.includes('aston')) {
      return { id: 'aston-martin-dbx707', url: CAR_SOUND_MAP['aston-martin-dbx707'] };
    }
    if (str.includes('urus')) {
      return { id: 'lamborghini-urus-performante', url: CAR_SOUND_MAP['lamborghini-urus-performante'] };
    }
    if (str.includes('cullinan') || str.includes('rolls')) {
      return { id: 'rolls-royce-cullinan', url: CAR_SOUND_MAP['rolls-royce-cullinan'] };
    }
    if (str.includes('bentley') || str.includes('continental')) {
      return { id: 'bentley-continental-gt-speed', url: CAR_SOUND_MAP['bentley-continental-gt-speed'] };
    }
    if (str.includes('296') || str.includes('ferrari')) {
      return { id: 'ferrari-296-gtb', url: CAR_SOUND_MAP['ferrari-296-gtb'] };
    }

    return { id: 'default', url: '/audio/supercar-exhaust-rev.ogg' };
  }

  /**
   * Plays the vehicle-specific authentic exhaust roar.
   * @param {string|object} carIdentifier - Car object, car id, or engine description
   */
  playRev(carIdentifier) {
    try {
      this.initAudioContext();
      const soundInfo = this.resolveSoundForCar(carIdentifier);

      // Handle electric vehicle sound profile
      if (soundInfo.url === 'electric-sport-sound') {
        this.playElectricSportSound();
        return;
      }

      // Stop any currently playing audio track
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        } catch {}
      }

      // Get cached audio or create new instance
      let audio = this.audioCache.get(soundInfo.id);
      if (!audio && typeof window !== 'undefined') {
        audio = new Audio(soundInfo.url);
        audio.preload = 'auto';
        this.audioCache.set(soundInfo.id, audio);
      }

      if (audio) {
        audio.volume = 0.95;
        audio.currentTime = 0;
        this.currentAudio = audio;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isPlaying = true;
            })
            .catch((err) => {
              console.warn('Direct media playback blocked, falling back to tuned synthesizer:', err);
              this.playTunedSynthesizer(soundInfo.id);
            });
        }
      } else {
        this.playTunedSynthesizer(soundInfo.id);
      }

      this.isPlaying = true;
      setTimeout(() => {
        this.isPlaying = false;
      }, 3800);
    } catch (e) {
      console.warn('Exhaust audio playback caught:', e);
      this.playTunedSynthesizer('default');
    }
  }

  /**
   * High-tech Porsche Electric Sport Sound Synthesizer
   */
  playElectricSportSound() {
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const duration = 2.6;

      const osc = this.audioCtx.createOscillator();
      const subOsc = this.audioCtx.createOscillator();
      const harmOsc = this.audioCtx.createOscillator();

      osc.type = 'sine';
      subOsc.type = 'triangle';
      harmOsc.type = 'sawtooth';

      // Futuristic acceleration frequency sweep
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 1.2);
      osc.frequency.exponentialRampToValueAtTime(240, now + duration);

      subOsc.frequency.setValueAtTime(55, now);
      subOsc.frequency.exponentialRampToValueAtTime(190, now + 1.2);
      subOsc.frequency.exponentialRampToValueAtTime(70, now + duration);

      harmOsc.frequency.setValueAtTime(220, now);
      harmOsc.frequency.exponentialRampToValueAtTime(880, now + 1.1);
      harmOsc.frequency.exponentialRampToValueAtTime(330, now + duration);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 1.2);
      filter.frequency.exponentialRampToValueAtTime(300, now + duration);
      filter.Q.value = 3.5;

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      subOsc.connect(gain);
      harmOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      subOsc.start(now);
      harmOsc.start(now);

      osc.stop(now + duration);
      subOsc.stop(now + duration);
      harmOsc.stop(now + duration);
    } catch (e) {
      console.warn('Electric audio synthesizer error:', e);
    }
  }

  /**
   * Engine-specific tuned Web Audio Synthesizer fallback
   */
  playTunedSynthesizer(engineType = 'default') {
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const duration = 2.8;

      let baseFreq = 85;
      let peakFreq = 380;
      let filterFreq = 3200;

      if (engineType.includes('gt3') || engineType.includes('porsche')) {
        // High revving 9000 RPM Flat-6 scream
        baseFreq = 125;
        peakFreq = 620;
        filterFreq = 4800;
      } else if (engineType.includes('revuelto') || engineType.includes('v12')) {
        // Piercing V12 shriek
        baseFreq = 110;
        peakFreq = 540;
        filterFreq = 4200;
      } else if (engineType.includes('chiron') || engineType.includes('cullinan')) {
        // Heavy bass W16 / V12 rumble
        baseFreq = 65;
        peakFreq = 310;
        filterFreq = 2400;
      }

      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const osc3 = this.audioCtx.createOscillator();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc3.type = 'sawtooth';

      [osc1, osc2].forEach((osc) => {
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(peakFreq, now + 0.6);
        osc.frequency.exponentialRampToValueAtTime(peakFreq * 1.15, now + 1.1);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, now + 1.9);
        osc.frequency.exponentialRampToValueAtTime(baseFreq, now + duration);
      });

      osc3.frequency.setValueAtTime(baseFreq * 1.5, now);
      osc3.frequency.exponentialRampToValueAtTime(peakFreq * 1.8, now + 0.8);
      osc3.frequency.exponentialRampToValueAtTime(baseFreq, now + duration);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(filterFreq, now + 0.7);
      filter.frequency.exponentialRampToValueAtTime(650, now + duration);

      const gainNode = this.audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.01, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.2);
      gainNode.gain.linearRampToValueAtTime(0.38, now + 0.7);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + duration);
      osc2.stop(now + duration);
      osc3.stop(now + duration);
    } catch (err) {
      console.warn('Synthesizer error:', err);
    }
  }
}

export const engineSound = new MultiEngineSoundManager();
