import { useMemo } from 'react'
import classNames from 'clsx'

import { useGame } from 'hooks/useGame'
import type { Actor } from 'game/types'
import { Button } from 'components/design/Button/Button'
import { Satisfaction } from 'components/Satisfaction/Satisfaction'
import { getAverageValue } from 'tools/getAverageValue'

import styles from './ActorInformation.module.css'

export interface ActorInformationProps {
  selectedActorId: Actor['id']
}

export const ActorInformation: React.FC<ActorInformationProps> = (props) => {
  const { selectedActorId } = props

  const { send, can, context } = useGame()

  const selectedActor = useMemo(() => {
    return context.gameSubject.actors.find((actor) => {
      return actor.id === selectedActorId
    })
  }, [selectedActorId, context.gameSubject.actors])

  let selectedActorMotivateAction = ''
  if (selectedActor?.motivateAction != null) {
    selectedActorMotivateAction = selectedActor?.motivateAction
  }

  const hasMeetingReports = context.meetingReports.length > 0

  const averageSpeakRatio = useMemo(() => {
    if (!hasMeetingReports) {
      return 0
    }
    const speakRatios = []
    for (const meetingReport of context.meetingReports) {
      speakRatios.push(meetingReport[selectedActorId])
    }
    return getAverageValue(speakRatios)
  }, [hasMeetingReports, selectedActorId, context.meetingReports])

  const canResolveConflict = useMemo(() => {
    return can({
      type: 'resolveConflict',
      actorId: selectedActorId
    })
  }, [can, selectedActorId])

  if (selectedActor == null) {
    return null
  }

  const leftProject = selectedActor.projectSatisfaction === 0

  return (
    <section className={styles.actorActionsContainer}>
      <div className={styles.actorInfos}>
        <div className={styles.topPart}>
          <img
            src={selectedActor.avatar}
            alt='Avatar'
            className={styles.avatar}
          />
          <div className={styles.title}>
            <h2>{selectedActor.name}</h2>
            <Satisfaction satisfaction={selectedActor.projectSatisfaction} />
            <ul>
              <li>
                <p className={styles.bold}>{selectedActor.jobTitle}</p>
              </li>
              <li>
                <p>{selectedActor.description}</p>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomPart}>
          <section>
            <ul>
              <li>
                <p>
                  Domaines :{' '}
                  <span className={styles.bold}>
                    {selectedActor.domains.join(', ')}
                  </span>
                </p>
              </li>
              {hasMeetingReports ? (
                <li>
                  <p>
                    Temps de parole moyen :{' '}
                    <span className={styles.bold}>
                      {Math.round(averageSpeakRatio)}%
                    </span>
                  </p>
                </li>
              ) : null}
            </ul>
          </section>
          <section className={styles.actorActions}>
            <div>
              <div
                className={classNames(styles.motivate, {
                  [styles.motivateAction]: selectedActor.motivateAction != null
                })}
              >
                <Button
                  disabled={context.hasPlayedCurrentTurn || leftProject}
                  onClick={() => {
                    send({ type: 'motivate', actorId: selectedActorId })
                  }}
                >
                  Motiver
                </Button>
                <p>{selectedActorMotivateAction}</p>
              </div>
            </div>
            <Button
              disabled={context.hasPlayedCurrentTurn || leftProject}
              onClick={() => {
                send({ type: 'demotivate', actorId: selectedActorId })
              }}
            >
              Modérer le temps de parole
            </Button>
            <Button
              disabled={!canResolveConflict || leftProject}
              variant={canResolveConflict ? 'conflict' : undefined}
              onClick={() => {
                send({ type: 'resolveConflict', actorId: selectedActorId })
              }}
            >
              Régler un conflit
            </Button>
          </section>
        </div>
      </div>
      {/* <Button disabled>Recruter expert co-construction</Button> */}
    </section>
  )
}
