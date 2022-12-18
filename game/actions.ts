import { gameInitialContext } from './game'
import type { GameAction, GameContext, MeetingReport } from './types'
import { Domain } from './types'
import {
  MOTIVATION_RATIO,
  DEMOTIVATION_RATIO,
  BOOST_RATIO,
  SATISFACTION_MOTIVATE,
  SATISFACTION_DEMOTIVATE,
  GAUGE_CHANGE_BY_ACTOR,
  GAUGE_MAX_ADD_CHANGE_BY_ACTOR,
  GAUGE_MAX_SUBSTRACT_CHANGE_BY_ACTOR,
  CONFLICT_SATISFACTION_REDUCTION,
  CONFLICT_THRESHOLD,
  NO_ACTORS_IN_DOMAIN_GAUGE_DIMINUTION
} from './constants'

/**
 * Start the game
 * @returns
 */
export const startAction: GameAction<'start'> = () => {
  return {}
}

/**
 * Select the game subject
 * @param _context
 * @param event
 * @returns
 */
export const selectGameSubjectAction: GameAction<'selectGameSubject'> = (
  _context,
  event
) => {
  return { gameSubject: event.gameSubject }
}

/**
 * Restart the game
 * @returns
 */
export const restartAction: GameAction<'restart'> = () => {
  return {
    ...gameInitialContext
  }
}

/**
 * Calculate the total speak time of all actors
 * @param context
 * @returns total speak time
 */
const getTotalSpeakTime = (context: GameContext): number => {
  // Total speak time is the sum of all actors speak ratio
  let totalSpeakTime = 0
  for (const actor of context.gameSubject.actors) {
    let actorSpeakTime = actor.speakRatio
    if (actor.boost !== null) {
      actorSpeakTime += actor.boost
    }
    actorSpeakTime = Math.max(actorSpeakTime, 1)
    if (actor.projectSatisfaction === 0) {
      actorSpeakTime = 0
    }
    totalSpeakTime += actorSpeakTime
  }
  return totalSpeakTime
}

/**
 * Calculate all meeting reports and add it to the context
 * @param context
 * @returns sorted meeting reports
 */
export const goToMeetingAction: GameAction<'goToMeeting'> = (context) => {
  const meetingReport: MeetingReport = {}

  const totalSpeakTime = getTotalSpeakTime(context)

  // Compute the percentage of speak time for each actor
  for (const actor of context.gameSubject.actors) {
    let actorSpeakTime = actor.speakRatio
    if (actor.boost != null) {
      actorSpeakTime += actor.boost
    }
    actorSpeakTime = Math.max(actorSpeakTime, 1)
    if (actor.projectSatisfaction === 0) {
      actorSpeakTime = 0
    }
    meetingReport[actor.id] = Math.floor(
      (actorSpeakTime / totalSpeakTime) * 100
    )
  }

  // If the total speak time is not 100 (due to rounding), add the difference to the actor with the minimum speak time
  let minimumSpeakTimeActor: string | null = null
  let totalSpeakTimeRecount = 0
  for (const actor of Object.keys(meetingReport)) {
    if (
      minimumSpeakTimeActor == null ||
      meetingReport[minimumSpeakTimeActor] < meetingReport[actor]
    ) {
      minimumSpeakTimeActor = actor
    }
    totalSpeakTimeRecount += meetingReport[actor]
  }

  if (minimumSpeakTimeActor != null) {
    meetingReport[minimumSpeakTimeActor] += 100 - totalSpeakTimeRecount
  }

  return {
    meetingReports: [...context.meetingReports, meetingReport]
  }
}

/**
 * Increase the speak ratio of the selected actor
 * @param context
 * @param event the selected actor id
 * @returns the new context
 */
export const motivateAction: GameAction<'motivate'> = (context, event) => {
  const { actorId } = event
  const maxSpeakRatio = Math.max(
    ...context.gameSubject.actors.map((actor) => {
      return actor.speakRatio
    })
  )
  // Motivate an actor by increasing its satisfaction and speak ratio
  // If the motivate action if available, actor boost is set to the max speak ratio of all actors
  const actors = context.gameSubject.actors.map((actor) => {
    if (actor.id === actorId) {
      actor.projectSatisfaction = Math.min(
        100,
        actor.projectSatisfaction + SATISFACTION_MOTIVATE
      )
      if (actor.motivateAction == null) {
        const speakRatio = Math.floor(actor.speakRatio * (1 + MOTIVATION_RATIO))
        return {
          ...actor,
          speakRatio,
          boost: Math.floor(speakRatio * BOOST_RATIO)
        }
      }
      return {
        ...actor,
        boost: maxSpeakRatio
      }
    }
    return actor
  })
  return {
    hasPlayedCurrentTurn: true,
    gameSubject: {
      ...context.gameSubject,
      actors
    }
  }
}

/**
 * Decrease the speak ratio of the selected actor
 * @param context
 * @param event the selected actor id
 * @returns the new context
 */
export const demotivateAction: GameAction<'demotivate'> = (context, event) => {
  const { actorId } = event
  let actorsConflict = context.actorsConflict
  const actorsResolvedConflicts = [...context.actorsResolvedConflicts]
  // Demotivate an actor by decreasing its satisfaction, speak ratio and set a boost to -50% of the new speak ratio
  const actors = context.gameSubject.actors.map((actor) => {
    if (actor.id === actorId) {
      const speakRatio = Math.floor(actor.speakRatio * (1 - DEMOTIVATION_RATIO))
      return {
        ...actor,
        projectSatisfaction: Math.max(
          0,
          actor.projectSatisfaction + SATISFACTION_DEMOTIVATE
        ),
        speakRatio,
        boost: Math.floor(-speakRatio * 0.5)
      }
    }
    return actor
  })
  // If the demotivate action set satisfaction to 0, the actor leave project and cancels his conflict
  if (
    actors.some((actor) => {
      return (
        actorsConflict != null &&
        (actor.id === actorsConflict[0] || actor.id === actorsConflict[1]) &&
        actor.projectSatisfaction === 0
      )
    })
  ) {
    if (actorsConflict != null) {
      actorsResolvedConflicts.push(actorsConflict)
      actorsConflict = null
    }
  }
  return {
    hasPlayedCurrentTurn: true,
    gameSubject: {
      ...context.gameSubject,
      actors
    },
    actorsConflict,
    actorsResolvedConflicts
  }
}

/**
 * Resolve the conflict between the two actors
 * @param context
 * @returns the list with the resolved conflict and the conflict set to null
 */
export const resolveConflictAction: GameAction<'resolveConflict'> = (
  context
) => {
  let actorsConflict = context.actorsConflict
  const actorsResolvedConflicts = [...context.actorsResolvedConflicts]

  // If there is a conflict, add it to the list of resolved conflicts and set it to null
  if (actorsConflict != null) {
    actorsResolvedConflicts.push(actorsConflict)
    actorsConflict = null
  }
  return {
    hasPlayedCurrentTurn: true,
    actorsConflict,
    actorsResolvedConflicts
  }
}

/**
 * Calculate all systems to the next turn
 * @param context
 * @returns the new context
 */
export const nextTurnAction: GameAction<'nextTurn'> = (context) => {
  let actors = context.gameSubject.actors.map((actor) => {
    let motivateAction = actor.motivateAction
    if (actor.boost != null && actor.boost > 0) {
      motivateAction = null
    }
    return {
      ...actor,
      motivateAction,
      boost: null
    }
  })

  // Evaluate gauges
  const gauges = { ...context.domainGauges }
  Object.values(Domain).forEach((domain) => {
    const gaugeBefore = gauges[domain]

    const actorsInDomain = context.gameSubject.actors.filter((actor) => {
      return actor.domains.includes(domain)
    })

    const actorMotivated = actorsInDomain.some((actor) => {
      return actor.boost != null && actor.boost > 0
    })
    const actorDemotivated = actorsInDomain.some((actor) => {
      return actor.boost != null && actor.boost < 0
    })

    const meetingReport =
      context.meetingReports[context.meetingReports.length - 1]
    // For each actor in a domain, change the gauge by the deviation from the average speak time
    // Substract the constant GAUGE_CHANGE_BY_ACTOR
    // If the actor is not motivated, limit gauge change
    actorsInDomain.forEach((actor) => {
      if (actor.projectSatisfaction > 0) {
        if (meetingReport != null) {
          let gaugeChangeValue =
            Math.max(
              -GAUGE_MAX_SUBSTRACT_CHANGE_BY_ACTOR,
              meetingReport[actor.id] -
                (1 / context.gameSubject.actors.length) * 100
            ) + GAUGE_CHANGE_BY_ACTOR
          // If actor is not motivated, limit max
          if (actor.boost == null || actor.boost <= 0) {
            gaugeChangeValue = Math.min(
              GAUGE_MAX_ADD_CHANGE_BY_ACTOR,
              gaugeChangeValue
            )
          }
          gauges[domain] += gaugeChangeValue
        }
      }
    })
    gauges[domain] = Math.min(100, Math.max(0, gauges[domain]))

    const gaugeAfter = gauges[domain]

    // If an actor is motivated, the gauge cannot decrease
    if (actorMotivated && gaugeAfter < gaugeBefore) {
      gauges[domain] = gaugeBefore
    }

    // If an actor is demotivated, the gauge cannot increase
    if (actorDemotivated && gaugeAfter > gaugeBefore) {
      gauges[domain] = gaugeBefore
    }

    // If there is no actor in a domain, change the gauge
    if (actorsInDomain.length === 0) {
      gauges[domain] = gauges[domain] - NO_ACTORS_IN_DOMAIN_GAUGE_DIMINUTION
    }
    gauges[domain] = Math.min(100, Math.max(0, gauges[domain]))

    // If an actor has left, change the gauge
    actorsInDomain.forEach((actor) => {
      if (actor.projectSatisfaction === 0) {
        gauges[domain] = Math.max(
          0,
          gauges[domain] - NO_ACTORS_IN_DOMAIN_GAUGE_DIMINUTION
        )
      }
    })

    gauges[domain] = Math.min(100, Math.max(0, gauges[domain]))
  })

  // If actors are in conflict, lower their satisfaction
  let actorsConflict = context.actorsConflict
  const actorsResolvedConflicts = [...context.actorsResolvedConflicts]
  actors = actors.map((actor) => {
    if (
      actorsConflict != null &&
      (actor.id === actorsConflict[0] || actor.id === actorsConflict[1])
    ) {
      return {
        ...actor,
        projectSatisfaction: Math.max(
          0,
          actor.projectSatisfaction + CONFLICT_SATISFACTION_REDUCTION
        )
      }
    }
    return actor
  })
  // If their satisfaction become 0, they leave the project and resolve their conflict
  if (
    actors.some((actor) => {
      return (
        actorsConflict != null &&
        (actor.id === actorsConflict[0] || actor.id === actorsConflict[1]) &&
        actor.projectSatisfaction === 0
      )
    })
  ) {
    if (actorsConflict != null) {
      actorsResolvedConflicts.push(actorsConflict)
      actorsConflict = null
    }
  }

  // Create a conflit if there is at least 2 actors with a satisfaction under the threshold
  if (actorsConflict == null) {
    const actorsValidForConflicts = actors.filter((actor) => {
      return (
        !(
          actorsConflict != null &&
          (actorsConflict[0] === actor.id || actorsConflict[1] === actor.id)
        ) &&
        !actorsResolvedConflicts.some((actorConflict) => {
          return actorConflict[0] === actor.id || actorConflict[1] === actor.id
        }) &&
        actor.projectSatisfaction < CONFLICT_THRESHOLD &&
        actor.projectSatisfaction > 0
      )
    })

    if (actorsValidForConflicts.length >= 2) {
      actorsConflict = [
        actorsValidForConflicts[0].id,
        actorsValidForConflicts[1].id
      ]
    }
  }

  return {
    hasPlayedCurrentTurn: false,
    currentTurn: context.currentTurn + 1,
    gameSubject: {
      ...context.gameSubject,
      actors
    },
    domainGauges: gauges,
    actorsConflict
  }
}
