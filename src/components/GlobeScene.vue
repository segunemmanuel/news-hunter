<template>
  <div ref="el" class="globe-wrapper" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { locations, newsArcs } from '../utils/locations.js'

const props = defineProps({
  mood: { type: String, default: 'neutral' },
  selectedLocation: { type: Object, default: null },
})

const emit = defineEmits(['locationClick'])

const el = ref(null)
let world = null
let resizeObs = null

const moodColors = {
  happy:   { point: '#FFD700', arc: ['rgba(255,215,0,0.8)', 'rgba(255,215,0,0)'], atm: 'gold' },
  sad:     { point: '#6B9FFF', arc: ['rgba(107,159,255,0.7)', 'rgba(107,159,255,0)'], atm: 'lightblue' },
  neutral: { point: '#00d4ff', arc: ['rgba(0,212,255,0.7)',  'rgba(0,212,255,0)'],  atm: 'lightskyblue' },
}

function getColors() { return moodColors[props.mood] || moodColors.neutral }

onMounted(async () => {
  // Dynamic import so it only runs client-side
  const GlobeLib = await import('globe.gl')
  const Globe = GlobeLib.default

  world = Globe()(el.value)
    // Real NASA Blue Marble textures from the three-globe package
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .atmosphereColor(getColors().atm)
    .atmosphereAltitude(0.22)
    .width(window.innerWidth)
    .height(window.innerHeight)

    // Location dots
    .pointsData(locations)
    .pointLat('lat')
    .pointLng('lng')
    .pointColor(() => getColors().point)
    .pointAltitude(0.04)
    .pointRadius(0.38)
    .pointResolution(12)
    .pointLabel(d =>
      `<div class="globe-tooltip">${d.flag} ${d.name} · ${d.city}</div>`
    )
    .onPointClick(d => {
      emit('locationClick', d)
      // Expanding ring effect at clicked location
      world.ringsData([{
        lat: d.lat,
        lng: d.lng,
        maxR: 4,
        propagationSpeed: 2.5,
        repeatPeriod: 900,
      }])
      setTimeout(() => world.ringsData([]), 6000)
    })
    .onPointHover(d => {
      if (el.value) el.value.style.cursor = d ? 'pointer' : 'default'
    })

    // Animated arcs connecting major news cities
    .arcsData(newsArcs)
    .arcStartLat('startLat')
    .arcStartLng('startLng')
    .arcEndLat('endLat')
    .arcEndLng('endLng')
    .arcColor(() => getColors().arc)
    .arcAltitudeAutoScale(0.4)
    .arcDashLength(0.35)
    .arcDashGap(0.12)
    .arcDashAnimateTime(2400)
    .arcStroke(0.5)

    // Rings (start empty)
    .ringsData([])
    .ringColor(() => getColors().point)
    .ringMaxRadius('maxR')
    .ringPropagationSpeed('propagationSpeed')
    .ringRepeatPeriod('repeatPeriod')

  // Enable auto-rotate and damping
  world.controls().autoRotate = true
  world.controls().autoRotateSpeed = 0.35
  world.controls().enableDamping = true
  world.controls().dampingFactor = 0.08

  // Responsive
  resizeObs = new ResizeObserver(() => {
    world.width(window.innerWidth).height(window.innerHeight)
  })
  resizeObs.observe(el.value)
})

// Update globe colors when mood changes
watch(() => props.mood, () => {
  if (!world) return
  const c = getColors()
  world
    .atmosphereColor(c.atm)
    .pointColor(() => c.point)
    .arcColor(() => c.arc)
    .ringColor(() => c.point)
})

onUnmounted(() => {
  resizeObs?.disconnect()
  world?._destructor?.()
})
</script>

<style scoped>
.globe-wrapper {
  position: fixed;
  inset: 0;
  z-index: 0;
}
</style>
