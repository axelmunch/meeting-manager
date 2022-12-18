import { useEffect, useMemo, useState } from 'react'

import { Button } from 'components/design/Button/Button'
import { useGame } from 'hooks/useGame'
import { GameState } from 'game/types'
import { findAndMap } from 'tools/findAndMap'

import styles from './TutorialPopup.module.css'

const meetingPreparationMessages = [
  'La co‑construction est une méthode de travail qui permet de faire collaborer des acteurs de plusieurs domaines. Vous êtes responsable de la gestion des temps de parole des %actors.length% acteurs de ce projet de co‑construction pendant %totalTurns% réunions.',
  'Chaque acteur opère dans des domaines différents. Pendant les réunions, les acteurs vont influencer les jauges de leurs domaines en fonction de leurs temps de parole. Les jauges doivent être maintenues le plus haut possible jusqu’à la fin du projet de co‑construction. Si une jauge se vide, vous perdez la partie.',
  'Dans la phase de préparation, avant chaque réunion, vous pouvez motiver un acteur pour augmenter son temps de parole, modérer son temps de parole pour qu’il parle moins ou régler un conflit, si applicable. Une seule de ces actions est possible par tour.'
]

const meetingMessages = [
  'Lors d’une réunion, vous pouvez voir dans la discussion quel acteur parle et en quelle quantité. Attendre pendant une réunion est optionnel. Vous aurez un rapport des temps de parole au prochain tour.'
]

const conflictMessages = [
  'Deux acteurs sont entrés en conflit ! Leur satisfaction va diminuer tant que le conflit n’est pas résolu. Ils risquent de quitter le projet.'
]

export const TutorialPopup: React.FC = () => {
  const { context, state } = useGame()
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  const messages = useMemo(() => {
    if (context.currentTurn === 1 && state === GameState.MEETING_PREPARATION) {
      const meetingPreparationRawMessages = [...meetingPreparationMessages]
      meetingPreparationRawMessages[0] = findAndMap(
        meetingPreparationRawMessages[0],
        {
          '%actors.length%': context.gameSubject.actors.length,
          '%totalTurns%': context.totalTurns
        }
      )
      return meetingPreparationRawMessages
    }
    if (context.currentTurn === 1 && state === GameState.MEETING) {
      return meetingMessages
    }
    if (
      context.actorsConflict != null &&
      context.actorsResolvedConflicts.length === 0 &&
      state === GameState.MEETING_PREPARATION
    ) {
      return conflictMessages
    }
    return []
  }, [context, state])

  useEffect(() => {
    setCurrentMessageIndex(0)
  }, [])

  const message = messages[currentMessageIndex]

  const handleNextMessage = (): void => {
    setCurrentMessageIndex((currentMessageIndex) => {
      return currentMessageIndex + 1
    })
  }

  if (message == null) {
    return null
  }

  return (
    <section className={styles.tutorialPopup}>
      <h4 className={styles.title}>Tutoriel</h4>
      <p>{message}</p>
      <Button variant='tutorial' onClick={handleNextMessage}>
        {currentMessageIndex === messages.length - 1 ? 'Fermer' : 'Suivant'}
      </Button>
    </section>
  )
}
