export const isDefined = <T extends unknown>(
  value: T
): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};
