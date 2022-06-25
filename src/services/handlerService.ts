import { KeyboardEvent } from 'react';

export function handleKeyDownEvent<TElementType>(
	event: KeyboardEvent<TElementType>,
	handler: () => void
) {
	if (event.code === 'Enter' || event.code === 'Space') {
		event.preventDefault();
		event.stopPropagation();
		handler();
	}
}
