import { ActorItem } from 'components/ActorsMeeting/ActorItem/ActorItem'
import { useGame } from 'hooks/useGame'

import styles from './ActorsMeeting.module.css'

export const ActorsMeeting: React.FC = () => {
  const { context } = useGame()

  const meetingReport = context.meetingReports.at(-1)

  return (
    <section className={styles.actorsListContainer}>
      <ul className={styles.actorsList}>
        {context.gameSubject.actors.map((actor) => {
          if (actor.projectSatisfaction > 0) {
            return (
              <ActorItem
                key={actor.id}
                actor={actor}
                speakTime={meetingReport != null ? meetingReport[actor.id] : 0}
                className={styles.actorItem}
              />
            )
          }
        })}
      </ul>
    </section>
  )
}
