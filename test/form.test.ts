import { get } from 'svelte/store';
import * as Yup from 'yup';
import { describe, expect, it, vi } from 'vitest';

import { newForm } from '../src';
import { getInputValue } from '../src';

import type { FormConfig } from '../src';

describe('Form: initialValues', () => {
  it('Creates a new form with initial values', () => {
    const initialValues = {
      name: 'Esteban',
      last: 'Borai',
      email: 'esteban@mail.com',
    };
    const form = newForm<{ name: string; last: string; email: string }>({
      initialValues,
      onSubmit: vi.fn(),
    });
    const values = get(form.values);

    expect(values.name).toStrictEqual(initialValues.name);
    expect(values.last).toStrictEqual(initialValues.last);
    expect(values.email).toStrictEqual(initialValues.email);
  });

  it('Uses a copy of `initialValues` instead of relying on the object reference', () => {
    const initialValues = {
      name: 'Esteban',
      last: 'Borai',
      email: 'esteban@mail.com',
    };
    const form = newForm<{ name: string; last: string; email: string }>({
      initialValues,
      onSubmit: vi.fn(),
    });

    initialValues.name = 'John';
    initialValues.last = 'Appleseed';
    initialValues.email = 'john@mail.com';

    expect(form.initialValues.name).toStrictEqual('Esteban');
    expect(form.initialValues.last).toStrictEqual('Borai');
    expect(form.initialValues.email).toStrictEqual('esteban@mail.com');
  });

  it('Throws a "TypeError" if no "initialValues" are provided to the configuration.', () => {
    expect(() => newForm({} as FormConfig)).toThrowErrorMatchingSnapshot();
  });

  it('Throws a "TypeError" if no configuration is provided.', () => {
    const config = undefined as FormConfig;

    expect(() => newForm(config)).toThrowErrorMatchingSnapshot();
  });
});

describe('Form: $values', () => {
  it('`form.$values` from `newForm` is a store with a subscribe function', () => {
    const form = newForm({ initialValues: {}, onSubmit: vi.fn() });

    expect(form.values.subscribe).toBeDefined();
  });

  it('Holds "initialValues" when subscribing for the first time', () => {
    const initialValues = { name: 'Lorem', last: 'Ipsum' };
    const form = newForm<typeof initialValues>({
      initialValues,
      onSubmit: vi.fn(),
    });
    const values = get(form.values);

    expect(values.name).toStrictEqual('Lorem');
    expect(values.last).toStrictEqual('Ipsum');
  });

  it('Updates $values when "handleChange" is executed', () => {
    const initialValues = { name: 'Lorem', last: 'Ipsum' };
    const form = newForm<typeof initialValues>({
      initialValues,
      onSubmit: vi.fn(),
    });

    form.handleChange({
      target: {
        name: 'name',
        value: 'Testing!',
        type: 'text',
      },
    } as unknown as Event);
    const values = get(form.values);

    expect(values.name).toStrictEqual('Testing!');
  });

  it('Updates $values when "setFieldValue" is executed', () => {
    const initialValues = { name: 'Lorem', last: 'Ipsum' };
    const form = newForm<typeof initialValues>({
      initialValues,
      onSubmit: vi.fn(),
    });

    form.setFieldValue('name', 'Testing!');
    const values = get(form.values);

    expect(values.name).toStrictEqual('Testing!');
  });
});

describe('Form: validateField', () => {
  it('Validates a single field', async () => {
    const form = newForm({
      initialValues: {
        name: '',
      },
      onSubmit: vi.fn(),
      validationSchema: Yup.object({
        name: Yup.string().required('You must provide the name.'),
      }),
    });

    await form.validateField('name');
    const errors = get(form.errors);

    expect(errors.name).toStrictEqual('You must provide the name.');
  });

  it('Resets error state when form value is updated', async () => {
    expect.assertions(2);

    const form = newForm({
      initialValues: {
        name: '',
      },
      onSubmit: vi.fn(),
      validationSchema: Yup.object({
        name: Yup.string().required('You must provide the name.'),
      }),
    });

    await form.validateField('name');
    const errors = get(form.errors);
    expect(errors.name).toStrictEqual('You must provide the name.');

    form.setFieldValue('name', 'Testing!');
    await form.validateField('name');
    const errors2 = get(form.errors);
    expect(errors2.name).toBeNull();
  });
});

describe('Form Internals: getInputValue', () => {
  it('Retrieves the input value as a "number" if the type is "number"', () => {
    const htmlInputElement = {
      type: 'number',
      value: '1234',
    } as HTMLInputElement;

    expect(getInputValue(htmlInputElement)).toStrictEqual(1234);
  });

  it('Retrieves the input value as a "number" if the type is "range"', () => {
    const htmlInputElement = {
      type: 'range',
      value: '1234',
    } as HTMLInputElement;

    expect(getInputValue(htmlInputElement)).toStrictEqual(1234);
  });

  it('Retrieves the input value "as is" as fallback', () => {
    const instances = [
      {
        type: 'text',
        value: 'testing',
      },
      {
        type: 'whateva',
        value: { foo: 1, bar: 2 },
      },
      {
        type: 'boo',
        value: null,
      },
    ] as HTMLInputElement[];

    expect.assertions(instances.length);
    instances.forEach((htmlInputElement, index) => {
      const value = getInputValue(htmlInputElement);

      expect(value).toStrictEqual(instances[index].value);
    });
  });
});

describe('Form: handleSubmit', () => {
  it('Executes `onSubmit` when calling `handleSubmit`', () => {
    const onSubmit = vi.fn();
    const form = newForm({
      initialValues: {
        name: '',
      },
      onSubmit,
    });

    form.handleSubmit({} as Event);

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('Executes `event.preventDefault` when calling `handleSubmit`', () => {
    const onSubmit = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preventDefault = vi.fn() as any;
    const form = newForm({
      initialValues: {
        name: '',
      },
      onSubmit,
    });

    form.handleSubmit({
      preventDefault,
    } as Event);

    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('Executes `event.stopPropagation` when calling `handleSubmit`', () => {
    const onSubmit = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stopPropagation = vi.fn() as any;
    const form = newForm({
      initialValues: {
        name: '',
      },
      onSubmit,
    });

    form.handleSubmit({
      stopPropagation,
    } as Event);

    expect(stopPropagation).toHaveBeenCalledOnce();
  });
});
