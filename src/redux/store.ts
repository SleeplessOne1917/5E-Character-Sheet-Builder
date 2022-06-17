import { AnyAction, Reducer, configureStore } from '@reduxjs/toolkit';
import editingCharacter, {
	EditingCharacterState
} from './features/editingCharacter';

import generationMethod from './features/generationMethod';
import rollGroups from './features/rollGroups';
import toast from './features/toast';
import viewer from './features/viewer';

export const getStore = () =>
	configureStore({
		reducer: {
			toast,
			viewer,
			editingCharacter: editingCharacter as Reducer<
				EditingCharacterState,
				AnyAction
			>,
			rollGroups,
			generationMethod
		}
	});

export const store = getStore();

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
