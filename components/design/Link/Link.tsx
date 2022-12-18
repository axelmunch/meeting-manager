import classNames from 'clsx'
import NextLink from 'next/link'

import styles from './Link.module.css'

export interface LinkProps extends React.ComponentPropsWithoutRef<'a'> {
  href: string
}

export const Link: React.FC<LinkProps> = (props) => {
  const { children, className, ...rest } = props

  return (
    <NextLink className={classNames(styles.link, className)} {...rest}>
      {children}
    </NextLink>
  )
}
