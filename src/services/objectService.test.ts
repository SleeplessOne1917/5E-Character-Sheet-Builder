import { deepEquals } from './objectService';

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
