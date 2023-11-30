import { ROOM_ID } from "@/constants";
import { roomService } from "@/services/room.service";
import { socketService } from "@/services/socket.service";
import { NormalizedAvatarConfig, QueuedUser } from "@/types";
import { useCallback, useState, useEffect } from "react";
import { AvatarPreview } from "./AvatarPreview";
type Props = {
  djAvatar: QueuedUser | undefined;
};
export const AvatarList = ({ djAvatar }: Props) => {
  const [avatarsConfig, setAvatarsConfig] = useState<NormalizedAvatarConfig[]>(
    []
  );

  useEffect(() => {
    socketService.on("avatarUpdate", async (data: string) => {
      try {
        const avatarsUpdate = JSON.parse(data);
        const updatedAvatarConfig = await roomService.getAvatarsConfig(
          avatarsUpdate
        );
        setAvatarsConfig(updatedAvatarConfig);
      } catch (err) {
        console.error(err);
      }
    });
    socketService.emit("getInitialAvatarUpdate", ROOM_ID);

    return () => {
      socketService.off("avatarUpdate");
    };
  }, []);

  useEffect(() => {
    socketService.on("avatarDancingStateUpdate", async (data: string) => {
      try {
        const avatarUpdate = JSON.parse(data);
        const { userId, isDancing } = avatarUpdate;
        const avatarIdx = avatarsConfig.findIndex((a) => a.id === userId);
        if (avatarIdx === -1) return;
        const avatarConfigCopy = JSON.parse(JSON.stringify(avatarsConfig));
        avatarConfigCopy[avatarIdx].isDancing = isDancing;
        setAvatarsConfig(avatarConfigCopy);
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      socketService.off("avatarDancingStateUpdate");
    };
  }, [avatarsConfig]);

  const getAvatarContainerStyle = useCallback(
    (avatarConfig: NormalizedAvatarConfig) => {
      return roomService.getAvatarStyle(avatarConfig, djAvatar);
    },
    [djAvatar]
  );

  return (
    <section className="avatars-list-container">
      {!!avatarsConfig.length &&
        avatarsConfig.map((avatarConfig) => (
          <AvatarPreview
            key={avatarConfig.id}
            avatarConfig={avatarConfig}
            getAvatarContainerStyle={getAvatarContainerStyle}
          />
        ))}
    </section>
  );
};
