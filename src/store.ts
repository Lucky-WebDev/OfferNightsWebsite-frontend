import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducer';
import thunk from 'redux-thunk';
import setAuthToken from './api/setAuthToken';

import storage from 'redux-persist/lib/storage';
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';


const rootPersistConfig = {
  key: 'user',
  storage,
}

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)

// const persistConfig = {
//   key: 'counter',
//   storage,
// };

// // const reducers = combineReducers({ counter: counterSlice });

// const logger = createLogger();

// const promise = () => (next: any) => (action: any) => (
//     typeof action.then === 'function'
//         ? Promise.resolve(action).then(next, (error: any) => {
//             throw error; // To let the caller handle the rejection
//         })
//         : next(action)
// )

// const enhancer = process.env.REACT_APP_ENABLE_REDUX_DEVTOOL_EXTENSION === 'True' ?
//     composeWithDevTools(
//         process.env.REACT_APP_ENABLE_REDUX_LOGGER === 'True' ?
//             applyMiddleware(thunk, promise, logger) :
//             applyMiddleware(thunk, promise)
//     ) :
//     compose(
//         process.env.REACT_APP_ENABLE_REDUX_LOGGER === 'True' ?
//             applyMiddleware(thunk, promise, logger) :
//             applyMiddleware(thunk, promise)
//     );

//     const persistedReducer = persistReducer(persistConfig, rootReducer);
// // export default function configureStore(onCompletion: any) {
// export default function configureStore() {
//     const store: any = createStore(persistedReducer, enhancer);
//     const persistor = persistStore(store);
//     return { store, persistor };
// }


// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export default configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({
//           serializableCheck: {
//               ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//           },
//       }),
// });


// const initialState = {};
// const middlewares = [thunk];

// declare global {
//   interface Window {
//     __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
//   }
// }

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(
//   rootReducer,
//   initialState,
//   composeEnhancers(applyMiddleware(...middlewares))
// );

// export default store;