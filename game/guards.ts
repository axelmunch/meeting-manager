import type { GameGuard, GameTransientGuard } from './types'

/**
 * Actor can be motivated.
 */
export const canMotivateGuard: GameGuard<'motivate'> = (context, event) => {
  const { actorId } = event
  const actor = context.gameSubject.actors.find((actor) => {
    return actor.id === actorId
  })
  return !context.hasPlayedCurrentTurn && actor != null
}

/**
 * Actor can be demotivated.
 */
export const canDemotivateGuard: GameGuard<'demotivate'> = (context, event) => {
  const { actorId } = event
  const actor = context.gameSubject.actors.find((actor) => {
    return actor.id === actorId
  })
  return !context.hasPlayedCurrentTurn && actor != null
}

/**
 * A conflict can be resolved
 */
export const canResolveConflictGuard: GameGuard<'resolveConflict'> = (
  context,
  event
) => {
  const { actorId } = event
  let hasConflict = false
  if (context.actorsConflict != null) {
    hasConflict =
      context.actorsConflict[0] === actorId ||
      context.actorsConflict[1] === actorId
  }
  return !context.hasPlayedCurrentTurn && hasConflict
}

/**
 * The game is won.
 */
export const isVictoryGuard: GameTransientGuard = (context) => {
  return (
    context.currentTurn === context.totalTurns &&
    Object.entries(context.domainGauges).every(([, gauge]) => {
      return gauge > 0
    })
  )
}

/**
 * The game is lost.
 */
export const isDefeatGuard: GameTransientGuard = (context) => {
  return Object.entries(context.domainGauges).some(([, gauge]) => {
    return gauge === 0
  })
}
