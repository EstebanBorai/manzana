/* eslint-disable @typescript-eslint/no-explicit-any */

import { writable } from 'svelte/store';

import type { Writable } from 'svelte/store';

export type Values = Record<string, any>;

export type FormInstance<T = Values> = {
  /**
   * Form's fields initial values.
   *
   * This object is required to initialize a new form, it's used to track
   * changed values and to initialize the form values.
   */
  initialValues: T;
  /**
   * Event handler for the input's `change` event.
   */
  handleChange(event: Event): void;
  /**
   * Imperatively sets the value for the field with the name provided.
   *
   * This function will not trigger validation.
   */
  setFieldValue(name: string, value: any): void;
  /**
   * Current form values.
   *
   * A writable store which holds form's field values. These are initialized
   * by the `initialValues` provided to the form configuration object.
   *
   * Useful to take advantage of the two-way data binding when providing it
   * to the `<input>` HTML element.
   *
   * ## Example
   *
   * ```html
   * <script>
   * import { newForm } from 'manzana';
   *
   * const { values } = newForm({
   *   initialValues: {
   *     name: '',
   *     last: '',
   *   }
   * });
   * </script>
   *
   * <form>
   *   <input name="name" bind:value={$values.name} />
   *   <input name="name" bind:value={$values.name} />
   * </form>
   * ```
   *
   * ## Notes
   *
   * Is not recommended to write directly to this object, instead you must
   * use setFieldValue` instead.
   */
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

  const setFieldValue = (
    name: string,
    value: any,
    shouldValidateField?: boolean,
  ): void => {
    values.update((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    if (shouldValidateField) {
      // TODO: Validate field if `shouldValidate` is `true`
      console.warn('setFieldValue.shouldValidateField is not yet implemented!');
    }
  };

  const handleChange = (event: Event): void => {
    const inputElement = event.target as HTMLInputElement;
    const name = inputElement.name;
    const value = inputElement.value;

    return setFieldValue(name, value, true);
  };

  return {
    handleChange,
    initialValues,
    setFieldValue,
    values,
  };
}
