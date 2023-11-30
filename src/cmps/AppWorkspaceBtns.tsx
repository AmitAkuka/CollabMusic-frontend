import { useModal } from "@/hooks/useModal";
import { AppSearchMusicModal } from "./AppSearchMusicModal";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { roomService } from "@/services/room.service";
import { MusicVote, Video } from "@/types";
import { ROOM_ID } from "@/constants";
import { selectUser } from "@/store/user/userSlice";
import { youtubeService } from "@/services/youtube.service";
import { useCallback, useEffect, useMemo } from "react";
import { socketService } from "@/services/socket.service";
import {
  addVote,
  selectCurrentlyPlaying,
  selectMusicQueue,
} from "@/store/room/roomSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import danceIcon from "@/assets/img/dance-icon.svg";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { QueueList } from "./QueueList";

export const AppWorkspaceBtns = () => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(selectUser);
  const currentlyPlaying = useAppSelector(selectCurrentlyPlaying);
  const queue = useAppSelector(selectMusicQueue);
  const { isModalOpen, setIsModalOpen } = useModal();

  const isInQueue = useMemo(() => {
    if (!queue.length) return false;
    const idx = queue.findIndex((q) => q.user.userId === loggedUser?._id);
    return idx >= 0 ? true : false;
  }, [queue]);

  const votes = useMemo(() => {
    const initialObj = {
      userVote: null,
      voteSummary: {
        likesAmount: 0,
        dislikesAmount: 0,
      },
    };
    if (!currentlyPlaying?.votes?.length) return initialObj;
    const { votes } = currentlyPlaying;
    const userVote = votes.find((vote) => vote.user.userId === loggedUser?._id);

    const voteSummary = votes.reduce(
      (acc, vote) => {
        vote.voteValue === 1
          ? (acc.likesAmount += 1)
          : (acc.dislikesAmount += 1);
        return acc;
      },
      { likesAmount: 0, dislikesAmount: 0 }
    );

    return {
      userVote: userVote?.voteValue !== undefined ? userVote.voteValue : null,
      voteSummary,
    };
  }, [currentlyPlaying]);

  useEffect(() => {
    socketService.on("voteUpdate", async (newVote: MusicVote) => {
      dispatch(addVote(newVote));
    });
    return () => {
      socketService.off("voteUpdate");
    };
  }, []);

  const handleVideoSubmit = async (selectedVideo: Video) => {
    try {
      if (!loggedUser) return;
      const duration = await youtubeService.onReqVideoInfo(
        selectedVideo.videoId
      );
      const { _id, username, avatar } = loggedUser;
      const newMusicQueue = {
        user: { userId: _id, username, avatar },
        video: { ...selectedVideo, duration },
      };
      const updateEvent = { type: "add", data: newMusicQueue };
      await roomService.updateMusicQueueByRoomId(ROOM_ID, updateEvent);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const userVote = votes?.userVote;
  const voteSummary = votes?.voteSummary;

  const handleVoteSubmit = useCallback(
    async (voteValue: number) => {
      try {
        if (!loggedUser || userVote !== null) return;
        const { _id, username } = loggedUser;
        const newVote = { user: { userId: _id, username }, voteValue };
        await roomService.updateMusicVoteByRoomId(ROOM_ID, newVote);
      } catch (err) {
        console.error(err);
      }
    },
    [userVote]
  );

  const handleLeaveQueue = async (userId: string | undefined) => {
    try {
      if (!userId) return;
      const updateEvent = { type: "remove", data: userId };
      await roomService.updateMusicQueueByRoomId(ROOM_ID, updateEvent);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isModalOpen && (
        <AppSearchMusicModal
          setIsModalOpen={setIsModalOpen}
          handleVideoSubmit={handleVideoSubmit}
        />
      )}
      {!isModalOpen && (
        <main className="app-workspace-btns-container">
          <section className="play-song-container">
            {!isInQueue && (
              <button onClick={() => setIsModalOpen((prevState) => !prevState)}>
                <img src={danceIcon} alt="dance-icon" />
                PLAY A SONG
              </button>
            )}
            {isInQueue && (
              <button onClick={() => handleLeaveQueue(loggedUser?._id)}>
                <CancelIcon />
                LEAVE QUEUE
              </button>
            )}
            <QueueList />
          </section>
          {/* {currentlyPlaying && ( */}
          <section className="song-rating-container">
            <div className="rating-btns-container">
              <button
                className={`like-btn ${userVote === 1 ? "selected" : ""}`}
                onClick={() => handleVoteSubmit(1)}
              >
                <ThumbUpIcon />
              </button>
              <button
                className={`dislike-btn ${userVote === 0 ? "selected" : ""}`}
                onClick={() => handleVoteSubmit(0)}
              >
                <ThumbDownIcon />
              </button>
            </div>
            <div className="rating-container">
              {voteSummary && (
                <>
                  <div className="vote-summary-container">
                    <div className="likes-container">
                      <p>{voteSummary.likesAmount}</p>
                    </div>
                    <div className="dislikes-container">
                      <p>{voteSummary.dislikesAmount}</p>
                    </div>
                  </div>
                  <div className="progress-container">
                    <div
                      className="likes-progress-container"
                      style={{ flexGrow: voteSummary.likesAmount }}
                    ></div>
                    <div
                      className="dislikes-progress-container"
                      style={{ flexGrow: voteSummary.dislikesAmount }}
                    ></div>
                  </div>
                </>
              )}
            </div>
          </section>
          {/* )} */}
        </main>
      )}
    </>
  );
};
