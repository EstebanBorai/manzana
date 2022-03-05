import { describe, expect, it } from 'vitest';

import { newForm } from '../src';

import type { FormConfig, Values } from '../src/form';

describe('Form: initialValues', () => {
  it('Creates a new form with initial values', () => {
    const initialValues = {
      name: 'Esteban',
      last: 'Borai',
      email: 'esteban@mail.com',
    };
    const form = newForm({
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
    const form = newForm({
      initialValues,
    });

    initialValues.name = 'John';
    initialValues.last = 'Appleseed';
    initialValues.email = 'john@mail.com';

    let values: Values = {};

    form.values.subscribe((state) => (values = state));

    expect(values.name).toStrictEqual('Esteban');
    expect(values.last).toStrictEqual('Borai');
    expect(values.email).toStrictEqual('esteban@mail.com');
  });

  it('Throws a "TypeError" if no "initialValues" are provided to the configuration.', () => {
    expect(() => newForm({} as FormConfig)).toThrowErrorMatchingSnapshot();
  });
});
