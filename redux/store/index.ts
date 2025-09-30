import { configureStore, combineReducers } from "@reduxjs/toolkit";
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
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import authReducer from "../slices/authSlice";
import jobReducer from "../slices/jobSlice";
import userDataReducer from "../slices/userDataSlice";
import revenueReducer from "../slices/revenueSlice";
import blogReducer from '../slices/blogSlice'
import communityReducer from '../slices/communitySlice'
import subscriberReducer from '../slices/subscribersSlice'
import nannyShareReducer from "../slices/NannyShareData"

const rootReducer = combineReducers({
  subscribers: subscriberReducer,
  auth: authReducer,
  jobs: jobReducer,
  userData: userDataReducer,
  revenue: revenueReducer,
  blogs: blogReducer,
  community : communityReducer,
  nannyShare : nannyShareReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Redux Persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
