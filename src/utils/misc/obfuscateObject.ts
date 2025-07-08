import { isDefined } from './';

export const SENSITIVE = [
  'password',
  'secret',
  'authorization',
  'auth',
  'token',
  'apiKey',
  'cookie',
  'accessToken',
  'session',
  'license',
  'socialSecurityNumber',
  'socialInsuranceNumber',
];
const TRASH_KEYWORDS = ['_events'];
const MAX_STRING_LENGTH = 500; // Maximum string length before truncating.
const MAX_OBJECT_KEYS = 50; // Maximum object keys before truncating.

const isSensitive = (key: unknown) =>
  typeof key === 'string' &&
  SENSITIVE.find((sensitive) =>
    key.toLowerCase().includes(sensitive.toLowerCase())
  ) !== undefined;

const isTrash = (key: unknown) =>
  typeof key === 'string' &&
  TRASH_KEYWORDS.some((keyword) => key.toLowerCase().includes(keyword));

const truncateValue = (value: unknown) => {
  if (typeof value === 'string') {
    return value.length > MAX_STRING_LENGTH
      ? `${value.slice(0, MAX_STRING_LENGTH)}... (truncated)`
      : value;
  }
  return value;
};

const obfuscateValue = () => {
  return '*'.repeat(10);
};

/**
 * Recursively obfuscates an object and handles circular dependencies.
 *
 * @param object Object
 * @returns Obfuscated object
 */
export const obfuscate = (
  obj: any,
  depth = 0,
  maxDepth = 10,
  processedKeys = 0,
  seen = new Set()
): any => {
  if (depth > maxDepth) {
    return 'MAX DEPTH REACHED (truncated)';
  }

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      obfuscate(item, depth + 1, maxDepth, processedKeys, seen)
    );
  } else if (isDefined(obj) && typeof obj === 'object') {
    if (seen.has(obj)) {
      return '[Circular]';
    }
    seen.add(obj);

    const keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
    return keys.reduce(
      (acc, key, index) => {
        let value = obj[key as any];

        // If max number of keys is reached, truncate the object
        if (processedKeys + index >= MAX_OBJECT_KEYS) {
          acc['MAX OBJECT KEYS REACHED'] = '(truncated)';
          return acc;
        }

        if (isTrash(key)) {
          value = 'trash (truncated)';
        } else if (isSensitive(key)) {
          if (Array.isArray(value)) {
            value = value.map(() => obfuscateValue());
          } else {
            value = obfuscateValue();
          }
        } else if (typeof value === 'string') {
          value = truncateValue(value);
        } else {
          value = obfuscate(
            value,
            depth + 1,
            maxDepth,
            processedKeys + index,
            seen
          );
        }
        acc[key as any] = value;
        return acc;
      },
      {} as Record<string | symbol, unknown>
    );
  } else if (typeof obj === 'string') {
    return truncateValue(obj);
  }

  return obj;
};

/**
 * Recursively obfuscates an object and handles circular dependencies.
 *
 * @param object Object
 * @returns Obfuscated object
 */
export const obfuscateObject = (obj: any): any => {
  return obfuscate(obj);
};
