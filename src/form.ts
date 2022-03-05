import { derived, writable } from 'svelte/store';

import type { Readable, Writable } from 'svelte/store';

export type Values = Record<string, string | number | boolean>;

export type FormInstance = {
  initialValues: Readable<Values>;
  values: Writable<Values>;
};

export type FormConfig = {
  initialValues: Record<string, string | number | boolean>;
};

export function newForm(config: FormConfig): FormInstance {
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
  const state = writable({
    initialValues,
  });

  return {
    initialValues: derived(state, ($state) => $state.initialValues),
    values,
  };
}
