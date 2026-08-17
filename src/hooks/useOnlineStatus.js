import { useState, useEffect } from 'react'

/**
 * Hook pour détecter l'état de la connexion réseau
 * @returns {boolean} true si en ligne, false si hors ligne
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // eslint-disable-next-line no-console
      console.log('🟢 Application en ligne')
    }

    const handleOffline = () => {
      setIsOnline(false)
      // eslint-disable-next-line no-console
      console.log('⚪ Application hors ligne')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
