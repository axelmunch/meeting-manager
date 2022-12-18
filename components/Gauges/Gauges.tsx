import { useGame } from 'hooks/useGame'
import { Domain } from 'game/types'

import styles from './Gauges.module.css'

export const Gauges: React.FC = () => {
  const { context } = useGame()

  return (
    <ul className={styles.gauges}>
      {Object.values(Domain).map((domain) => {
        return (
          <li key={domain} className={styles.gauge}>
            <p>{domain}</p>
            <div>
              <div
                style={{
                  width: context.domainGauges[domain].toString() + '%'
                }}
              ></div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
