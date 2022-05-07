/**
 * Clones an object with an optional default value to override every field's
 * value.
 *
 *
 * @param obj - Object to clone
 * @param defaultValue - Value to override every object's value
 * @returns Clone from `obj`
 */
export function clone<T extends object, U>(
  obj: T,
  defaultValue: U = undefined,
): T | Record<keyof T, U> {
  return Object.fromEntries(
    Object.keys(obj).map((field) => {
      if (typeof defaultValue !== 'undefined') {
        return [field, defaultValue];
      }

      if (Array.isArray(obj[field])) {
        return [field, [...obj[field]]];
      }

      if (
        typeof obj[field] === 'object' &&
        !Array.isArray(obj[field]) &&
        obj[field] !== null
      ) {
        return [field, { ...obj[field] }];
      }

      return [field, obj[field]];
    }),
  ) as T;
}

export function diff(base: object, other: object) {
  return Object.keys(base).reduce((res, key) => {
    if (!other.hasOwnProperty(key)) {
      // Object `other` is missing a field from `base` object
      res.push(key);
      return res;
    }

    const baseValue = base[key];
    const otherValue = other[key];

    if (Array.isArray(baseValue) && Array.isArray(otherValue)) {
      if (baseValue === otherValue) {
        // Same reference and thus same array
        return res;
      }

      if (baseValue.length !== otherValue.length) {
        res.push(key);
        return res;
      }

      const includesTheSameElements = baseValue.every((el) =>
        otherValue.includes(el),
      );

      if (!includesTheSameElements) {
        res.push(key);
        return res;
      }
    }

    if (
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue) &&
      typeof otherValue === 'object' &&
      !Array.isArray(otherValue) &&
      baseValue !== null &&
      otherValue !== null
    ) {
      const differences = diff(baseValue, otherValue);

      console.log(differences);

      if (differences.length) {
        res.push(key);
        return res;
      }
    }

    if (baseValue !== otherValue) {
      res.push(key);
      return res;
    }

    return res;
  }, []);
}
