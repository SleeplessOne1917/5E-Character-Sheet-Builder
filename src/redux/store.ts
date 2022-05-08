import { AnyAction, Reducer, configureStore } from '@reduxjs/toolkit';
import editingCharacter, {
	EditingCharacterState
} from './features/editingCharacter';

import toast from './features/toast';
import viewer from './features/viewer';

export const store = configureStore({
	reducer: {
		toast,
		viewer,
		editingCharacter: editingCharacter as Reducer<
			EditingCharacterState,
			AnyAction
		>
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
