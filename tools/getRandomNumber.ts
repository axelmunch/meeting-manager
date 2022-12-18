/**
 * Get random number between min (inclusive) and max (inclusive)
 * @param min
 * @param max
 * @returns
 */
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
