/**
 * This function filters out null, undefined and empty string values from an object
 * @param obj Object to be filtered
 * @returns Object with null, undefined and empty string values removed
 */
export function filterObjectEmptyValues<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(
        ([_, value]) => value !== null && value !== undefined && value !== ''
      )
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return [key, filterObjectEmptyValues(value)];
        }
        return [key, value];
      })
  ) as Partial<T>;
}
