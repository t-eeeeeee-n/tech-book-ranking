// ObjectIdの代替実装（クライアントサイド用）
function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16)
  const randomBytes = Math.random().toString(16).substr(2, 16)
  return timestamp + randomBytes.padEnd(16, '0')
}

interface UserSession {
  id: string
  createdAt: string
}

export const useUserSession = () => {
  const userSession = ref<UserSession | null>(null)

  // ユーザーセッションを取得（なければ生成）
  const getUserSession = (): UserSession => {
    if (userSession.value) {
      return userSession.value
    }

    if (typeof window !== 'undefined') {
      // ローカルストレージからユーザーセッションを取得
      const storedSession = localStorage.getItem('tech-book-user-session')

      if (storedSession) {
        try {
          const session = JSON.parse(storedSession) as UserSession
          userSession.value = session
          return session
        } catch (error) {
          // パースエラーの場合は新しいセッションを作成
          console.warn('Failed to parse user session, creating new one')
        }
      }

      // 新しいユーザーセッションを生成
      const newSession: UserSession = {
        id: generateObjectId(),
        createdAt: new Date().toISOString()
      }

      localStorage.setItem('tech-book-user-session', JSON.stringify(newSession))
      userSession.value = newSession
      return newSession
    }

    // サーバーサイドの場合は一時的なセッションを生成
    return {
      id: generateObjectId(),
      createdAt: new Date().toISOString()
    }
  }

  // ユーザーIDを取得
  const getUserId = (): string => {
    const session = getUserSession()
    return session.id
  }

  // セッションをクリア（テスト用）
  const clearUserSession = () => {
    userSession.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tech-book-user-session')
    }
  }

  // セッション情報を更新
  const refreshSession = () => {
    if (typeof window !== 'undefined') {
      const session = getUserSession()
      localStorage.setItem('tech-book-user-session', JSON.stringify(session))
    }
  }

  // 初期化
  onMounted(() => {
    getUserSession()
  })

  return {
    userSession: computed(() => userSession.value),
    getUserId,
    getUserSession,
    clearUserSession,
    refreshSession
  }
}