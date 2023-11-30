import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import danceIcon from "@/assets/img/dance-icon.svg";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser, updateDancingState } from "@/store/user/userSlice";
import { socketService } from "@/services/socket.service";
import { ROOM_ID } from "@/constants";

type Props = {
  djId: string | undefined;
  playerInfo: {
    username: string;
    musicTitle: string;
    currDuration: number;
    totalDuration: number;
  };
  isChatOpen: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
};

export type AppPlayerHandle = {
  handleMediaEnd: () => void;
};

export const AppPlayer = forwardRef<AppPlayerHandle, Props>(
  (
    {
      djId,
      playerInfo,
      isChatOpen,
      isPlaying,
      isMuted,
      volume,
      setIsPlaying,
      setVolume,
      setIsMuted,
    },
    ref
  ) => {
    const dispatch = useAppDispatch();
    const loggedUser = useAppSelector(selectUser);
    const { username, musicTitle, currDuration, totalDuration } = playerInfo;
    const [duration, setDuration] = useState(currDuration);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      setDuration(currDuration);
    }, [playerInfo]);

    const handleMediaEnd = () => {
      if (!duration) return;
      setDuration(0);
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          handleMediaEnd,
        };
      },
      []
    );

    useEffect(() => {
      if (!isPlaying) return;
      intervalRef.current = setInterval(() => {
        setDuration((prevState) => prevState + 1);
      }, 1000);
      return () => {
        intervalRef.current && clearInterval(intervalRef.current);
      };
    }, [isPlaying]);

    const progress = useMemo(() => {
      if (duration === 0) return 0;
      return (duration / totalDuration) * 100;
    }, [duration]);

    const getNormalizedDuration = useCallback(
      (totalDuration: number) => {
        if (isNaN(totalDuration) || totalDuration < 0) {
          return "00:00";
        }
        const minutes = Math.floor(totalDuration / 60);
        const remainingSeconds = Math.floor(totalDuration % 60);
        const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
        const secondsStr =
          remainingSeconds < 10
            ? `0${remainingSeconds}`
            : remainingSeconds.toString();
        return `${minutesStr}:${secondsStr}`;
      },
      [totalDuration]
    );

    const handleVolumeChange = (volume: number) => {
      isMuted && setIsMuted((prevState) => !prevState);
      setVolume(volume);
    };

    const handleDanceClick = useCallback(() => {
      if (!loggedUser) return;
      const { _id, isDancing } = loggedUser;
      if (djId === _id) return;
      const updatedIsDancing = !isDancing;
      const updateObj = {
        chatId: ROOM_ID,
        userId: _id,
        isDancing: updatedIsDancing,
      };
      socketService.emit("avatarDancingStateUpdate", JSON.stringify(updateObj));
      dispatch(updateDancingState(updatedIsDancing));
    }, [loggedUser, djId]);

    return (
      <section
        className={`app-player-main-container ${
          isChatOpen ? "chat" : "full"
        }-width`}
      >
        <div className="song-info-main-container">
          {musicTitle && (
            <p>
              {username} <span>is playing</span> {musicTitle}
            </p>
          )}
          {!musicTitle && <p>{musicTitle}</p>}
          <div className="song-sub-info-container">
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p>-{getNormalizedDuration(totalDuration)}</p>
          </div>
        </div>
        <div className="btns-container">
          <button onClick={() => handleDanceClick()}>
            <img src={danceIcon} alt="dance-icon" />
          </button>
          <button onClick={() => setIsPlaying((prevState) => !prevState)}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </button>
          <button onClick={() => setIsMuted((prevState) => !prevState)}>
            {isMuted || !volume ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </button>
          <input
            type="range"
            value={isMuted ? 0 : volume}
            min={0}
            max={1}
            step={0.1}
            onChange={({ target }) => handleVolumeChange(+target.value)}
          />
        </div>
      </section>
    );
  }
);
