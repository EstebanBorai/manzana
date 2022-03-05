import { describe, expect, it } from 'vitest';

import { newForm } from '../src';
import { getInputValue } from '../src/form';

import type { FormConfig, Values } from '../src/form';

describe('Form: initialValues', () => {
  it('Creates a new form with initial values', () => {
    const initialValues = {
      name: 'Esteban',
      last: 'Borai',
      email: 'esteban@mail.com',
    };
    const form = newForm<{ name: string; last: string; email: string }>({
      initialValues,
    });

    let values: Values = {};

    form.values.subscribe((state) => (values = state));

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
    const form = newForm({ initialValues: {} });

    expect(form.values.subscribe).toBeDefined();
  });

  it('Holds "initialValues" when subscribing for the first time', () => {
    const initialValues = { name: 'Lorem', last: 'Ipsum' };
    const form = newForm<typeof initialValues>({ initialValues });

    let values = {} as typeof initialValues;

    form.values.subscribe((state) => (values = state));

    expect(values.name).toStrictEqual('Lorem');
    expect(values.last).toStrictEqual('Ipsum');
  });

  it('Updates $values when "handleChange" is executed', () => {
    const initialValues = { name: 'Lorem', last: 'Ipsum' };
    const form = newForm<typeof initialValues>({ initialValues });

    let values = {} as typeof initialValues;

    form.values.subscribe((state) => (values = state));
    form.handleChange({
      target: {
        name: 'name',
        value: 'Testing!',
        type: 'text',
      },
    } as unknown as Event);

    expect(values.name).toStrictEqual('Testing!');
  });

  it('Updates $values when "setFieldValue" is executed', () => {
    const initialValues = { name: 'Lorem', last: 'Ipsum' };
    const form = newForm<typeof initialValues>({ initialValues });

    let values = {} as typeof initialValues;

    form.values.subscribe((state) => (values = state));
    form.setFieldValue('name', 'Testing!');

    expect(values.name).toStrictEqual('Testing!');
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
