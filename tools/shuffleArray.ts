/**
 * Shuffles array
 * @param array
 * @returns
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array]
  for (let index = newArray.length - 1; index > 0; index--) {
    const index2 = Math.floor(Math.random() * (index + 1))
    ;[newArray[index], newArray[index2]] = [newArray[index2], newArray[index]]
  }
  return newArray
}
