import classNames from 'clsx'

import type { MeetingReport as MeetingReportType } from 'game/types'
import { useGame } from 'hooks/useGame'

import styles from './MeetingReport.module.css'

export interface MeetingReportProps {
  turn: number
  meetingReport: MeetingReportType
  className?: string
}

export const MeetingReport: React.FC<MeetingReportProps> = (props) => {
  const { turn, meetingReport, className } = props

  const { context } = useGame()

  return (
    <div className={classNames(styles.meetingReport, className)}>
      <h2 className={styles.miniTitle}>
        Compte-rendu de la réunion (tour n°{turn})
      </h2>
      <h3>Temps de parole :</h3>
      <ul className={styles.actorSpeakTimes}>
        {Object.values(meetingReport).map((actorSpeakTime, index) => {
          const actor = context.gameSubject.actors.find((actor) => {
            return actor.id === Object.keys(meetingReport)[index]
          })
          if (actor != null && actorSpeakTime != null) {
            return (
              <li key={actor.id} className={styles.actorElement}>
                <div className={styles.speakTimeGauge}>
                  <div
                    style={{ height: actorSpeakTime.toString() + '%' }}
                  ></div>
                </div>
                <p>
                  {actorSpeakTime}%
                  <br />
                  {actor.name}
                </p>
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}
