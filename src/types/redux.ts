import { SliceCaseReducers, ValidateSliceCaseReducers } from '@reduxjs/toolkit';

export type AppReducers<T> = ValidateSliceCaseReducers<T, SliceCaseReducers<T>>;
