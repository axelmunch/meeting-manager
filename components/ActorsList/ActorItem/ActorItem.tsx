import classNames from 'clsx'

import type { Actor } from 'game/types'
import { Satisfaction } from 'components/Satisfaction/Satisfaction'
import { useGame } from 'hooks/useGame'

import styles from './ActorItem.module.css'

export interface ActorItemProps {
  actor: Actor
  isSelected?: boolean
  onClick?: React.MouseEventHandler<HTMLLIElement>
}

export const ActorItem: React.FC<ActorItemProps> = (props) => {
  const { actor, isSelected = false, onClick } = props
  const { context } = useGame()

  const leftProject = actor.projectSatisfaction === 0

  const inConflict =
    context.actorsConflict != null &&
    (context.actorsConflict[0] === actor.id ||
      context.actorsConflict[1] === actor.id) &&
    !leftProject

  return (
    <li
      onClick={onClick}
      className={classNames(styles.actorItem, 'selected-cursor', {
        [styles.actorSelected]: isSelected,
        [styles.actorConflict]: inConflict,
        [styles.actorLeftProject]: leftProject
      })}
    >
      <h1 className={styles.title}>
        <Satisfaction satisfaction={actor.projectSatisfaction} />
        {actor.name}
      </h1>
      <p>{actor.jobTitle}</p>
      {inConflict ? <p className={styles.text}>En conflit</p> : null}
      {leftProject ? <p className={styles.text}>A quitté</p> : null}
    </li>
  )
}
