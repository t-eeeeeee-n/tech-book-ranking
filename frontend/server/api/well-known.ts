export default defineEventHandler((event) => {
  // Chrome DevTools の .well-known リクエストを静かに処理
  const url = getRouterParam(event, 'path')
  
  // DevTools関連のリクエストの場合、404を返す（ログは出力しない）
  if (url?.includes('com.chrome.devtools')) {
    setResponseStatus(event, 404)
    return null
  }
  
  // その他の .well-known リクエストも404を返す
  setResponseStatus(event, 404)
  return null
})