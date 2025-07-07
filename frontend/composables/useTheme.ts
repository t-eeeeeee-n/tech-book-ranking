export const useTheme = () => {
  const isDark = ref(false)
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
  }
  
  const updateTheme = () => {
    if (process.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }
  
  const initTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme')
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      isDark.value = savedTheme ? savedTheme === 'dark' : systemPrefersDark
      updateTheme()
    }
  }
  
  onMounted(() => {
    initTheme()
    
    // Listen for system theme changes
    if (process.client) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          isDark.value = e.matches
          updateTheme()
        }
      })
    }
  })
  
  return {
    isDark: readonly(isDark),
    toggleTheme
  }
}