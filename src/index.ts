/* eslint-disable @typescript-eslint/no-explicit-any */

import { derived, get, writable } from 'svelte/store';
import { isSchema, ValidationError } from 'yup';

import type { Readable, Writable } from 'svelte/store';
import type { SchemaLike } from 'yup/lib/types';

export type Values = Record<string, any>;

export type FormErrors = Record<string, string | undefined>;

export type FormInstance<T = Values> = {
  /**
   * Form errors.
   *
   * A writable store that holds form validation errors.
   */
  errors: Readable<FormErrors>;

  /**
   * Form's fields initial values.
   *
   * This object is required to initialize a new form, it's used to track
   * changed values and to initialize the form values.
   */
  initialValues: T;

  /**
   * A readable store which holds a boolean `true` if the form submition is
   * being executed.
   */
  isSubmitting: Readable<boolean>;

  /**
   * A readable store which holds a boolean `true` if the form submition is
   * under validation stage.
   */
  isValidating: Readable<boolean>;

  /**
   * Event handler for the input's `change` event.
   */
  handleChange(event: Event): void;

  /**
   * Event handler for the input's `input` event.
   *
   * The `handleInput` function comes handy when building `input` components
   * which must support dynamic `type` values, given that using dynamic type
   * attribute along with two-way binding is not legal on Svelte.
   *
   * ```
   * Error: 'type' attribute cannot be dynamic if input uses two-way binding.
   * ```
   *
   * Read the [Rich Harris's answer on StackOverflow][1] for more details on
   * this topic.
   *
   * [1]: https://stackoverflow.com/a/57393751/9888500
   */
  handleInput(event: Event): void;

  /**
   * Event handler for the form's submit event.
   *
   * Handles the submit event for the `form` element and prevents the
   * default behavior (`event.preventDefault`).
   *
   * Sets the `isSubmitting` store to `true` which can be used as a sentinel
   * value for a loading UI. If the `validationSchema` is available in the
   * `FormConfig`, then the `isValidating` store value will be `true` as well.
   */
  handleSubmit(event: Event): void;

  /**
   * Imperatively sets the error message for the field with the name provided.
   *
   * The `message` param could be skipped to clear the error message for the
   * field in question.
   */
  setFieldError(field: keyof T, message?: string): void;

  /**
   * Imperatively sets the value for the field with the name provided.
   */
  setFieldValue(
    field: keyof T,
    value: any,
    shouldValidateField?: boolean,
  ): void;

  /**
   * Validates a single field using the provided `validationSchema`
   * asynchronously.
   */
  validateField(field: keyof T): Promise<void>;

  /**
   * Validates a single field using the provided `validationSchema`
   * synchronously.
   */
  validateFieldSync(field: keyof T): void;

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
  /**
   * Form's fields initial values.
   *
   * This object is required to initialize a new form, it's used to track
   * changed values and to initialize the form values.
   */
  initialValues: T;

  /**
   * Callback to execute when `handleSubmit` is invoked.
   *
   * Form values are provided to this callback as the first argument and
   * `helpers` to update form state.
   */
  onSubmit(values: T, helpers: any): Promise<void> | void;

  /**
   * Wether to validate form fields whenever `handleChange` is executed.
   */
  validateOnChange?: boolean;

  /**
   * Wether to validate form fields whenever `handleInput` is executed.
   */
  validateOnInput?: boolean;

  /**
   * A [Yup][1] schema used to validate form values.
   *
   * [1]: https://github.com/jquense/yup
   */
  validationSchema?: SchemaLike;
};

/**
 * Retrieves a HTML Input element instance value based on the input's type.
 *
 * Given a type, `getInputValue` will retrieve the value as follows:
 *
 * - `number` or `range`: Retrieve the `number` equivalent using `+` sign.
 * - As fallback retrieves the value _as is_.
 */
export const getInputValue = (inputElement: HTMLInputElement): any => {
  const type = inputElement.type;

  if (type.match(/^(number|range)$/)) {
    return +inputElement.value;
  }

  return inputElement.value;
};

/**
 * Creates a new form instance with an `errors` and `values` store.
 *
 * # Example
 *
 * ```html
 * <script lang="ts">
 * import { newForm } from 'manzana';
 *
 * import { productService } from '$lib/services/product';
 *
 * const { handleSubmit, errors, values, setFieldValue } = newForm<{
 *   name: string;
 *   logo: File;
 * }>({
 *   initialValues: {
 *     name: '',
 *     logo: null
 *   },
 *   onSubmit: async (values) => {
 *     await productService.createBrand(values.name, values.logo);
 *   }
 * });
 * </script>
 *
 * <form on:submit={handleSubmit}>
 *   <div>
 *     <Input
 *       name="name"
 *       label="Brand Name"
 *       placeholder="Apple Inc."
 *       bind:value={$values.name}
 *       error={$errors.name}
 *     />
 *     <FileDropzone
 *       error={$errors.logo}
 *       onChange={(files) => setFieldValue('logo', files[0])}
 *     />
 *   </div>
 *   <div class="text-center pt-4">
 *     <Button type="submit">Crear</Button>
 *   </div>
 * </form>
 * ```
 */
export type NewFormFn = <T = Values>(config: FormConfig<T>) => FormInstance<T>;

export const newForm: NewFormFn = <T>(
  config: FormConfig<T>,
): FormInstance<T> => {
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
  const __isSubmitting = writable(false);
  const __isValidating = writable(false);
  const __errors = writable(
    Object.fromEntries(
      Object.keys(initialValues).map((field) => [field, undefined]),
    ) as FormErrors,
  );
  const values = writable({
    ...initialValues,
  });
  const setFieldError = (field: keyof T, message?: string): void => {
    __errors.update((currentState) => ({
      ...currentState,
      [field]: message,
    }));
  };

  /**
   * Updates the `errors` store with an instance of Yup's `ValidationError`.
   */
  const setYupValidationErrors = (error: ValidationError): void => {
    if ('path' in error && Array.isArray(error?.errors)) {
      setFieldError(error.path as keyof T, error.errors[0]);
      return;
    }

    console.error('Missing "path" and "errors" array.');
  };

  const validateField = async (field: keyof T): Promise<void> => {
    try {
      const currentFormValues = get(values);

      await config.validationSchema.validateAt(
        field as string,
        currentFormValues,
      );
      setFieldError(field, null);
    } catch (error) {
      setYupValidationErrors(error);
    }
  };

  const validateFieldSync = (field: keyof T): void => {
    try {
      const currentFormValues = get(values);

      config.validationSchema.validateSyncAt(
        field as string,
        currentFormValues,
      );
      __errors.update((currentState) => ({
        ...currentState,
        [field]: undefined,
      }));
    } catch (error) {
      setYupValidationErrors(error);
    }
  };

  const setFieldValue = (
    field: keyof T,
    value: any,
    shouldValidateField?: boolean,
  ): void => {
    values.update((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    if (shouldValidateField && config.validationSchema) {
      validateFieldSync(field);
    }
  };

  const handleChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const name = target.name as keyof T;
    const value = getInputValue(target);

    return setFieldValue(name, value, config.validateOnChange);
  };

  const handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = getInputValue(target);

    return setFieldValue(name as keyof T, value, config.validateOnInput);
  };

  const handleSubmit = async (event: Event): Promise<void> => {
    if (config?.onSubmit && typeof config.onSubmit === 'function') {
      if (event?.preventDefault && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }

      if (
        event?.stopPropagation &&
        typeof event.stopPropagation === 'function'
      ) {
        event.stopPropagation();
      }

      const currentValues = get(values);

      __isSubmitting.set(true);

      if (isSchema(config.validationSchema)) {
        try {
          __isValidating.set(true);

          config.validationSchema.validate(currentValues, {
            abortEarly: false,
          });
        } catch (error) {
          if (error instanceof ValidationError) {
            if ('inner' in error) {
              const validationErrors = error.inner.reduce(
                (acc: FormErrors, { message, path }) => {
                  return {
                    ...acc,
                    [path]: message,
                  };
                },
                {},
              );

              __errors.set(validationErrors);
              return;
            }

            console.error('An unhandled error ocurred validating the form.');
            console.error(error);
          }
        } finally {
          __isValidating.set(false);
        }
      }

      await config.onSubmit(currentValues, {
        setFieldError,
      });
    }
  };

  return {
    errors: derived(__errors, (errors) => errors),
    handleChange,
    handleInput,
    handleSubmit,
    initialValues,
    isSubmitting: derived(__isSubmitting, (isSubmitting) => isSubmitting),
    isValidating: derived(__isValidating, (isValidating) => isValidating),
    setFieldError,
    setFieldValue,
    values,
    validateField,
    validateFieldSync,
  };
};
