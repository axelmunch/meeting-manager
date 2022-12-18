import { ActorItem } from 'components/ActorsMeeting/ActorItem/ActorItem'
import { Button } from 'components/design/Button/Button'
import { Gauges } from 'components/Gauges/Gauges'
import { MeetingReport } from 'components/MeetingReport/MeetingReport'
import type { GameState } from 'game/types'
import { useGame } from 'hooks/useGame'

import styles from './EndGame.module.css'

export interface EndGameProps {
  state: GameState.VICTORY | GameState.DEFEAT
}

export const EndGame: React.FC<EndGameProps> = (props) => {
  const { context, send } = useGame()

  return (
    <main className={styles.main}>
      <h1>{props.state}</h1>
      <p>
        Tour {context.currentTurn} / {context.totalTurns}
      </p>
      <Button
        onClick={() => {
          send({ type: 'restart' })
        }}
        variant={'action'}
      >
        Recommencer
      </Button>
      <ul className={styles.actorsList}>
        {context.gameSubject.actors.map((actor) => {
          return (
            <ActorItem
              key={actor.id}
              actor={actor}
              left={actor.projectSatisfaction === 0}
              className={styles.actorItem}
            />
          )
        })}
      </ul>
      <Gauges />
      {context.meetingReports.map((meetingReport, index) => {
        return (
          <MeetingReport
            key={index}
            turn={index + 1}
            meetingReport={meetingReport}
          />
        )
      })}
    </main>
  )
}
