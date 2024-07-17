import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loginSlice from "./Features/counterSlice";
import formReducer from "./Features/formSlice"; 
import usersReducer from './Features/usersSlice';
import clientsReducer from './Features/clientsSlice';
import candidatesReducer from './Features/candidatesSlice';
 
 


// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  login: loginSlice,
  form: formReducer, 
  users: usersReducer,
  clients: clientsReducer,
  candidates: candidatesReducer,
  // Add other reducers if needed
});

// Configure the Redux store with the root reducer
export const store = configureStore({
  reducer: rootReducer,
});
