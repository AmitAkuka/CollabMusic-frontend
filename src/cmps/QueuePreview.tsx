import { NormalizedQueuePreview } from "@/types";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

type Props = {
  queuePreview: NormalizedQueuePreview;
};

export const QueuePreview = ({ queuePreview: normalizedQueue }: Props) => {
  console.log(normalizedQueue);
  const { userId, username, avatar, estimatedQueueTime, isLoggedUser } =
    normalizedQueue;

  return (
    <div className="queue-preview-container">
      <div
        className={`avatar-preview-container ${
          isLoggedUser ? "logged-user" : ""
        }`}
      >
        <img src={avatar} alt="" />
      </div>
      {isLoggedUser && (
        <>
          <ArrowDropUpIcon />
          <section className="queue-info-container">
            <p>E.T.A {Math.floor(estimatedQueueTime/60)}mins</p>
          </section>
        </>
      )}
    </div>
  );
};
