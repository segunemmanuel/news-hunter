<template>
  <!-- Full-screen mood tint -->
  <div class="mood-tint" :class="mood" />

  <!-- Particle canvas -->
  <canvas ref="canvas" class="particles-canvas" />

  <!-- Floating emoji burst -->
  <TransitionGroup name="emoji" tag="div" class="emoji-layer">
    <span
      v-for="e in floatingEmojis"
      :key="e.id"
      class="floating-emoji"
      :style="{ left: e.x + 'px', top: e.y + 'px', fontSize: e.size + 'px', animationDuration: e.dur + 's' }"
    >{{ e.char }}</span>
  </TransitionGroup>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  mood: { type: String, default: 'neutral' },
  active: { type: Boolean, default: false },
})

const canvas = ref(null)
const floatingEmojis = ref([])
let ctx2d = null
let raf = null
let particles = []
let emojiTimer = null
let emojiId = 0

// ── Particle system ──────────────────────────────────────────────
class Particle {
  constructor(mood) {
    this.reset(mood)
  }
  reset(mood) {
    this.mood = mood
    if (mood === 'sad') {
      // Rain drops
      this.x = Math.random() * window.innerWidth
      this.y = -20
      this.vx = -0.5 + Math.random() * 0.3
      this.vy = 6 + Math.random() * 6
      this.w = 1.5
      this.h = 12 + Math.random() * 12
      this.opacity = 0.3 + Math.random() * 0.5
      this.color = `rgba(120,160,255,${this.opacity})`
    } else if (mood === 'happy') {
      // Confetti / sparkle
      this.x = Math.random() * window.innerWidth
      this.y = -20
      this.vx = -2 + Math.random() * 4
      this.vy = 1.5 + Math.random() * 3
      this.size = 5 + Math.random() * 8
      this.rot = Math.random() * 360
      this.rotV = -2 + Math.random() * 4
      this.opacity = 0.8 + Math.random() * 0.2
      const colors = ['#FFD700','#FF6B6B','#4ECDC4','#FFE66D','#A8E6CF','#FF8B94','#C7B8FF']
      this.color = colors[Math.floor(Math.random() * colors.length)]
      this.shape = Math.random() > 0.5 ? 'rect' : 'circle'
    } else {
      // Neutral — soft cyan sparkles
      this.x = Math.random() * window.innerWidth
      this.y = Math.random() * window.innerHeight
      this.vx = -0.3 + Math.random() * 0.6
      this.vy = -0.5 - Math.random() * 0.5
      this.size = 1 + Math.random() * 2.5
      this.opacity = Math.random()
      this.life = 0
      this.maxLife = 60 + Math.random() * 80
      this.color = '#00d4ff'
    }
  }
  update() {
    this.x += this.vx
    this.y += this.vy
    if (this.mood === 'happy') {
      this.rot += this.rotV
      this.vy += 0.04 // gravity
    }
    if (this.mood === 'neutral') {
      this.life++
      this.opacity = Math.sin((this.life / this.maxLife) * Math.PI) * 0.6
    }
    const offscreen = this.y > window.innerHeight + 40 || this.x < -40 || this.x > window.innerWidth + 40
    const dead = this.mood === 'neutral' && this.life >= this.maxLife
    return offscreen || dead
  }
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    if (this.mood === 'sad') {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.w, this.h)
    } else if (this.mood === 'happy') {
      ctx.translate(this.x, this.y)
      ctx.rotate(this.rot * Math.PI / 180)
      ctx.fillStyle = this.color
      if (this.shape === 'circle') {
        ctx.beginPath()
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6)
      }
    } else {
      ctx.fillStyle = this.color
      ctx.shadowBlur = 6
      ctx.shadowColor = '#00d4ff'
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}

const PARTICLE_COUNT = { happy: 80, sad: 140, neutral: 30 }

function spawnParticles(mood) {
  const n = PARTICLE_COUNT[mood] || 0
  particles = Array.from({ length: n }, () => new Particle(mood))
}

function loop() {
  if (!canvas.value || !ctx2d) return
  ctx2d.clearRect(0, 0, canvas.value.width, canvas.value.height)
  particles = particles.filter(p => {
    const dead = p.update()
    if (!dead) p.draw(ctx2d)
    return !dead
  })
  // Replenish continuous effects
  if (props.mood === 'sad' && particles.length < PARTICLE_COUNT.sad) {
    particles.push(...Array.from({ length: 3 }, () => new Particle('sad')))
  } else if (props.mood === 'happy' && particles.length < PARTICLE_COUNT.happy) {
    particles.push(...Array.from({ length: 2 }, () => new Particle('happy')))
  } else if (props.mood === 'neutral' && particles.length < PARTICLE_COUNT.neutral) {
    particles.push(new Particle('neutral'))
  }
  raf = requestAnimationFrame(loop)
}

// ── Floating emoji burst ────────────────────────────────────────
const moodEmojis = {
  happy:   ['🎉','🌟','✨','🏆','🎊','💛','🥳','🎶'],
  sad:     ['😔','💧','🌧️','💔','😢','🌫️'],
  neutral: ['🌍','📰','🔎','🌐'],
}

function burstEmojis(mood) {
  clearInterval(emojiTimer)
  if (mood === 'neutral') return
  const chars = moodEmojis[mood]
  function addEmoji() {
    const e = {
      id: emojiId++,
      char: chars[Math.floor(Math.random() * chars.length)],
      x: 60 + Math.random() * (window.innerWidth - 120),
      y: window.innerHeight - 60,
      size: 22 + Math.random() * 20,
      dur: 3 + Math.random() * 2,
    }
    floatingEmojis.value.push(e)
    setTimeout(() => {
      floatingEmojis.value = floatingEmojis.value.filter(f => f.id !== e.id)
    }, e.dur * 1000)
  }
  addEmoji()
  emojiTimer = setInterval(addEmoji, mood === 'happy' ? 800 : 1400)
}

// ── Resize ──────────────────────────────────────────────────────
function resize() {
  if (canvas.value) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
  }
}

onMounted(() => {
  ctx2d = canvas.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  loop()
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  clearInterval(emojiTimer)
  window.removeEventListener('resize', resize)
})

watch(() => props.mood, (mood) => {
  particles = []
  floatingEmojis.value = []
  clearInterval(emojiTimer)
  if (props.active || mood !== 'neutral') {
    spawnParticles(mood)
    burstEmojis(mood)
  }
}, { immediate: true })

watch(() => props.active, (v) => {
  if (v) {
    spawnParticles(props.mood)
    burstEmojis(props.mood)
  } else {
    particles = []
    floatingEmojis.value = []
    clearInterval(emojiTimer)
  }
})
</script>

<style scoped>
.mood-tint {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  transition: background 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.mood-tint.happy {
  background:
    radial-gradient(ellipse at 20% 80%, rgba(255,215,0,0.10) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 20%, rgba(255,140,0,0.07) 0%, transparent 40%);
}
.mood-tint.sad {
  background:
    radial-gradient(ellipse at 50% 30%, rgba(50,70,140,0.18) 0%, transparent 60%),
    linear-gradient(180deg, rgba(20,30,70,0.2) 0%, transparent 80%);
}
.mood-tint.neutral {
  background: radial-gradient(ellipse at 30% 70%, rgba(0,212,255,0.06) 0%, transparent 50%);
}

.particles-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.emoji-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  overflow: hidden;
}

.floating-emoji {
  position: absolute;
  animation: float-up linear both;
  user-select: none;
}
.emoji-enter-active { animation: float-up linear; }
.emoji-leave-active { display: none; }

@keyframes float-up {
  0%   { transform: translateY(0) scale(0.5); opacity: 0; }
  10%  { opacity: 1; transform: translateY(-30px) scale(1); }
  90%  { opacity: 0.7; }
  100% { transform: translateY(-280px) scale(0.8); opacity: 0; }
}
</style>
