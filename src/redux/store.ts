import {
	AnyAction,
	ConfigureStoreOptions,
	ListenerEffect,
	Reducer,
	ThunkDispatch,
	configureStore,
	createListenerMiddleware
} from '@reduxjs/toolkit';
import editingCharacter, {
	EditingCharacterState
} from './features/editingCharacter';
import { get, set } from 'idb-keyval';

import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import editingClass from './features/editingClass';
import editingRace from './features/editingRace';
import editingSpell from './features/editingSpell';
import editingSubrace from './features/editingSubrace';
import generationMethod from './features/generationMethod';
import rollGroups from './features/rollGroups';
import toast from './features/toast';

const getReducer = () => ({
	toast,
	editingCharacter: editingCharacter as Reducer<
		EditingCharacterState,
		AnyAction
	>,
	rollGroups,
	generationMethod,
	editingSpell,
	editingRace,
	editingSubrace,
	editingClass
});

const indexedDbCacheListener = createListenerMiddleware();

const REDUX_CACHE_KEY = 'redux-cache';

const updateCache: ListenerEffect<
	AnyAction,
	unknown,
	ThunkDispatch<unknown, unknown, AnyAction>,
	unknown
> = (action, { getState }) => {
	set(REDUX_CACHE_KEY, getState());
};

const updateCachePredicate = () => true;

export const getStoreAndCleanup = async (): Promise<
	[ToolkitStore, () => void]
> => {
	indexedDbCacheListener.startListening({
		predicate: updateCachePredicate,
		effect: updateCache
	});

	const options: ConfigureStoreOptions = {
		reducer: getReducer(),
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware().prepend(indexedDbCacheListener.middleware)
	};

	const reduxCache = await get(REDUX_CACHE_KEY);
	if (reduxCache) {
		options.preloadedState = reduxCache;
	}

	const theStore = configureStore(options);
	if (!reduxCache) {
		await set(REDUX_CACHE_KEY, theStore.getState());
	}

	return [
		theStore,
		() => {
			indexedDbCacheListener.stopListening({
				predicate: updateCachePredicate,
				effect: updateCache
			});
		}
	];
};

export const getTestStore = (
	reducerOverrides?: Partial<ReturnType<typeof getReducer>>
) =>
	configureStore({
		reducer: { ...getReducer(), ...reducerOverrides },
		devTools: false
	});

const store = getTestStore();

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
