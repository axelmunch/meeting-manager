import { useRef, useEffect, useState } from 'react'

import { useGame } from 'hooks/useGame'
import type { Actor } from 'game/types'
import { shuffleArray } from 'tools/shuffleArray'
import { getRandomNumber } from 'tools/getRandomNumber'
import {
  ACTOR_RANDOM_MESSAGE_SIZE_MULTIPLICATOR,
  MEETING_RANDOM_MESSAGES_QUANTITY_MULTIPLIER,
  MEETING_CHAT_MESSAGE_INTERVAL
} from 'game/constants'

import styles from './MeetingChat.module.css'

interface Message {
  actor: Actor
  text: string
}

export const MeetingChat: React.FC = () => {
  const { context } = useGame()

  const [messages, setMessages] = useState<Message[]>([])
  const ulRef = useRef<HTMLUListElement>(null)
  const currentMessageIndexRef = useRef(0)

  const randomChars = '        .,;:?!§€#$%&/()=+*~^`@µ>|²ª¿ß÷×¤°±%№¶∩∞∙√│■□█'

  useEffect(() => {
    let actorMessages: Message[] = []
    for (const actor of context.gameSubject.actors) {
      if (
        actor.boost != null &&
        actor.boost > 0 &&
        actor.motivateAction != null &&
        actor.projectSatisfaction > 0
      ) {
        for (const message of actor.motivateTexts) {
          actorMessages.push({ actor, text: message })
        }
      }
    }
    const hasMeetingReports = context.meetingReports.length > 0
    if (hasMeetingReports) {
      const meetingReport =
        context.meetingReports[context.meetingReports.length - 1]
      for (const actorId of Object.keys(meetingReport)) {
        const actor = context.gameSubject.actors.find((actor) => {
          return actor.id === actorId
        })
        if (
          actor != null &&
          !(
            actor.boost != null &&
            actor.boost > 0 &&
            actor.motivateAction != null
          )
        ) {
          if (actor.projectSatisfaction > 0) {
            for (
              let i = 0;
              i <
              Math.max(
                1,
                (meetingReport[actorId] / 10) *
                  MEETING_RANDOM_MESSAGES_QUANTITY_MULTIPLIER
              );
              i++
            ) {
              let text = ''
              for (
                let j = 0;
                j <
                getRandomNumber(
                  ACTOR_RANDOM_MESSAGE_SIZE_MULTIPLICATOR,
                  meetingReport[actorId] *
                    ACTOR_RANDOM_MESSAGE_SIZE_MULTIPLICATOR
                );
                j++
              ) {
                text += randomChars[getRandomNumber(0, randomChars.length - 1)]
              }

              if (actor != null) {
                actorMessages.push({
                  actor,
                  text
                })
              }
            }
          }
        }
      }
    }

    actorMessages = shuffleArray(actorMessages)

    const messageInterval = setInterval(() => {
      if (currentMessageIndexRef.current > actorMessages.length - 1) {
        currentMessageIndexRef.current = actorMessages.length - 1
        clearInterval(messageInterval)
      } else {
        setMessages((oldMessages) => {
          const result = [
            ...oldMessages,
            actorMessages[currentMessageIndexRef.current]
          ]
          currentMessageIndexRef.current += 1
          return result
        })
      }
    }, MEETING_CHAT_MESSAGE_INTERVAL)

    return () => {
      clearInterval(messageInterval)
    }
  }, [context.gameSubject.actors, context.meetingReports])

  useEffect(() => {
    ulRef.current?.scrollTo(0, ulRef.current.scrollHeight)
  }, [messages])

  return (
    <ul className={styles.chat} ref={ulRef}>
      {messages.map((message, index) => {
        return (
          <li key={index}>
            {message.actor.name +
              ' [' +
              message.actor.jobTitle +
              '] : ' +
              message.text}
          </li>
        )
      })}
    </ul>
  )
}
