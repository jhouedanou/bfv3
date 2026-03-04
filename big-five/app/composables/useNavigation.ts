import { ref } from 'vue'

const _goToSlide = ref<((index: number) => void) | null>(null)
const _activeIndex = ref(0)

export function useNavigation() {
  function registerSwiper(goFn: (index: number) => void) {
    _goToSlide.value = goFn
  }

  function goToSlide(index: number) {
    _goToSlide.value?.(index)
  }

  function setActiveIndex(index: number) {
    _activeIndex.value = index
  }

  return {
    registerSwiper,
    goToSlide,
    activeIndex: _activeIndex,
    setActiveIndex,
  }
}
