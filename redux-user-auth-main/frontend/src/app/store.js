import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authApi } from './services/auth/authService';
import { userApi } from './services/userServices';

const store = configureStore({
  reducer: {
    auth: authReducer,
    
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,

  },
  middleware: (getdefaultMiddleware) => {
    return getdefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(userApi.middleware);
    
  },
});
export default store;
