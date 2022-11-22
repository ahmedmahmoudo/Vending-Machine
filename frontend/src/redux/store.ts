import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth.slice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import productSlice from "./products/product.slice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authSlice.reducer,
    products: productSlice.reducer,
  })
);

const appStore = configureStore({
  reducer: persistedReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware({ serializableCheck: false }),
});

type RootState = ReturnType<typeof appStore.getState>;
type AppDispatch = typeof appStore.dispatch;

const persistor = persistStore(appStore);

export { appStore, persistor };
export type { RootState, AppDispatch };
