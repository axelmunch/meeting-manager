import { EndGame } from 'components/EndGame/EndGame'
import { GameState } from 'game/types'

export const DefeatScreen: React.FC = () => {
  return <EndGame state={GameState.DEFEAT} />
}
