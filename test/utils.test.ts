import { describe, expect, it } from 'vitest';

import { clone, diff } from '../src/utils';

describe('Utils: clone', () => {
  it('clones an object w/o overriding values', () => {
    const values = {
      firstName: 'James',
      lastName: 'Bond',
      agentNumber: '007',
      gender: 'male',
      isActive: true,
      inventory: [
        {
          id: 1,
          name: 'foo',
        },
        {
          id: 2,
          name: 'bar',
        },
      ],
    };

    const valuesClone = clone(values);

    expect(valuesClone).toEqual(values);
  });

  it('clones an object overriding values', () => {
    const values = {
      firstName: 'James',
      lastName: 'Bond',
      agentNumber: '007',
      gender: 'male',
      isActive: true,
      inventory: [
        {
          id: 1,
          name: 'foo',
        },
        {
          id: 2,
          name: 'bar',
        },
      ],
    };

    const expected = {
      firstName: 'Bond, James Bond',
      lastName: 'Bond, James Bond',
      agentNumber: 'Bond, James Bond',
      gender: 'Bond, James Bond',
      isActive: 'Bond, James Bond',
      inventory: 'Bond, James Bond',
    };

    const valuesClone = clone(values, 'Bond, James Bond');

    expect(valuesClone).toEqual(expected);
  });

  it('clones arrays w/o holding references', () => {
    expect.assertions(3);

    const inventory = [
      {
        id: 1,
        name: 'foo',
      },
      {
        id: 2,
        name: 'bar',
      },
    ];
    const values = {
      firstName: 'James',
      lastName: 'Bond',
      agentNumber: '007',
      gender: 'male',
      isActive: true,
      inventory,
    };

    const valuesClone = clone(values);

    expect(valuesClone).toEqual(values);

    inventory.push({
      id: 2,
      name: 'baz',
    });

    expect(values.inventory).toEqual([
      {
        id: 1,
        name: 'foo',
      },
      {
        id: 2,
        name: 'bar',
      },
      {
        id: 2,
        name: 'baz',
      },
    ]);
    expect(valuesClone.inventory).toEqual([
      {
        id: 1,
        name: 'foo',
      },
      {
        id: 2,
        name: 'bar',
      },
    ]);
  });

  it('clones objects w/o holding references', () => {
    expect.assertions(3);

    const values = {
      firstName: 'James',
      lastName: 'Bond',
      agentNumber: '007',
      gender: 'male',
      isActive: true,
      pet: {
        kind: 'dog',
        name: 'Meatball',
        age: 2,
      },
    };

    const valuesClone = clone(values);

    expect(valuesClone).toEqual(values);

    values.pet.name = 'Rango';

    expect(values.pet).toEqual({
      kind: 'dog',
      name: 'Rango',
      age: 2,
    });
    expect(valuesClone.pet).toEqual({
      kind: 'dog',
      name: 'Meatball',
      age: 2,
    });
  });
});

describe('Utils: diff', () => {
  it('retrieves keys of fields with different values', () => {
    const notMatchingKeys = diff(
      {
        id: 1,
        name: 'Jack',
        isDog: true,
        isCat: false,
        age: 3,
        kind: 'German Shepherd',
      },
      {
        id: 2,
        name: 'Milk',
        isDog: false,
        isCat: true,
        age: 6,
        kind: 'Common',
      },
    );

    expect(notMatchingKeys).toStrictEqual([
      'id',
      'name',
      'isDog',
      'isCat',
      'age',
      'kind',
    ]);
  });

  it('ignores extra keys from second object (`other`)', () => {
    const notMatchingKeys = diff(
      {
        id: 1,
        name: 'Jack',
        age: 3,
        kind: 'German Shepherd',
      },
      {
        id: 2,
        name: 'Mika',
        isDog: true,
        isCat: false,
        age: 6,
        kind: 'Labrador',
      },
    );

    expect(notMatchingKeys).toStrictEqual(['id', 'name', 'age', 'kind']);
  });

  it('checks for different arrays', () => {
    const notMatchingKeys = diff(
      {
        favoriteFoods: ['Pizza', 'Spaghetti', 'Pasticcio'],
      },
      {
        favoriteFoods: [
          'Tarte Tatin',
          'Boeuf Bourguignon',
          'Blanquette de Veau',
        ],
      },
    );

    expect(notMatchingKeys).toStrictEqual(['favoriteFoods']);
  });

  it('checks for different arrays along other fields', () => {
    const notMatchingKeys = diff(
      {
        name: 'Toto Cotugno',
        favoriteFoods: ['Pizza', 'Spaghetti', 'Pasticcio'],
      },
      {
        name: 'Stromae',
        favoriteFoods: [
          'Tarte Tatin',
          'Boeuf Bourguignon',
          'Blanquette de Veau',
        ],
      },
    );

    expect(notMatchingKeys).toStrictEqual(['name', 'favoriteFoods']);
  });

  it('checks for different arrays along other fields', () => {
    const notMatchingKeys = diff(
      {
        name: 'Toto Cotugno',
        favoriteFoods: ['Pizza', 'Spaghetti', 'Pasticcio'],
      },
      {
        name: 'Stromae',
        favoriteFoods: [
          'Tarte Tatin',
          'Boeuf Bourguignon',
          'Blanquette de Veau',
        ],
      },
    );

    expect(notMatchingKeys).toStrictEqual(['name', 'favoriteFoods']);
  });

  it('checks for nested objects', () => {
    const notMatchingKeys = diff(
      {
        usedLanguages: {
          javascript: true,
          typescript: true,
          svelte: true,
          rust: true,
        },
      },
      {
        usedLanguages: {
          javascript: true,
          typescript: true,
          svelte: true,
          rust: true,
        },
      },
    );

    expect(notMatchingKeys).toStrictEqual([]);
  });
});
