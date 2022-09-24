export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
	  }
	: T extends (infer U)[]
	? DeepPartial<U>[]
	: T;

export type DeepTouched<T> = T extends object
	? {
			[K in keyof T]?: DeepTouched<Required<T>[K]>;
	  }
	: T extends (infer U)[]
	? DeepTouched<U>[]
	: boolean;

export type DeepError<T> = T extends object
	? {
			[K in keyof T]?: DeepError<Required<T>[K]>;
	  }
	: T extends (infer U)[]
	? DeepError<U>[]
	: string;
