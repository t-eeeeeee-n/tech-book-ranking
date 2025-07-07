export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export function useDebounce<T>(value: Ref<T>, delay: number): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  
  watchEffect(() => {
    const handler = setTimeout(() => {
      debouncedValue.value = value.value
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  })
  
  return debouncedValue
}