const POSITIVE = [
  'win', 'wins', 'won', 'victory', 'celebrate', 'celebration', 'success', 'successful',
  'award', 'awards', 'awarded', 'breakthrough', 'record', 'achieve', 'achievement',
  'peace', 'hope', 'recover', 'recovery', 'rescue', 'rescued', 'hero', 'heroes',
  'oscar', 'oscars', 'emmy', 'grammy', 'champion', 'championship', 'medal', 'prize',
  'joy', 'joyful', 'happy', 'happiness', 'love', 'wonderful', 'amazing', 'great',
  'growth', 'growing', 'increase', 'rise', 'rises', 'boom', 'profit', 'gain', 'gains',
  'cure', 'cured', 'healed', 'saved', 'safe', 'relief', 'free', 'freed', 'agreement',
  'deal', 'milestone', 'historic', 'historic', 'launch', 'innovation', 'discover',
  'best', 'top', 'first', 'celebrate', 'festival', 'concert', 'premiere', 'gold',
]

const NEGATIVE = [
  'war', 'wars', 'attack', 'attacks', 'attacked', 'kill', 'killed', 'killing',
  'death', 'deaths', 'dead', 'die', 'died', 'dies', 'crash', 'crashed',
  'disaster', 'tragedy', 'tragic', 'crisis', 'conflict', 'violence', 'violent',
  'bomb', 'bombing', 'explosion', 'explode', 'fire', 'fires', 'flood', 'flooding',
  'earthquake', 'hurricane', 'tornado', 'tsunami', 'storm', 'devastate', 'devastated',
  'murder', 'murdered', 'crime', 'criminal', 'arrest', 'arrested', 'guilty', 'convicted',
  'prison', 'recession', 'bankrupt', 'bankruptcy', 'collapse', 'collapsed', 'fail',
  'scandal', 'corrupt', 'corruption', 'fraud', 'abuse', 'threat', 'threaten', 'warning',
  'terror', 'terrorist', 'shooting', 'shot', 'injured', 'injury', 'emergency', 'danger',
  'dangerous', 'hostile', 'protest', 'riot', 'unrest', 'tension', 'tensions',
  'missing', 'lost', 'loss', 'strike', 'ban', 'banned', 'sanction', 'sanctions',
]

export function analyzeSentiment(text) {
  if (!text) return 'neutral'
  const lower = text.toLowerCase()
  let score = 0
  POSITIVE.forEach(w => { if (lower.includes(w)) score++ })
  NEGATIVE.forEach(w => { if (lower.includes(w)) score-- })
  if (score > 0) return 'positive'
  if (score < 0) return 'negative'
  return 'neutral'
}

export function getOverallMood(articles) {
  if (!articles.length) return 'neutral'
  const total = articles.reduce((acc, a) => {
    return acc + (a.sentiment === 'positive' ? 1 : a.sentiment === 'negative' ? -1 : 0)
  }, 0)
  const avg = total / articles.length
  if (avg >= 0.4) return 'happy'
  if (avg <= -0.4) return 'sad'
  return 'neutral'
}
