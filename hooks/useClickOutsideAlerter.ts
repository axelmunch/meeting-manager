import { useEffect } from 'react'

export const useClickOutsideAlerter = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const actorsListContainer = document.getElementById('actorsListContainer')
      if (
        event.target != null &&
        ref.current != null &&
        !ref.current.contains(event.target as Node) &&
        actorsListContainer != null &&
        !actorsListContainer.contains(event.target as Node)
      ) {
        callback()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}
