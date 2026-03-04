<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  target: number
  prefix?: string
  suffix?: string
  duration?: number
}>()

const display = ref(0)
const counterEl = ref<HTMLElement | null>(null)
const hasAnimated = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated.value) {
          hasAnimated.value = true
          animateCounter()
        }
      })
    },
    { threshold: 0.5 }
  )
  if (counterEl.value) observer.observe(counterEl.value)
})

function animateCounter() {
  const dur = props.duration || 2000
  const start = performance.now()
  const step = (now: number) => {
    const progress = Math.min((now - start) / dur, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    display.value = Math.round(eased * props.target)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
</script>

<template>
  <div ref="counterEl" class="counter-up">
    <span class="counter-value font-heading">
      {{ prefix }}{{ display }}{{ suffix }}
    </span>
    <span class="counter-label">
      <slot />
    </span>
  </div>
</template>

<style scoped lang="scss">
.counter-up {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 160px;
  border: 2px dashed rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  text-align: center;
}
.counter-value {
  font-size: 2.5rem;
  font-weight: 300;
  color: white;
  line-height: 1;
}
.counter-label {
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
}
</style>
