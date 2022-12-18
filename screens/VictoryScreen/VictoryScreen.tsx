import { EndGame } from 'components/EndGame/EndGame'
import { GameState } from 'game/types'

export const VictoryScreen: React.FC = () => {
  return <EndGame state={GameState.VICTORY} />
}
