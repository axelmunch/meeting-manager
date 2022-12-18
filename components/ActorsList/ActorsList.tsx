import { useGame } from 'hooks/useGame'
import type { Actor } from 'game/types'

import { ActorItem } from './ActorItem/ActorItem'
import styles from './ActorsList.module.css'

export interface ActorsListProps {
  selectedActorId: Actor['id']
  onActorSelection?: (newSelectedActorId: Actor['id']) => void
}

export const ActorsList: React.FC<ActorsListProps> = (props) => {
  const { selectedActorId, onActorSelection } = props

  const { context } = useGame()

  return (
    <section className={styles.actorsListContainer} id='actorsListContainer'>
      <ul className={styles.actorsList}>
        {context.gameSubject.actors.map((actor) => {
          return (
            <ActorItem
              key={actor.id}
              actor={actor}
              isSelected={actor.id === selectedActorId}
              onClick={() => {
                if (onActorSelection != null) {
                  onActorSelection(actor.id)
                }
              }}
            />
          )
        })}
      </ul>
    </section>
  )
}
