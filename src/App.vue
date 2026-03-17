<template>
  <div class="app" :class="mood">
    <!-- Background stars -->
    <div class="stars" aria-hidden="true">
      <span v-for="i in 180" :key="i" class="star" :style="starStyle(i)" />
    </div>

    <!-- 3D Globe -->
    <GlobeScene
      :mood="mood"
      :selected-location="selectedLocation"
      @location-click="onLocationClick"
    />

    <!-- Mood visual effects + particles -->
    <MoodEffects :mood="mood" :active="panelOpen" />

    <!-- Top header bar -->
    <header class="header" :class="mood">
      <div class="logo">
        <div class="logo-orb" :class="mood">🌍</div>
        <span class="logo-text">NEWS<em>HUNTER</em></span>
      </div>

      <div class="header-right">
        <div class="live-badge">
          <span class="live-dot" />
          LIVE
        </div>
        <div class="mood-pill" :class="mood">
          <span class="mood-emoji-header">{{ moodConfig[mood].icon }}</span>
          <span>{{ moodConfig[mood].label }}</span>
        </div>
      </div>
    </header>

    <!-- Instruction hint (hidden when panel open) -->
    <Transition name="hint">
      <div v-if="!panelOpen" class="hint-bar">
        <div class="hint-inner">
          <span class="hint-icon">👆</span>
          <span>Click any glowing marker to explore local news</span>
          <span class="hint-sep">·</span>
          <span>Drag to rotate the globe</span>
        </div>
      </div>
    </Transition>

    <!-- News panel -->
    <NewsPanel
      :visible="panelOpen"
      :location="selectedLocation"
      :articles="articles"
      :is-loading="isLoading"
      :mood="mood"
      :using-mock="usingMock"
      @close="closePanel"
    />

    <!-- Audio button -->
    <button class="audio-btn" :class="{ muted: isMuted }" @click="toggleAudio" :title="isMuted ? 'Enable mood music' : 'Mute'">
      <template v-if="isMuted">
        <span class="audio-icon">🔇</span>
      </template>
      <template v-else>
        <div class="waves">
          <span v-for="i in 5" :key="i" class="wave" :class="mood" :style="{ animationDelay: (i * 0.09) + 's' }" />
        </div>
      </template>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import GlobeScene from './components/GlobeScene.vue'
import NewsPanel from './components/NewsPanel.vue'
import MoodEffects from './components/MoodEffects.vue'
import { useNews } from './composables/useNews.js'
import { useAudio } from './composables/useAudio.js'

const { articles, isLoading, mood: newsMood, usingMock, fetchNews } = useNews()
const { isMuted, toggle: toggleAudio, setMood: setAudioMood } = useAudio()

const selectedLocation = ref(null)
const panelOpen = ref(false)
const mood = ref('neutral')

const moodConfig = {
  happy:   { icon: '🎉', label: 'UPLIFTING' },
  sad:     { icon: '😔', label: 'SOMBER' },
  neutral: { icon: '🌐', label: 'EXPLORING' },
}

async function onLocationClick(location) {
  selectedLocation.value = location
  panelOpen.value = true
  await fetchNews(location)
}

function closePanel() {
  panelOpen.value = false
  mood.value = 'neutral'
  setAudioMood('neutral')
}

// Sync mood from news analysis
watch(newsMood, (m) => {
  if (panelOpen.value) {
    mood.value = m
    setAudioMood(m)
    // Apply CSS variable theme
    applyMoodTheme(m)
  }
})

watch(panelOpen, (open) => {
  if (!open) applyMoodTheme('neutral')
})

function applyMoodTheme(m) {
  const root = document.documentElement
  const themes = {
    happy:   { primary: '#FFD700', glow: 'rgba(255,215,0,0.35)' },
    sad:     { primary: '#6B9FFF', glow: 'rgba(107,159,255,0.35)' },
    neutral: { primary: '#00d4ff', glow: 'rgba(0,212,255,0.35)' },
  }
  const t = themes[m] || themes.neutral
  root.style.setProperty('--mood-primary', t.primary)
  root.style.setProperty('--mood-glow', t.glow)
}

// Star positions (seeded by index for consistency)
function starStyle(i) {
  const seed = i * 13.7
  return {
    left: ((seed * 7.3) % 100) + '%',
    top:  ((seed * 3.7) % 100) + '%',
    width:  (1 + (i % 3)) + 'px',
    height: (1 + (i % 3)) + 'px',
    animationDelay: ((seed * 0.3) % 4) + 's',
    animationDuration: (2 + (i % 3)) + 's',
    opacity: 0.15 + (i % 6) * 0.08,
  }
}
</script>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Star field */
.stars { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.star {
  position: absolute;
  border-radius: 50%;
  background: white;
  animation: twinkle ease-in-out infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50%       { opacity: 0.8;  transform: scale(1.4); }
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 22px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%);
  transition: all 1.2s ease;
}

.logo { display: flex; align-items: center; gap: 14px; }
.logo-orb {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--mood-primary, #00d4ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  animation: orb-pulse 3s ease-in-out infinite;
  transition: border-color 1.2s ease;
  box-shadow: 0 0 20px var(--mood-glow, rgba(0,212,255,0.3));
}
@keyframes orb-pulse {
  0%, 100% { box-shadow: 0 0 15px var(--mood-glow); }
  50%       { box-shadow: 0 0 35px var(--mood-glow), 0 0 60px var(--mood-glow); }
}
.logo-text {
  font-family: 'Space Mono', monospace;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 4px;
  color: white;
}
.logo-text em {
  font-style: normal;
  color: var(--mood-primary, #00d4ff);
  transition: color 1.2s ease;
}

.header-right { display: flex; align-items: center; gap: 14px; }

.live-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(255,50,50,0.12);
  border: 1px solid rgba(255,80,80,0.3);
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: #ff6b6b;
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff4444;
  animation: blink 1.2s ease-in-out infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }

.mood-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 18px;
  border-radius: 30px;
  background: rgba(6,15,30,0.7);
  backdrop-filter: blur(10px);
  border: 1px solid var(--mood-primary, #00d4ff);
  box-shadow: 0 0 16px var(--mood-glow, rgba(0,212,255,0.3));
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  transition: all 1.2s ease;
}
.mood-emoji-header { font-size: 16px; }

/* Hint bar */
.hint-bar {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}
.hint-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 30px;
  background: rgba(6,15,30,0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  white-space: nowrap;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.hint-icon { font-size: 16px; animation: float-hint 2s ease-in-out infinite; }
@keyframes float-hint {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
}
.hint-sep { opacity: 0.3; }

.hint-enter-active, .hint-leave-active { transition: all 0.5s ease; }
.hint-enter-from, .hint-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* Audio button */
.audio-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 400;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(6,15,30,0.85);
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,255,255,0.12);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}
.audio-btn:hover {
  transform: scale(1.1);
  border-color: var(--mood-primary, #00d4ff);
  box-shadow: 0 0 24px var(--mood-glow, rgba(0,212,255,0.3));
}
.audio-icon { font-size: 20px; }
.waves { display: flex; align-items: center; gap: 3px; height: 22px; }
.wave {
  width: 3px;
  border-radius: 3px;
  background: var(--mood-primary, #00d4ff);
  animation: wave-bounce 0.7s ease-in-out infinite alternate;
}
.wave:nth-child(1) { height: 8px; }
.wave:nth-child(2) { height: 16px; }
.wave:nth-child(3) { height: 12px; }
.wave:nth-child(4) { height: 20px; }
.wave:nth-child(5) { height: 9px; }
@keyframes wave-bounce {
  from { transform: scaleY(0.4); }
  to   { transform: scaleY(1); }
}
</style>
