import { AppChat } from "./AppChat";
import ReactPlayer from "react-player/youtube";
import { useRef, useState, useMemo, useEffect } from "react";
import { AppPlayer, AppPlayerHandle } from "./AppPlayer";
import { AppWorkspaceBtns } from "./AppWorkspaceBtns";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  PlayingMusic,
  QueueUpdateEvent,
  QueuedMusic,
  ReactPlayerStyle,
} from "@/types";
import { getReactPlayerStyle, getSecondsPassedFromTs } from "@/utils";
import { socketService } from "@/services/socket.service";
import {
  addToQueue,
  playNewMusic,
  removeFromQueue,
  selectCurrentlyPlaying,
  setRoomData,
} from "@/store/room/roomSlice";
import { selectUser } from "@/store/user/userSlice";
import { roomService } from "@/services/room.service";
import { ROOM_ID } from "@/constants";
import { AppLoader } from "./AppLoader";
import { AvatarList } from "./AvatarList";

export const AppWorkspace = () => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(selectUser);
  const currentlyPlaying = useAppSelector(selectCurrentlyPlaying);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [volume, setVolume] = useState(1);
  const [reactPlayerStyle, setReactPlayerStyle] =
    useState<ReactPlayerStyle | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const appPlayerRef = useRef<AppPlayerHandle>(null);

  useEffect(() => {
    if (!loggedUser) return;
    const initialReactPlayerStyle = getReactPlayerStyle();
    setReactPlayerStyle(initialReactPlayerStyle);
    const joinEvent = roomService.initialJoinEvent(loggedUser);

    socketService.setup();
    socketService.join("joinMusicRoom", joinEvent);
    socketService.on("currentlyPlaying", async (music: PlayingMusic) => {
      setIsReady(false);
      setIsPlaying(false);
      appPlayerRef.current && appPlayerRef.current.handleMediaEnd();
      dispatch(playNewMusic(music));
    });
    socketService.on(
      "musicQueueUpdate",
      async (queueUpdate: QueueUpdateEvent) => {
        const { type, data } = queueUpdate;
        type === "add"
          ? dispatch(addToQueue(data as QueuedMusic))
          : dispatch(removeFromQueue(data as string));
      }
    );

    return () => {
      socketService.off("currentlyPlaying");
      socketService.off("musicQueueUpdate");
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    queryRoomQueue();
  }, []);

  const queryRoomQueue = async () => {
    try {
      setIsLoading(true);
      const roomData = await roomService.queryRoomData(ROOM_ID);
      dispatch(setRoomData(roomData));
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const playerInfo = useMemo(() => {
    const initialPlayerInfo = {
      username: "",
      musicTitle: "",
      totalDuration: 0,
      currDuration: 0,
    };
    if (!playerRef.current || !isReady) return initialPlayerInfo;

    //Had issues with the type of YoutubePlayer.
    const title = (
      playerRef.current as any
    )?.player?.player?.player?.getVideoData()?.title;
    const totalDuration = playerRef.current?.getDuration();
    const currDuration = currentlyPlaying?.begginingTS
      ? getSecondsPassedFromTs(currentlyPlaying?.begginingTS)
      : 0;

    return {
      username: currentlyPlaying?.user.username || "",
      musicTitle: title || initialPlayerInfo.musicTitle,
      totalDuration: totalDuration || initialPlayerInfo.totalDuration,
      currDuration: currDuration || initialPlayerInfo.currDuration,
    };
  }, [isReady]);

  const djAvatar = currentlyPlaying?.user;
  const video = currentlyPlaying?.video;

  return (
    <main className="app-workspace-main-container">
      {isLoading && <AppLoader />}
      {!isLoading && (
        <>
          <AvatarList djAvatar={djAvatar} />
          <AppChat
            loggedUser={loggedUser}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
          />
          <section className="workspace-view-container">
            <ReactPlayer
              key={video?.videoId}
              height={reactPlayerStyle?.height}
              width={reactPlayerStyle?.width}
              style={{
                ...reactPlayerStyle?.inline,
                pointerEvents: "none",
                userSelect: "none",
              }}
              ref={playerRef}
              playing={isPlaying}
              muted={isMuted}
              volume={volume}
              onReady={() => {
                setTimeout(() => setIsPlaying(true), 250);
                if (currentlyPlaying?.begginingTS) {
                  const currentTime = getSecondsPassedFromTs(
                    currentlyPlaying.begginingTS
                  );
                  currentTime && playerRef.current?.seekTo(currentTime);
                }
                setIsReady(true);
              }}
              onEnded={() => {
                setIsReady(false);
                setIsPlaying(false);
              }}
              url={`https://www.youtube.com/watch?v=${video?.videoId}`}
            />
            <AppWorkspaceBtns />
          </section>
          {playerInfo && (
            <AppPlayer
              ref={appPlayerRef}
              djId={djAvatar?.userId}
              playerInfo={playerInfo}
              isChatOpen={isChatOpen}
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              setIsPlaying={setIsPlaying}
              setVolume={setVolume}
              setIsMuted={setIsMuted}
            />
          )}
        </>
      )}
    </main>
  );
};
