import type { NextPage } from 'next'

import { Head } from 'components/Head'
import { GameContextProvider } from 'hooks/useGame'
import { Game } from 'components/Game'

const Home: NextPage = () => {
  return (
    <>
      <Head />
      <GameContextProvider>
        <Game />
      </GameContextProvider>
    </>
  )
}

export default Home
