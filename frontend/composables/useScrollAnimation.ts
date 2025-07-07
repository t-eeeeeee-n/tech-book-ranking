export const useScrollAnimation = () => {
  const observedElements = ref<Map<Element, IntersectionObserver>>(new Map())

  const observe = (element: Element, callback: () => void, options?: IntersectionObserverInit) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback()
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(element)
    observedElements.value.set(element, observer)
  }

  const unobserve = (element: Element) => {
    const observer = observedElements.value.get(element)
    if (observer) {
      observer.unobserve(element)
      observedElements.value.delete(element)
    }
  }

  const cleanup = () => {
    observedElements.value.forEach((observer) => {
      observer.disconnect()
    })
    observedElements.value.clear()
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    observe,
    unobserve,
    cleanup
  }
}