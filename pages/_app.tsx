import type { AppProps } from 'next/app'

import 'modern-normalize/modern-normalize.css'
import 'styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return <Component {...pageProps} />
}

export default MyApp
