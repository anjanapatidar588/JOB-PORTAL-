import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "../redux/authSlice";
import jobSlice from "../redux/jobSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist Config
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Combine Reducers
const rootReducer = combineReducers({
  auth: authSlice,
  job: jobSlice,
});

// Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor
export const persistor = persistStore(store);
