import classNames from 'clsx'

import styles from './Button.module.css'

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'action' | 'close' | 'conflict' | 'tutorial'
}

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    className,
    disabled = false,
    variant = 'primary',
    ...rest
  } = props

  return (
    <button
      className={classNames(
        styles.button,
        {
          [styles.buttonDisabled]: disabled,
          [styles.buttonPrimary]: variant === 'primary',
          [styles.buttonAction]: variant === 'action',
          [styles.buttonClose]: variant === 'close',
          [styles.buttonConflict]: variant === 'conflict',
          [styles.buttonTutorial]: variant === 'tutorial'
        },
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}
