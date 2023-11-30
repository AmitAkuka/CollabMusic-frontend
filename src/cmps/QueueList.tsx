import { useAppSelector } from "@/store/hooks";
import { selectMusicQueue } from "@/store/room/roomSlice";
import { selectUser } from "@/store/user/userSlice";
import { QueuePreview } from "./QueuePreview";
import { NormalizedQueuePreview, QueuedMusicPreview } from "@/types";
import { useCallback, useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export const QueueList = () => {
  const [queuePreview, setQueuePreview] = useState<NormalizedQueuePreview[]>(
    []
  );
  const loggedUser = useAppSelector(selectUser);
  const queue = useAppSelector(selectMusicQueue);

  useEffect(() => {
    if (!queue.length) {
      //if queuePreview is not empty - clean it.
      queuePreview.length && setQueuePreview([]);
      return;
    }
    loadNormalizedQueue();
  }, [queue]);

  const loadNormalizedQueue = useCallback(async () => {
    let estimatedQueueTime = 0;
    const loggedUserIdx = queue.findIndex(
      (q) => q.user.userId === loggedUser?._id
    );
    let queueToPreview: QueuedMusicPreview[] =
      queue.length > 5 ? queue.slice(0, 5) : [...queue];
    if (loggedUserIdx) {
      if (loggedUserIdx > 4) {
        queueToPreview[4] = {
          ...queue[loggedUserIdx],
          isRequirePeekView: true,
        };
      }
    }

    const loadedData = await Promise.all(
      queueToPreview.map(async (queuedMusic: QueuedMusicPreview) => {
        const { user, video, isRequirePeekView } = queuedMusic;
        const loadedAvatarPreviewImage = await import(
          `../assets/img/${user.avatar}.png`
        );
        estimatedQueueTime += video.duration;
        return {
          ...user,
          isLoggedUser: loggedUser?._id === user.userId,
          isRequirePeekView: isRequirePeekView || false,
          avatar: loadedAvatarPreviewImage.default,
          estimatedQueueTime,
        };
      })
    );
    setQueuePreview(loadedData);
  }, [queue]);

  return (
    <section className="queue-list-container">
      {!!queue.length &&
        !!queuePreview.length &&
        queuePreview.map((normalizedQueue, idx: number) => (
          <>
            {normalizedQueue.isRequirePeekView && <MoreHorizIcon />}
            <QueuePreview
              key={normalizedQueue.userId + idx}
              queuePreview={normalizedQueue}
            />
            {idx === 4 &&
              !normalizedQueue.isRequirePeekView &&
              queue.length > 5 && <MoreHorizIcon />}
          </>
        ))}
    </section>
  );
};
