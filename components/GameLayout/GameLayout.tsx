import classNames from 'clsx'

import { useGame } from 'hooks/useGame'
import { Gauges } from 'components/Gauges/Gauges'
import { Button } from 'components/design/Button/Button'
import { TutorialPopup } from 'components/TutorialPopup/TutorialPopup'

import styles from './GameLayout.module.css'

export interface GameLayoutProps {
  title: string
  nextButton: {
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    title: string
  }
  hasBackground?: boolean
}

export const GameLayout: React.FC<React.PropsWithChildren<GameLayoutProps>> = (
  props
) => {
  const { title, nextButton, hasBackground, children } = props
  const { context, send } = useGame()

  return (
    <div
      className={classNames(styles.content, {
        [styles.contrastTextColor]: hasBackground
      })}
    >
      {hasBackground != null && hasBackground ? (
        <img
          src='backgrounds/meeting-room.jpg'
          className={styles.background}
          alt='Background'
        />
      ) : null}
      <div className={styles.leftSidebar}>
        <header className={styles.header}>
          <Button
            onClick={() => {
              send({ type: 'restart' })
            }}
            variant={'close'}
          />
          <h3>
            {context.gameSubject.title} - {title}
          </h3>
          <p>
            Tour {context.currentTurn} / {context.totalTurns}
          </p>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
      <div className={styles.rightSidebar}>
        <Gauges />

        <TutorialPopup />

        <div className={styles.nextButtonContainer}>
          <Button onClick={nextButton.onClick} variant={'action'}>
            {nextButton.title}
          </Button>
        </div>
      </div>
    </div>
  )
}
