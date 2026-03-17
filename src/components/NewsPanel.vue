<template>
  <Transition name="panel">
    <div v-if="visible" class="panel" :class="mood">
      <!-- Header -->
      <div class="panel-header">
        <div class="panel-title">
          <span class="flag">{{ location?.flag }}</span>
          <div>
            <p class="city">{{ location?.city }}</p>
            <h2 class="country">{{ location?.name }}</h2>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')" aria-label="Close">✕</button>
      </div>

      <!-- Mood bar -->
      <div class="mood-bar" :class="mood">
        <span class="mood-icon">{{ moodConfig[mood].icon }}</span>
        <span class="mood-label">{{ moodConfig[mood].label }}</span>
        <div class="mood-dots">
          <span v-for="i in 3" :key="i" class="dot" :class="{ active: i <= moodConfig[mood].intensity }" />
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading-articles">
        <div v-for="i in 2" :key="i" class="skeleton" />
      </div>

      <!-- Articles -->
      <TransitionGroup v-else name="card" tag="div" class="articles">
        <component
          :is="item.url && item.url !== '#' ? 'a' : 'article'"
          v-for="(item, idx) in articles"
          :key="idx"
          class="card"
          :class="[item.sentiment, { 'card-link': item.url && item.url !== '#' }]"
          v-bind="item.url && item.url !== '#' ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' } : {}"
        >
          <div class="card-top">
            <span class="sentiment-badge" :class="item.sentiment">
              {{ sentimentIcon[item.sentiment] }} {{ item.sentiment }}
            </span>
            <span v-if="item.url && item.url !== '#'" class="read-more-badge">
              Read full story ↗
            </span>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-excerpt">{{ item.description }}</p>
          <div class="card-footer">
            <span class="source">
              <span class="dot-small" />
              {{ item.source }}
            </span>
            <span class="time">{{ item.publishedAt }}</span>
          </div>
        </component>
      </TransitionGroup>

      <!-- Demo mode notice -->
      <div v-if="usingMock && !isLoading" class="demo-notice">
        <span>📡</span>
        <span>Demo mode — add API key for live news</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  visible:   Boolean,
  location:  Object,
  articles:  Array,
  isLoading: Boolean,
  mood:      { type: String, default: 'neutral' },
  usingMock: Boolean,
})

defineEmits(['close'])

const sentimentIcon = { positive: '✨', negative: '⚠️', neutral: '📰' }

const moodConfig = {
  happy:   { icon: '🎉', label: 'Uplifting News',  intensity: 3 },
  sad:     { icon: '😔', label: 'Heavy News',       intensity: 3 },
  neutral: { icon: '🌐', label: 'Mixed Stories',    intensity: 1 },
}
</script>

<style scoped>
.panel {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: min(460px, 95vw);
  max-height: 82vh;
  overflow-y: auto;
  background: rgba(6, 15, 30, 0.92);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border-left: 1px solid rgba(255,255,255,0.08);
  border-top: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  border-radius: 24px 0 0 24px;
  padding: 36px 32px;
  z-index: 300;
  transition: box-shadow 1.2s ease;
}

.panel.happy  { box-shadow: -4px 0 60px rgba(255,215,0,0.12), inset 0 0 60px rgba(255,215,0,0.04); }
.panel.sad    { box-shadow: -4px 0 60px rgba(107,159,255,0.15), inset 0 0 60px rgba(107,159,255,0.05); }
.panel.neutral{ box-shadow: -4px 0 60px rgba(0,212,255,0.1); }

/* Panel slide transition */
.panel-enter-active, .panel-leave-active { transition: all 0.55s cubic-bezier(0.4, 0, 0.2, 1); }
.panel-enter-from, .panel-leave-to { transform: translateY(-50%) translateX(100%); opacity: 0; }

/* Header */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.panel-title { display: flex; align-items: center; gap: 16px; }
.flag { font-size: 44px; line-height: 1; }
.city {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.45);
  margin-bottom: 4px;
}
.country {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
}
.close-btn {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}
.close-btn:hover { background: rgba(255,255,255,0.15); transform: rotate(90deg); }

/* Mood bar */
.mood-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 14px;
  margin-bottom: 24px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.8s ease;
}
.mood-bar.happy  { background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.25); color: #FFD700; }
.mood-bar.sad    { background: rgba(107,159,255,0.1); border: 1px solid rgba(107,159,255,0.25); color: #8ab4ff; }
.mood-bar.neutral{ background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.2); color: #00d4ff; }
.mood-icon { font-size: 18px; }
.mood-label { flex: 1; }
.mood-dots { display: flex; gap: 5px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.15); transition: background 0.5s; }
.dot.active { background: currentColor; }

/* Skeleton */
.loading-articles { display: flex; flex-direction: column; gap: 16px; }
.skeleton {
  height: 130px;
  border-radius: 18px;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } }

/* Article cards */
.articles { display: flex; flex-direction: column; gap: 16px; }

.card-enter-active { transition: all 0.5s ease; }
.card-enter-from { opacity: 0; transform: translateX(20px); }

.card {
  padding: 22px;
  border-radius: 18px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  transition: all 0.35s ease;
  cursor: default;
}
.card:hover {
  background: rgba(255,255,255,0.07);
  transform: translateX(-6px);
}
.card.card-link {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
}
.card.card-link:hover {
  border-color: var(--mood-primary, #00d4ff);
  box-shadow: 0 0 20px var(--mood-glow, rgba(0,212,255,0.15));
}
.card.positive { border-left: 2px solid rgba(0,255,136,0.5); }
.card.negative { border-left: 2px solid rgba(255,82,82,0.5); }
.card.neutral  { border-left: 2px solid rgba(0,212,255,0.4); }

.card-top { margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.sentiment-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
}
.sentiment-badge.positive { background: rgba(0,200,100,0.18); color: #4dffaa; }
.sentiment-badge.negative { background: rgba(220,60,60,0.18); color: #ff9090; }
.sentiment-badge.neutral  { background: rgba(0,180,220,0.18); color: #60e0ff; }

.read-more-badge {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  color: #90d0ff;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}
.card-link:hover .read-more-badge { opacity: 1; }

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.45;
  margin-bottom: 10px;
}
.card-excerpt {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(255,255,255,0.52);
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  color: rgba(255,255,255,0.55);
}
.source { display: flex; align-items: center; gap: 7px; }
.dot-small { width: 5px; height: 5px; border-radius: 50%; background: var(--mood-primary, #00d4ff); flex-shrink: 0; }

/* Demo notice */
.demo-notice {
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px dashed rgba(255,255,255,0.12);
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  color: rgba(255,255,255,0.55);
  display: flex;
  gap: 10px;
  align-items: center;
  letter-spacing: 0.5px;
}
</style>
