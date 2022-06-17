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
import { useEffect, useState } from 'react';

import generationMethod from './features/generationMethod';
import rollGroups from './features/rollGroups';
import toast from './features/toast';
import viewer from './features/viewer';

const reducer = {
	toast,
	viewer,
	editingCharacter: editingCharacter as Reducer<
		EditingCharacterState,
		AnyAction
	>,
	rollGroups,
	generationMethod
};

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

const getStore = async () => {
	indexedDbCacheListener.startListening({
		predicate: updateCachePredicate,
		effect: updateCache
	});

	const options: ConfigureStoreOptions = {
		reducer,
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

export const useStore = () => {
	const [theStore, setTheStore] = useState(getTestStore());

	useEffect(() => {
		getStore().then(s => {
			setTheStore(s);
		});

		return () => {
			indexedDbCacheListener.stopListening({
				predicate: updateCachePredicate,
				effect: updateCache
			});
		};
	}, [setTheStore]);

	return theStore;
};

export const getTestStore = () => configureStore({ reducer });

const store = getTestStore();

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
