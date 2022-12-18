import { useGame } from 'hooks/useGame'
import { GameState } from 'game/types'
import { IntroductionScreen } from 'screens/IntroductionScreen/IntroductionScreen'
import { MeetingPreparationScreen } from 'screens/MeetingPreparationScreen/MeetingPreparationScreen'
import { MeetingScreen } from 'screens/MeetingScreen/MeetingScreen'
import { VictoryScreen } from 'screens/VictoryScreen/VictoryScreen'
import { DefeatScreen } from 'screens/DefeatScreen/DefeatScreen'

export const Game: React.FC = () => {
  const { state } = useGame()

  return (
    <>
      {state === GameState.INTRODUCTION ? <IntroductionScreen /> : null}
      {state === GameState.MEETING_PREPARATION ? (
        <MeetingPreparationScreen />
      ) : null}
      {state === GameState.MEETING ? <MeetingScreen /> : null}
      {state === GameState.VICTORY ? <VictoryScreen /> : null}
      {state === GameState.DEFEAT ? <DefeatScreen /> : null}
    </>
  )
}
