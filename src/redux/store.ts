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

import editingRace from './features/editingRace';
import editingSpell from './features/editingSpell';
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
	editingRace
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

export const getStore = async () => {
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
		set(REDUX_CACHE_KEY, theStore.getState());
	}

	return theStore;
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
