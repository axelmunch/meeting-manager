import { useState } from 'react'

import { GameLayout } from 'components/GameLayout/GameLayout'
import { ActorsList } from 'components/ActorsList/ActorsList'
import { ActorInformation } from 'components/ActorInformation/ActorInformation'
import { MeetingReport } from 'components/MeetingReport/MeetingReport'
import type { Actor } from 'game/types'
import { useGame } from 'hooks/useGame'

import styles from './MeetingPreparationScreen.module.css'

export const MeetingPreparationScreen: React.FC = () => {
  const { send, context } = useGame()

  const [selectedActorId, setSelectedActorId] = useState<Actor['id']>(
    context.gameSubject.actors[0].id
  )

  const hasMeetingReports = context.meetingReports.length > 0

  return (
    <GameLayout
      title='Préparation de la réunion'
      nextButton={{
        title: 'Passer à la réunion',
        onClick: () => {
          send({ type: 'goToMeeting' })
        }
      }}
    >
      {hasMeetingReports ? (
        <MeetingReport
          className={styles.meetingPreparationReport}
          turn={context.currentTurn - 1}
          meetingReport={
            context.meetingReports[context.meetingReports.length - 1]
          }
        />
      ) : null}
      <ActorsList
        selectedActorId={selectedActorId}
        onActorSelection={(newSelectedActorId) => {
          setSelectedActorId(newSelectedActorId)
        }}
      />
      <ActorInformation selectedActorId={selectedActorId} />
    </GameLayout>
  )
}
