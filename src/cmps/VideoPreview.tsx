import { Video } from "@/types";

type Props = {
  video: Video;
  selectedVideoId: string | undefined;
  setSelectedVideo: (video: Video) => void;
};

export const VideoPreview = ({
  video,
  selectedVideoId,
  setSelectedVideo,
}: Props) => {
  const { videoId, title, channelTitle, imgUrl } = video;
  
  return (
    <div
      className={`video-preview-container ${
        selectedVideoId === videoId ? "selected" : ""
      }`}
      onClick={() => setSelectedVideo(video)}
    >
      <div className="image-container">
        <img src={imgUrl} alt="" />
      </div>
      <h1>{title}</h1>
      <p>{channelTitle}</p>
    </div>
  );
};
