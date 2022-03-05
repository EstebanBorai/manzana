import { writable } from 'svelte/store';

import type { Writable } from 'svelte/store';

export type Values = Record<string, string | number | boolean>;

export type FormInstance<T = Values> = {
  /**
   * Form's fields initial values.
   *
   * This object is required to initialize a new form, it's used to track
   * changed values and to initialize the form values.
   */
  initialValues: T;
  values: Writable<T>;
};

export type FormConfig<T = Values> = {
  initialValues: T;
};

export function newForm<T = Values>(config: FormConfig<T>): FormInstance<T> {
  if (typeof config === 'undefined') {
    throw new TypeError(
      'You must provide a config to "newForm". Expected "config" to be an object, received "undefined" instead.',
    );
  }

  if (!config.initialValues) {
    throw new TypeError(
      'You must specify "initialValues" with an object to "FormConfig".',
    );
  }

  const initialValues = JSON.parse(JSON.stringify(config.initialValues));
  const values = writable({
    ...initialValues,
  });

  return {
    initialValues,
    values,
  };
}
