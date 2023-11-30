import {
  AvatarConfig,
  MusicVote,
  NormalizedAvatarConfig,
  QueueUpdateEvent,
  QueuedUser,
  User,
} from "@/types";
import { httpService } from "./http.service";
import {
  adjustAvatarPositionForScreenSize,
  getRandomAvatarPosition,
} from "@/utils";
import { DJ_DEFAULT_POS, ROOM_ID } from "@/constants";

const queryRoomData = async (roomId: string) => {
  try {
    const roomData = await httpService.get(`room/${roomId}`);
    return roomData;
  } catch (err) {
    console.error(err);
  }
};

const updateMusicQueueByRoomId = async (
  roomId: string,
  body: QueueUpdateEvent
) => {
  try {
    await httpService.put(`room/musicQueue/${roomId}`, body);
  } catch (err) {
    console.error(err);
  }
};

const updateMusicVoteByRoomId = async (roomId: string, newVote: MusicVote) => {
  try {
    await httpService.put(`room/vote/${roomId}`, newVote);
  } catch (err) {
    console.error(err);
  }
};

const initialJoinEvent = (loggedUser: User) => {
  const avatarStyle = getRandomAvatarPosition();
  return JSON.stringify({
    _id: loggedUser?._id,
    username: loggedUser?.username,
    isDancing: loggedUser?.isDancing,
    chatId: ROOM_ID,
    avatarData: {
      image: loggedUser?.avatar,
      style: avatarStyle,
    },
  });
};

const getAvatarsConfig = async (avatarsUpdate: AvatarConfig[]) => {
  try {
    //Loading each avatar image.
    const avatarsConfig = await Promise.all(
      avatarsUpdate.map(async (avatar) => {
        const loadedStandingImage = await import(
          `../assets/img/${avatar.image}.gif`
        );
        const loadedDancingImage = await import(
          `../assets/img/${avatar.image}__dancing.gif`
        );
        const loadedDjImage = await import(
          `../assets/img/${avatar.image}__djing.gif`
        );
        const { top, left } = avatar.style;
        const adjustedPos = adjustAvatarPositionForScreenSize(top, left);
        return {
          ...avatar,
          standingImage: loadedStandingImage.default,
          dancingImage: loadedDancingImage.default,
          djImage: loadedDjImage.default,
          style: { ...avatar.style, ...adjustedPos },
        };
      })
    );

    return avatarsConfig;
  } catch (err) {
    throw err;
  }
};

const getAvatarStyle = (
  avatarConfig: NormalizedAvatarConfig,
  djAvatar: QueuedUser | undefined
) => {
  const { id, isDancing, standingImage, dancingImage, djImage, style } =
    avatarConfig;
  const isDj = id === djAvatar?.userId;
  let avatarImage;
  if (isDj) avatarImage = djImage;
  else if (isDancing) avatarImage = dancingImage;
  else avatarImage = standingImage;
  return {
    containerConfig: {
      className: isDj ? "dj-avatar" : "crowd-avatar",
      style: isDj
        ? adjustAvatarPositionForScreenSize(
            DJ_DEFAULT_POS.top,
            DJ_DEFAULT_POS.left,
            isDj
          )
        : style,
    },
    imageConfig: {
      src: avatarImage,
    },
  };
};

export const roomService = {
  queryRoomData,
  updateMusicQueueByRoomId,
  updateMusicVoteByRoomId,
  initialJoinEvent,
  getAvatarsConfig,
  getAvatarStyle,
};
