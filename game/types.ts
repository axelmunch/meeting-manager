import type { ContextFrom, EventFrom } from 'xstate'

import type { GameModel } from './game'

export enum GameState {
  /**
   * Presentation of the actors, the number of turns, and the problematic.
   */
  INTRODUCTION = 'Introduction',

  /**
   * The player choose the action to perform in the current turn.
   */
  MEETING_PREPARATION = 'Préparation de la réunion',

  /**
   * The meeting is in progress.
   */
  MEETING = 'Réunion',

  /**
   * The player manages to keep the points from the different domains above 0.
   */
  VICTORY = 'Victoire',

  /**
   * The player loses if the points from a domain reaches 0.
   */
  DEFEAT = 'Défaite'
}

export enum Domain {
  WELL_BEING = 'Bien-être',
  ECO_RESPONSIBILITY = 'Éco-responsabilité',
  ATTRACTIVITY = 'Attractivité',
  BUDGET = 'Budget'
}

/**
 * Number between 0 and 100.
 */
export type Gauge = number

export interface DomainGauges {
  [Domain.WELL_BEING]: Gauge
  [Domain.ECO_RESPONSIBILITY]: Gauge
  [Domain.ATTRACTIVITY]: Gauge
  [Domain.BUDGET]: Gauge
}

export interface GameSubject {
  title: string
  description: string
  image: string
  actors: Actor[]
}

export interface Actor {
  id: string
  name: string
  jobTitle: string
  description: string
  avatar: string
  domains: Domain[]

  /**
   * Number between 0 and 100.
   */
  projectSatisfaction: number

  boost: number | null

  /**
   * Number between 0 and 100.
   */
  speakRatio: number

  /**
   * Children make a presentation about the project.
   * The mayor explains budget plans.
   * The architect explains the ECO_RESPONSIBILITY part.
   * The family explains the WELL_BEING part.
   */
  motivateAction: string | null

  motivateTexts: string[]
}

/**
 * Each actor has a speaking time percentage (between 0 and 100).
 */
export interface MeetingReport {
  [key: Actor['id']]: number
}

/**
 * Two actors entered in conflict.
 */
export type ActorConflict = [Actor['id'], Actor['id']]

export type GameContext = ContextFrom<typeof GameModel>

export type GameEvents = EventFrom<typeof GameModel>

export type GameEvent<T extends GameEvents['type']> = GameEvents & { type: T }

export type GameGuard<T extends GameEvents['type']> = (
  context: GameContext,
  event: GameEvent<T>
) => boolean

export type GameTransientGuard = (
  context: GameContext,
  event: GameEvents
) => boolean

export type GameAction<T extends GameEvents['type']> = (
  context: GameContext,
  event: GameEvent<T>
) => Partial<GameContext>
