/**
 * Get average value from array of numbers
 * @param values
 * @returns
 */
export const getAverageValue = (values: number[]): number => {
  return (
    values.reduce((accumulator, value) => {
      return accumulator + value
    }, 0) / values.length
  )
}
