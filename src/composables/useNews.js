import { ref } from 'vue'
import { analyzeSentiment, getOverallMood } from '../utils/sentiment.js'
import { getMockNews } from '../utils/mockNews.js'

const GNEWS_KEY  = import.meta.env.VITE_GNEWS_API_KEY
const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY

async function fetchGNews(country) {
  const url = `/api/gnews/api/v4/top-headlines?country=${country}&max=3&lang=en&token=${GNEWS_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GNews ${res.status}`)
  const data = await res.json()
  return (data.articles || []).map(a => ({
    title: a.title,
    description: a.description,
    source: a.source?.name || 'GNews',
    url: a.url,
    publishedAt: formatTime(a.publishedAt),
  }))
}

async function fetchNewsAPI(country) {
  const url = `/api/newsapi/v2/top-headlines?country=${country}&pageSize=3&apiKey=${NEWSAPI_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`NewsAPI ${res.status}`)
  const data = await res.json()
  return (data.articles || []).map(a => ({
    title: a.title,
    description: a.description,
    source: a.source?.name || 'NewsAPI',
    url: a.url,
    publishedAt: formatTime(a.publishedAt),
  }))
}

function formatTime(iso) {
  if (!iso) return 'Recently'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  return `${Math.floor(hrs / 24)} days ago`
}

export function useNews() {
  const articles = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const mood = ref('neutral')
  const usingMock = ref(false)

  async function fetchNews(location) {
    isLoading.value = true
    error.value = null
    articles.value = []
    usingMock.value = false

    try {
      let raw = []

      if (GNEWS_KEY && GNEWS_KEY !== 'your_gnews_api_key_here') {
        raw = await fetchGNews(location.country)
      } else if (NEWSAPI_KEY && NEWSAPI_KEY !== 'your_newsapi_key_here') {
        raw = await fetchNewsAPI(location.country)
      } else {
        raw = getMockNews(location)
        usingMock.value = true
      }

      const enriched = raw.map(a => ({
        ...a,
        sentiment: a.sentiment || analyzeSentiment(`${a.title} ${a.description || ''}`)
      }))

      articles.value = enriched.slice(0, 3)
      mood.value = getOverallMood(articles.value)
    } catch (err) {
      console.warn('News fetch failed, using demo data:', err.message)
      const fallback = getMockNews(location).map(a => ({
        ...a,
        sentiment: a.sentiment || analyzeSentiment(`${a.title} ${a.description}`)
      }))
      articles.value = fallback.slice(0, 3)
      mood.value = getOverallMood(articles.value)
      usingMock.value = true
    } finally {
      isLoading.value = false
    }
  }

  return { articles, isLoading, error, mood, usingMock, fetchNews }
}
