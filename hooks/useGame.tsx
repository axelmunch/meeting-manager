import { createContext, useContext } from 'react'
import { useMachine } from '@xstate/react'

import { GameMachine } from '../game/game'
import type { GameContext, GameEvents, GameState } from '../game/types'

export interface GameContextType {
  state: GameState
  context: GameContext
  send: (event: GameEvents) => void
  can: (event: GameEvents) => boolean
}

export const defaultGameContext: GameContextType = {} as any
const Context = createContext<GameContextType>(defaultGameContext)

export const GameContextProvider: React.FC<React.PropsWithChildren<{}>> = (
  props
) => {
  const { children } = props

  const [state, send] = useMachine(GameMachine)

  return (
    <Context.Provider
      value={{
        state: state.value as GameState,
        context: state.context,
        send,
        can: (event) => {
          return GameMachine.transition(state, event).changed ?? false
        }
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useGame = (): GameContextType => {
  const game = useContext(Context)
  if (game === defaultGameContext) {
    throw new Error('`useGame` must be used within `GameContextProvider`')
  }
  return game
}
