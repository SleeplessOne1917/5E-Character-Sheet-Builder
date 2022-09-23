export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
	  }
	: T extends (infer U)[]
	? DeepPartial<U>[]
	: T;

export type DeepTouched<T> = {
	[K in keyof T]: T[K] extends (infer U)[]
		? { [I in keyof U]: boolean }[]
		: T[K] extends object
		? { [I in keyof T[K]]: boolean }
		: boolean;
};

export type DeepError<T> = {
	[K in keyof T]: T[K] extends (infer U)[]
		? { [I in keyof U]: string }[]
		: T[K] extends object
		? { [I in keyof T[K]]: string }
		: string;
};
