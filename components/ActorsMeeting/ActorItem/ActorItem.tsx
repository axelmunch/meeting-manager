import classNames from 'clsx'

import type { Actor } from 'game/types'
import { Satisfaction } from 'components/Satisfaction/Satisfaction'
import { ACTOR_BUBBLE_DIVIDER } from 'game/constants'
import { getRandomNumber } from 'tools/getRandomNumber'

import styles from './ActorItem.module.css'

export interface ActorItemProps {
  actor: Actor
  speakTime?: number
  left?: boolean
  className?: string
}

export const ActorItem: React.FC<ActorItemProps> = (props) => {
  const { actor, speakTime = 0, left = false, className } = props

  return (
    <li className={classNames(styles.actorItem, className)}>
      <Satisfaction satisfaction={actor.projectSatisfaction} />
      <img src={actor.avatar} alt='Actor Avatar' />
      <div className={styles.bubbleContainer}>
        {Array.from(
          new Array(Math.floor(speakTime / ACTOR_BUBBLE_DIVIDER)).keys()
        ).map((index) => {
          return (
            <div
              key={index}
              className={styles.bubble}
              style={{
                transform:
                  'translate(' +
                  getRandomNumber(-100, 100).toString() +
                  '%, ' +
                  getRandomNumber(20, 100).toString() +
                  '%)',
                animationDuration:
                  (getRandomNumber(15, 60) / 10).toString() + 's'
              }}
            ></div>
          )
        })}
      </div>
      {left ? <p className={styles.leftText}>A quitté</p> : <></>}
    </li>
  )
}
