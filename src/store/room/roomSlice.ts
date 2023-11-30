import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store.config";
import { MusicVote, QueuedMusic, PlayingMusic } from "@/types";

type RoomState = {
  roomId: string | null;
  musicQueue: QueuedMusic[];
  currentlyPlaying: PlayingMusic | null;
  currentVotes: MusicVote[];
};

const initialState: RoomState = {
  roomId: null,
  musicQueue: [],
  currentlyPlaying: null,
  currentVotes: [],
};

export const roomSlice = createSlice({
  name: "musicQueue",
  initialState,
  reducers: {
    setRoomData: (state, action: PayloadAction<RoomState>) => {
      const { roomId, musicQueue, currentlyPlaying, currentVotes } =
        action.payload;
      state.roomId = roomId;
      state.musicQueue = musicQueue;
      state.currentlyPlaying = currentlyPlaying;
      state.currentVotes = currentVotes;
    },
    setCurrentlyPlaying: (
      state,
      action: PayloadAction<PlayingMusic | null>
    ) => {
      state.currentlyPlaying = action.payload;
    },
    playNewMusic: (state, action: PayloadAction<PlayingMusic>) => {
      const music = action.payload;
      state.currentlyPlaying = music;
      state.musicQueue = state.musicQueue.slice(1);
    },
    addToQueue: (state, action: PayloadAction<QueuedMusic>) => {
      const music = action.payload;
      state.musicQueue = [...state.musicQueue, music];
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.musicQueue = state.musicQueue.filter(
        (queuedMusic: QueuedMusic) => queuedMusic.user.userId !== userId
      );
    },
    addVote: (state, action: PayloadAction<MusicVote>) => {
      if (!state.currentlyPlaying) return;
      const newVote = action.payload;
      state.currentlyPlaying.votes = [
        ...state.currentlyPlaying?.votes,
        newVote,
      ];
    },
  },
});

export const {
  setRoomData,
  setCurrentlyPlaying,
  playNewMusic,
  addToQueue,
  removeFromQueue,
  addVote,
} = roomSlice.actions;

export const selectMusicQueue = (state: RootState) =>
  state.roomModule.musicQueue;
export const selectCurrentlyPlaying = (state: RootState) =>
  state.roomModule.currentlyPlaying;
export const selectCurrentVotes = (state: RootState) =>
  state.roomModule.currentVotes;

export default roomSlice.reducer;
