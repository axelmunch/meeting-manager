import styles from './Satisfaction.module.css'

export interface SatisfactionProps {
  satisfaction: number
}

export const Satisfaction: React.FC<SatisfactionProps> = (props) => {
  const { satisfaction } = props

  let satisfactionType
  let satisfactionClassName
  if (satisfaction < 33) {
    satisfactionType = 'sad'
    satisfactionClassName = styles.sad
  } else if (satisfaction < 66) {
    satisfactionType = 'normal'
    satisfactionClassName = styles.normal
  } else {
    satisfactionType = 'happy'
    satisfactionClassName = styles.happy
  }

  return (
    <div className={styles.satisfaction}>
      <img
        src={'satisfaction/' + satisfactionType + '.svg'}
        className={satisfactionClassName}
        alt='Satisfaction'
      />
    </div>
  )
}
