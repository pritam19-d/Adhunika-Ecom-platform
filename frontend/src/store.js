import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slicers/apiSlice.js";
import cartSliceReducer from "./slicers/cartSlice.js";
import authSliceReducer from "./slicers/authSlice.js";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat
    (apiSlice.middleware),
  devTools: true
})

export default store