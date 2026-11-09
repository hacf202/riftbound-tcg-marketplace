// Web Audio API Synthesizer for TCG Booster Pack Opening Effects
// 100% Native Browser - Zero External Files or Dependencies

let audioCtx = null;
let isMuted = localStorage.getItem('rift_audio_muted') === 'true';

const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const getAudioMuted = () => isMuted;

export const setAudioMuted = (muted) => {
  isMuted = muted;
  localStorage.setItem('rift_audio_muted', muted ? 'true' : 'false');
};

export const toggleAudioMuted = () => {
  setAudioMuted(!isMuted);
  return isMuted;
};

// 1. Pack Shake & Energy Charge (Deep Hum)
export const playChargeHum = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 1.2);

    // Lowpass filter to give heavy magic vibration
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.25);
  } catch (e) {
    console.debug('Audio not available:', e);
  }
};

// 2. Foil Tear / Laser Slice Sound (White Noise Burst)
export const playFoilTear = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.45; // 450ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Bandpass sweep to mimic tearing paper/foil
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1200, ctx.currentTime);
    bandpass.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.4);
    bandpass.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    whiteNoise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
  } catch (e) {
    console.debug('Audio not available:', e);
  }
};

// 3. Crisp Card Flip Snap
export const playCardFlip = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {
    console.debug('Audio not available:', e);
  }
};

// 4. Rarity Reveal Fanfare (Pentatonic Harmony)
export const playRarityFanfare = (rarity) => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    let notes = [261.63, 329.63]; // Common: C4, E4
    let duration = 0.3;

    if (rarity === 'Rare') {
      notes = [329.63, 392.0, 523.25]; // E4, G4, C5
      duration = 0.5;
    } else if (rarity === 'Epic') {
      notes = [392.0, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
      duration = 0.7;
    } else if (rarity === 'Legendary' || rarity === 'Mythic') {
      notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6 (Royal Shimmer)
      duration = 1.1;
    }

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = rarity === 'Legendary' || rarity === 'Mythic' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      const startTime = ctx.currentTime + idx * 0.08;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  } catch (e) {
    console.debug('Audio not available:', e);
  }
};
