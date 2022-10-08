export const getMarkdownFromStringArray = (input: string | string[]) =>
	Array.isArray(input)
		? input.reduce<string>((acc, cur) => {
				if (cur.includes('|')) {
					return acc + cur + '\n';
				} else {
					return acc + cur + '\n\n';
				}
		  }, '')
		: input;
