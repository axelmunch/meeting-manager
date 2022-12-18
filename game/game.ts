import { createModel } from 'xstate/lib/model.js'

import {
  demotivateAction,
  motivateAction,
  nextTurnAction,
  resolveConflictAction,
  restartAction,
  startAction,
  goToMeetingAction,
  selectGameSubjectAction
} from './actions'
import {
  canDemotivateGuard,
  canMotivateGuard,
  canResolveConflictGuard,
  isDefeatGuard,
  isVictoryGuard
} from './guards'
import { quartierResidentiel } from './subjects'
import type {
  Actor,
  ActorConflict,
  DomainGauges,
  GameSubject,
  MeetingReport
} from './types'
import { Domain, GameState } from './types'

export const gameInitialContext = {
  currentTurn: 1,
  totalTurns: 10,
  gameSubject: {
    ...quartierResidentiel
  } as GameSubject,
  domainGauges: {
    [Domain.WELL_BEING]: 50,
    [Domain.ECO_RESPONSIBILITY]: 50,
    [Domain.ATTRACTIVITY]: 50,
    [Domain.BUDGET]: 50
  } as DomainGauges,
  actorsConflict: null as ActorConflict | null,
  actorsResolvedConflicts: [] as ActorConflict[],
  meetingReports: [] as MeetingReport[],
  hasPlayedCurrentTurn: false
}

export const GameModel = createModel(gameInitialContext, {
  events: {
    start: () => {
      return {}
    },
    selectGameSubject: (gameSubject: GameSubject) => {
      return { gameSubject }
    },
    restart: () => {
      return {}
    },
    goToMeeting: () => {
      return {}
    },
    motivate: (actorId: Actor['id']) => {
      return { actorId }
    },
    demotivate: (actorId: Actor['id']) => {
      return { actorId }
    },
    resolveConflict: (actorId: Actor['id']) => {
      return { actorId }
    },
    nextTurn: () => {
      return {}
    }
  }
})

export const GameMachine = GameModel.createMachine({
  id: 'game',
  context: GameModel.initialContext,
  initial: GameState.INTRODUCTION,
  predictableActionArguments: true,
  states: {
    [GameState.INTRODUCTION]: {
      on: {
        start: {
          target: GameState.MEETING_PREPARATION,
          actions: [GameModel.assign(startAction)]
        },
        selectGameSubject: {
          target: GameState.INTRODUCTION,
          actions: [GameModel.assign(selectGameSubjectAction)]
        }
      }
    },
    [GameState.MEETING_PREPARATION]: {
      always: [
        {
          target: GameState.VICTORY,
          cond: isVictoryGuard
        },
        {
          target: GameState.DEFEAT,
          cond: isDefeatGuard
        }
      ],
      on: {
        goToMeeting: {
          target: GameState.MEETING,
          actions: [GameModel.assign(goToMeetingAction)]
        },
        motivate: {
          target: GameState.MEETING_PREPARATION,
          cond: canMotivateGuard,
          actions: [GameModel.assign(motivateAction)]
        },
        demotivate: {
          target: GameState.MEETING_PREPARATION,
          cond: canDemotivateGuard,
          actions: [GameModel.assign(demotivateAction)]
        },
        resolveConflict: {
          target: GameState.MEETING_PREPARATION,
          cond: canResolveConflictGuard,
          actions: [GameModel.assign(resolveConflictAction)]
        },
        restart: {
          target: GameState.INTRODUCTION,
          actions: [GameModel.assign(restartAction)]
        }
      }
    },
    [GameState.MEETING]: {
      on: {
        nextTurn: [
          {
            target: GameState.MEETING_PREPARATION,
            actions: [GameModel.assign(nextTurnAction)]
          }
        ],
        restart: {
          target: GameState.INTRODUCTION,
          actions: [GameModel.assign(restartAction)]
        }
      }
    },
    [GameState.VICTORY]: {
      on: {
        restart: {
          target: GameState.INTRODUCTION,
          actions: [GameModel.assign(restartAction)]
        }
      }
    },
    [GameState.DEFEAT]: {
      on: {
        restart: {
          target: GameState.INTRODUCTION,
          actions: [GameModel.assign(restartAction)]
        }
      }
    }
  }
})
