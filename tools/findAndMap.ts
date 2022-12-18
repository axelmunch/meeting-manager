/**
 * Parse, map (with object) and replace value(s) in a string
 * @param toReplace The string containing the placeholders to replace
 * @param object The object containing the value(s) to replace with
 * @example findAndMap('Hello %name%!', { '%name%': 'Louis' }) // Hello Louis!
 */
export const findAndMap = (
  toReplace: string,
  object: Record<string, unknown>
): string => {
  return toReplace.replace(
    new RegExp(Object.keys(object).join('|'), 'gi'),
    (matched) => {
      return object[matched] as string
    }
  )
}
