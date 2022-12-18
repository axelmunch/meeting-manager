import { GameLayout } from 'components/GameLayout/GameLayout'
import { useGame } from 'hooks/useGame'
import { MeetingChat } from 'components/MeetingChat/MeetingChat'
import { ActorsMeeting } from 'components/ActorsMeeting/ActorsMeeting'

export const MeetingScreen: React.FC = () => {
  const { send } = useGame()

  return (
    <GameLayout
      title='Réunion'
      nextButton={{
        title: 'Passer au tour suivant',
        onClick: () => {
          send({ type: 'nextTurn' })
        }
      }}
      hasBackground
    >
      <ActorsMeeting />
      <MeetingChat />
    </GameLayout>
  )
}
