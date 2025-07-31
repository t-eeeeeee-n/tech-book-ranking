export const useTheme = () => {
  const isDark = ref(false)

  // ダークモードの状態を確認
  const checkDarkMode = () => {
    if (import.meta.client) {
      // localStorage から設定を読み込み
      const stored = localStorage.getItem('theme')
      if (stored) {
        isDark.value = stored === 'dark'
      } else {
        // システムの設定を確認
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      
      // HTML要素にクラスを適用
      updateDarkModeClass()
    }
  }

  // HTML要素のダークモードクラスを更新
  const updateDarkModeClass = () => {
    if (import.meta.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // テーマを切り替え
  const toggleTheme = () => {
    isDark.value = !isDark.value
    
    if (import.meta.client) {
      // localStorage に保存
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
      
      // HTML要素のクラスを更新
      updateDarkModeClass()
    }
  }

  // テーマを直接設定
  const setTheme = (theme: 'light' | 'dark') => {
    isDark.value = theme === 'dark'
    
    if (import.meta.client) {
      localStorage.setItem('theme', theme)
      updateDarkModeClass()
    }
  }

  // 初期化
  onMounted(() => {
    checkDarkMode()
    
    // システムテーマの変更を監視
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // ユーザーが手動で設定していない場合のみシステム設定に従う
      const stored = localStorage.getItem('theme')
      if (!stored) {
        isDark.value = e.matches
        updateDarkModeClass()
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // クリーンアップ
    onBeforeUnmount(() => {
      mediaQuery.removeEventListener('change', handleChange)
    })
  })

  return {
    isDark: computed(() => isDark.value),
    toggleTheme,
    setTheme
  }
}