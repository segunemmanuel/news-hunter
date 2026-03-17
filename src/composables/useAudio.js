import { ref } from 'vue'

export function useAudio() {
  const isMuted = ref(true)
  const isReady = ref(false)
  let ctx = null
  let activeNodes = []
  let loopTimer = null
  let currentMood = 'neutral'

  function init() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
      isReady.value = true
    }
    if (ctx.state === 'suspended') ctx.resume()
  }

  function makeReverb(duration = 2) {
    const convolver = ctx.createConvolver()
    const length = ctx.sampleRate * duration
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate)
    for (let i = 0; i < 2; i++) {
      const channel = impulse.getChannelData(i)
      for (let j = 0; j < length; j++) {
        channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2)
      }
    }
    convolver.buffer = impulse
    return convolver
  }

  function playNote(freq, time, duration, type = 'sine', vol = 0.07) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const reverb = makeReverb(1.5)

    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, time)
    gain.gain.linearRampToValueAtTime(vol, time + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration)

    osc.connect(gain)
    gain.connect(reverb)
    reverb.connect(ctx.destination)
    osc.start(time)
    osc.stop(time + duration + 0.1)
    activeNodes.push(osc)
  }

  function playHappyLoop() {
    if (isMuted.value || currentMood !== 'happy') return
    // C major pentatonic: C4 E4 G4 A4 C5
    const notes = [261.63, 329.63, 392.00, 440.00, 523.25]
    let t = ctx.currentTime
    // Ascending arpeggio
    notes.forEach((freq, i) => playNote(freq, t + i * 0.18, 0.6, 'triangle', 0.06))
    // Descend
    ;[...notes].reverse().forEach((freq, i) => playNote(freq, t + notes.length * 0.18 + i * 0.18, 0.5, 'sine', 0.04))

    loopTimer = setTimeout(playHappyLoop, (notes.length * 2 * 180) + 800)
  }

  function playSadLoop() {
    if (isMuted.value || currentMood !== 'sad') return
    // A minor descent: A3 G3 F3 E3 D3
    const notes = [220.00, 196.00, 174.61, 164.81, 146.83]
    let t = ctx.currentTime
    notes.forEach((freq, i) => {
      playNote(freq, t + i * 0.7, 1.8, 'sine', 0.06)
      // Add fifth harmony
      playNote(freq * 1.5, t + i * 0.7, 1.6, 'sine', 0.025)
    })
    loopTimer = setTimeout(playSadLoop, notes.length * 700 + 1200)
  }

  function playNeutralLoop() {
    if (isMuted.value || currentMood !== 'neutral') return
    // Gentle ambient drone in D
    const base = 146.83
    playNote(base, ctx.currentTime, 4, 'sine', 0.04)
    playNote(base * 2, ctx.currentTime + 0.5, 3, 'sine', 0.02)
    playNote(base * 3, ctx.currentTime + 1, 2.5, 'sine', 0.015)
    loopTimer = setTimeout(playNeutralLoop, 4500)
  }

  function stopAll() {
    clearTimeout(loopTimer)
    activeNodes.forEach(n => { try { n.stop() } catch {} })
    activeNodes = []
  }

  function setMood(mood) {
    if (!ctx || isMuted.value) return
    stopAll()
    currentMood = mood
    if (mood === 'happy') playHappyLoop()
    else if (mood === 'sad') playSadLoop()
    else playNeutralLoop()
  }

  function toggle() {
    init()
    isMuted.value = !isMuted.value
    if (isMuted.value) {
      stopAll()
    } else {
      setMood(currentMood)
    }
  }

  function unmutedSetMood(mood) {
    currentMood = mood
    if (!isMuted.value && ctx) setMood(mood)
  }

  return { isMuted, isReady, toggle, setMood: unmutedSetMood }
}
