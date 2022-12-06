import { DeepPartial } from '../types/helpers';

type DeepType<T> = T extends number
	? number
	: T extends string
	? string
	: T extends boolean
	? boolean
	: T;

export const deepEquals = (value1: any, value2: any): boolean => {
	if (
		value1 !== null &&
		value2 !== null &&
		typeof value1 === 'object' &&
		typeof value2 === 'object'
	) {
		if (Array.isArray(value1) && Array.isArray(value2)) {
			if (value1.length !== value2.length) {
				return false;
			}

			return value1.every((val, index) => deepEquals(val, value2[index]));
		} else {
			const val1Keys = Object.keys(value1);
			const val2Keys = Object.keys(value2);
			const intersectKeys = val1Keys.filter(val => val2Keys.includes(val));

			if (
				intersectKeys.length === val1Keys.length &&
				intersectKeys.length === val2Keys.length
			) {
				return intersectKeys.every(key => deepEquals(value1[key], value2[key]));
			} else {
				return false;
			}
		}
	} else return value1 === value2;
};

export const deepClone = <T>(obj: DeepType<T>): DeepType<T> =>
	Array.isArray(obj)
		? (obj.map(deepClone) as DeepType<T>)
		: typeof obj === 'object' && obj !== null
		? (Object.entries(obj).reduce<DeepType<T>>(
				(acc, [key, value]) => ({ ...acc, [key]: deepClone(value) }),
				{} as DeepType<T>
		  ) as DeepType<T>)
		: obj;

export const deepMerge = <T>(
	destObj: DeepType<T>,
	...srcObjs: DeepPartial<DeepType<T>>[]
): DeepType<T> => {
	if (srcObjs.length > 1) {
		for (const obj of srcObjs) {
			destObj = deepMerge(destObj, obj);
		}

		return destObj;
	} else if (srcObjs.length === 1) {
		const obj = srcObjs[0];

		if (Array.isArray(destObj) && Array.isArray(obj)) {
			obj.forEach((item, i) => {
				(destObj as any[])[i] = deepMerge(item, obj[i]);
			});

			return destObj;
		} else if (
			typeof destObj === 'object' &&
			destObj !== null &&
			typeof obj === 'object' &&
			obj !== null
		) {
			Object.entries(obj).forEach(([key, value]) => {
				(destObj as Record<string, unknown>)[key] = deepMerge(
					(destObj as Record<string, unknown>)[key],
					value
				);
			});

			return destObj;
		} else if (typeof destObj === typeof obj || destObj === undefined) {
			return obj as DeepType<T>;
		} else {
			throw new Error('Cannot deep merge two different primitive types');
		}
	} else {
		return destObj;
	}
};
