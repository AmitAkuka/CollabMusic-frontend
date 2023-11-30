import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store.config";
import { userService } from "@/services/user.service";
import { User } from "@/types";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: userService.getLoggedinUser(),
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    updateDancingState: (state, action: PayloadAction<boolean>) => {
      if (!state.user) return;
      const updatedIsDancing = action.payload;
      state.user = { ...state.user, isDancing: updatedIsDancing };
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      if (!state.user) return;
      const updatedAvatar = action.payload;
      state.user = { ...state.user, avatar: updatedAvatar };
    },
  },
});

export const { setUser, updateDancingState, updateUserAvatar } =
  userSlice.actions;

export const selectUser = (state: RootState) => state.userModule.user;

export default userSlice.reducer;
