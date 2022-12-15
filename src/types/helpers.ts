export type DeepPartial<T> = T extends (infer U)[]
	? DeepPartial<U>[]
	: T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
	  }
	: T;

export type DeepTouched<T> = T extends (infer U)[]
	? DeepTouched<U>[]
	: T extends object
	? {
			[K in keyof T]?: DeepTouched<Required<T>[K]>;
	  }
	: boolean;

export type DeepError<T> = T extends (infer U)[]
	? DeepError<U>[]
	: T extends object
	? {
			[K in keyof T]?: DeepError<Required<T>[K]>;
	  }
	: string;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = T | U extends object
	? (Without<T, U> & U) | (Without<U, T> & T)
	: T | U;
