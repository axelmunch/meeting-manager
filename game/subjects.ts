import developpementApplication from '../data/developpement-application.json'
import quartierResidentiel from '../data/quartier-residentiel.json'
import type { GameSubject } from './types'

export const subjects: GameSubject[] = [
  quartierResidentiel as GameSubject,
  developpementApplication as GameSubject
]
export { developpementApplication, quartierResidentiel }
