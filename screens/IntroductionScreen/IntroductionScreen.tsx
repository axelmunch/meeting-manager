import classNames from 'clsx'

import { Button } from 'components/design/Button/Button'
import { useGame } from 'hooks/useGame'
import { subjects } from 'game/subjects'
import { Link } from 'components/design/Link/Link'

import styles from './IntroductionScreen.module.css'

export const IntroductionScreen: React.FC = () => {
  const { send, context } = useGame()

  return (
    <main className={styles.content}>
      <img
        src={context.gameSubject.image}
        className={styles.background}
        alt='Background'
      />
      <h1>Meeting Manager</h1>
      <div className={styles.gameSubject}>
        <select
          className={classNames(styles.gameSubjectSelect, 'selected-cursor')}
          value={context.gameSubject.title}
          onChange={(event) => {
            const subjectTitle = event.target.value
            const newSubject = subjects.find((subject) => {
              return subject.title === subjectTitle
            })
            if (newSubject != null) {
              send({
                type: 'selectGameSubject',
                gameSubject: newSubject
              })
            }
          }}
        >
          {subjects.map((subject) => {
            return (
              <option key={subject.title} value={subject.title}>
                {subject.title}
              </option>
            )
          })}
        </select>
        <p className={styles.gameSubjectDescription}>
          {context.gameSubject.description}
        </p>
        <div>
          <p>Acteurs :</p>
          <ul className={styles.gameSubjectActors}>
            {context.gameSubject.actors.map((actor) => {
              return (
                <li key={actor.id}>
                  {actor.name} - {actor.jobTitle}
                </li>
              )
            })}
          </ul>
        </div>
        <Button
          onClick={() => {
            send({ type: 'start' })
          }}
          variant={'action'}
        >
          Commencer
        </Button>
      </div>
      <div className={styles.links}>
        <Link href='/licenses'>Licences</Link>
        <Link href='/docs/index.html' target='_blank'>
          Documentation
        </Link>
      </div>
      <div className={styles.github}>
        <Link
          href='https://github.com/axelmunch/meeting-manager'
          target='_blank'
        >
          <img src='/misc/github.svg' alt='GitHub' />
        </Link>
      </div>
    </main>
  )
}
