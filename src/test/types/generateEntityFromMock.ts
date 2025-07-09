export const generateEntityFromMock =
  <T extends {}>(original: T) =>
  <K extends Partial<T>>(overrides?: K) =>
    ({ ...original, ...overrides }) as T;
