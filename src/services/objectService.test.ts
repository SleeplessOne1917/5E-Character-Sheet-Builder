import { deepClone, deepEquals, deepMerge } from './objectService';

import { DeepPartial } from '@reduxjs/toolkit';

describe('deepEquals', () => {
	it('returns true with strings that are equal', () => {
		const val1 = 'foo';
		const val2 = 'foo';

		const result = deepEquals(val1, val2);

		expect(result).toBeTruthy();
	});

	it('returns false with strings that are not equal', () => {
		const val1 = 'foo';
		const val2 = 'bar';

		const result = deepEquals(val1, val2);

		expect(result).toBeFalsy();
	});

	it('returns true for numbers that are equal', () => {
		const val1 = 42;
		const val2 = 42;

		const result = deepEquals(val1, val2);

		expect(result).toBeTruthy();
	});

	it('returns false for numbers that are not equal', () => {
		const val1 = 42;
		const val2 = 17;

		const result = deepEquals(val1, val2);

		expect(result).toBeFalsy();
	});

	it('returns true for booleans that are equal to eachother', () => {
		const val1 = true;
		const val2 = true;

		const result = deepEquals(val1, val2);

		expect(result).toBeTruthy();
	});

	it('returns false for booleans that are not equal to eachother', () => {
		const val1 = true;
		const val2 = false;

		const result = deepEquals(val1, val2);

		expect(result).toBeFalsy();
	});

	it('returns true for objects with the shame shape and values', () => {
		const val1 = {
			foo: { bar: 'bar' },
			baz: { spam: 'eggs', qux: { foo: 'foo' } }
		};
		const val2 = {
			foo: { bar: 'bar' },
			baz: { spam: 'eggs', qux: { foo: 'foo' } }
		};

		const result = deepEquals(val1, val2);

		expect(result).toBeTruthy();
	});

	it('returns false for objects with the shame shape and different values', () => {
		const val1 = {
			foo: { bar: 'bar' },
			baz: { spam: 'eggs', qux: { foo: 'foo' } }
		};
		const val2 = {
			foo: { bar: 'bar' },
			baz: { spam: 'waffles', qux: { foo: 'foo' } }
		};

		const result = deepEquals(val1, val2);

		expect(result).toBeFalsy();
	});

	it('returns false for objects with different shapes', () => {
		const val1 = {
			foo: { bar: 'bar' },
			baz: { spam: 'eggs', qux: { foo: 'foo' } }
		};
		const val2 = {
			foo: { bar: 'bar' },
			property: 60,
			data: {
				title: 'Foo',
				value: 'ffef3535434'
			}
		};

		const result = deepEquals(val1, val2);

		expect(result).toBeFalsy();
	});

	it('returns true for equal arrays', () => {
		const val1 = [1, 2, 3, 4, 5];
		const val2 = [1, 2, 3, 4, 5];

		const result = deepEquals(val1, val2);

		expect(result).toBeTruthy();
	});

	it('returns false for unequal length arrays', () => {
		const val1 = [1, 2, 3, 4, 5];
		const val2 = [1, 2, 3, 4, 5, 6];

		const result = deepEquals(val1, val2);

		expect(result).toBeFalsy();
	});

	it('returns true for equal nested arrays', () => {
		const val1 = [
			[['foo', 'bar'], ['baz']],
			[['qux']],
			[['deeply', 'nested'], ['arrays']]
		];
		const val2 = [
			[['foo', 'bar'], ['baz']],
			[['qux']],
			[['deeply', 'nested'], ['arrays']]
		];

		const result = deepEquals(val1, val2);

		expect(result).toBeTruthy();
	});

	it('returns false for unequal nested arrays', () => {
		const val1 = [
			[['foo', 'bar'], ['baz']],
			[['qux']],
			[['deeply', 'nested'], ['arrays']]
		];
		const val2 = [
			[['I', 'am'], ['baz']],
			[['different']],
			[['deeply', 'nested'], ['arrays']]
		];

		const result = deepEquals(val1, val2);

		expect(result).toBeFalsy();
	});

	it('returns true for objects nested in arrays nested in objects etc when they are equal', () => {
		const val1 = [
			[{ foo: 'foo' }, { foo: 'baz', bar: [{ prop: 12 }] }],
			[
				{ foo: 'bar', bar: [{ prop: 72 }] },
				{ foo: 'qux', baz: false }
			]
		];
		const val2 = [
			[{ foo: 'foo' }, { foo: 'baz', bar: [{ prop: 12 }] }],
			[
				{ foo: 'bar', bar: [{ prop: 72 }] },
				{ foo: 'qux', baz: false }
			]
		];

		const result = deepEquals(val1, val2);

		expect(result).toBeTruthy();
	});

	it('returns false for objects nested in arrays nested in objects etc when they are different', () => {
		const val1 = [
			[{ foo: 'foo' }, { foo: 'baz', bar: [{ prop: 12 }] }],
			[
				{ foo: 'bar', bar: [{ prop: 72 }] },
				{ foo: 'qux', baz: false }
			]
		];
		const val2 = [
			[{ foo: 'different' }, { foo: 'baz', bar: [{ prop: 12 }] }],
			[
				{ foo: 'bar', bar: [{ prop: 72 }] },
				{ foo: 'stuff', baz: false }
			]
		];

		const result = deepEquals(val1, val2);

		expect(result).toBeFalsy();
	});
});

describe('deepClone', () => {
	it('returns same reference for primitives', () => {
		expect(deepClone(5)).toBe(5);
		expect(deepClone('foo')).toBe('foo');
		expect(deepClone(true)).toBe(true);
		expect(deepClone(undefined)).toBe(undefined);
		expect(deepClone(null)).toBe(null);
	});

	it('returns different object with same values', () => {
		const testInput = {
			foo: 'foo',
			bar: {
				qux: {
					spam: 'spam'
				},
				baz: 5
			}
		};

		const result = deepClone(testInput);

		// Same values
		expect(result.foo).toBe(testInput.foo);
		expect(result.bar.qux.spam).toBe(testInput.bar.qux.spam);
		expect(result.bar.baz).toBe(testInput.bar.baz);

		// Different objects
		expect(result).not.toBe(testInput);
		expect(result.bar).not.toBe(testInput.bar);
		expect(result.bar.qux).not.toBe(testInput.bar.qux);
	});

	it('returns different array with same values', () => {
		const testInput = [
			{ foo: 'foo', bar: 'bar' },
			{ foo: 'bar', bar: 'foo' }
		];

		const result = deepClone(testInput);

		// Same values
		expect(result[0].foo).toBe(testInput[0].foo);
		expect(result[0].bar).toBe(testInput[0].bar);
		expect(result[1].foo).toBe(testInput[1].foo);
		expect(result[1].bar).toBe(testInput[1].bar);

		// Different values
		expect(result).not.toBe(testInput);
		expect(result[0]).not.toBe(testInput[0]);
		expect(result[1]).not.toBe(testInput[1]);
	});

	it('works correctly with arrays nested in objects nested in array etc', () => {
		const testInput = {
			fooArray: [{ foo: { bar: [5] } }, { foo: { bar: [11, 29] } }]
		};

		const result = deepClone(testInput);

		// Same values
		expect(result.fooArray[0].foo.bar[0]).toBe(
			testInput.fooArray[0].foo.bar[0]
		);
		expect(result.fooArray[1].foo.bar[0]).toBe(
			testInput.fooArray[1].foo.bar[0]
		);
		expect(result.fooArray[1].foo.bar[1]).toBe(
			testInput.fooArray[1].foo.bar[1]
		);

		// Different objects
		expect(result).not.toBe(testInput);
		expect(result.fooArray).not.toBe(testInput.fooArray);
		expect(result.fooArray[0]).not.toBe(testInput.fooArray[0]);
		expect(result.fooArray[0].foo).not.toBe(testInput.fooArray[0].foo);
		expect(result.fooArray[0].foo.bar).not.toBe(testInput.fooArray[0].foo.bar);
		expect(result.fooArray[1]).not.toBe(testInput.fooArray[1]);
		expect(result.fooArray[1].foo).not.toBe(testInput.fooArray[1].foo);
		expect(result.fooArray[1].foo.bar).not.toBe(testInput.fooArray[1].foo.bar);
	});
});

type TestType = { foo: string; bar?: number };

describe('deepMerge', () => {
	it('returns rightmost value when merging primitives', () => {
		expect(deepMerge(5, 56)).toBe(56);
		expect(deepMerge('bar', 'foo')).toBe('foo');
		expect(deepMerge(false, true)).toBe(true);
	});

	it('merges objects', () => {
		const testInput: TestType = { foo: 'foo' };
		const mergeInput: DeepPartial<TestType> = { bar: 50 };

		const result = deepMerge(testInput, mergeInput);

		expect(result).toBe(testInput);
		expect(result.bar).toBe(mergeInput.bar);
	});

	it('merges arrays', () => {
		const testInput: TestType[] = [{ foo: 'foo' }, { foo: 'bar' }];
		const mergeInput: DeepPartial<TestType>[] = [
			{ bar: 6 },
			{ foo: 'something else' }
		];

		const result = deepMerge(testInput, mergeInput);

		expect(result).toBe(testInput);
		expect(result[0].bar).toBe(mergeInput[0].bar);
		expect(result[1].foo).toBe(mergeInput[1].foo);
	});

	it('merges more than 2 items', () => {
		const testInput: TestType = { foo: 'foo' };
		const mergeInput1: DeepPartial<TestType> = { foo: 'baz', bar: 11 };
		const mergeInput2: DeepPartial<TestType> = { foo: 'bar' };

		const result = deepMerge(testInput, mergeInput1, mergeInput2);

		expect(result).toBe(testInput);
		expect(result.foo).toBe(mergeInput2.foo);
		expect(result.bar).toBe(mergeInput1.bar);
	});
});
