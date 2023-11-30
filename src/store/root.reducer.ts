import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import roomSlice from "./room/roomSlice";

export const rootReducer = combineReducers({
  userModule: userSlice,
  roomModule: roomSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
