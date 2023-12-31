import { Video } from "@/types";
import { VideoPreview } from "./VideoPreview";
import { useState } from "react";
import AlbumIcon from "@mui/icons-material/Album";

type Props = {
  videos: Video[];
  handleVideoSubmit: (video: Video) => void;
};

export const VideoList = ({ videos, handleVideoSubmit }: Props) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <div className="video-list-container">
      {videos.map((video, idx) => (
        <VideoPreview
          key={video.videoId + idx}
          video={video}
          selectedVideoId={selectedVideo?.videoId}
          setSelectedVideo={setSelectedVideo}
        />
      ))}
      {selectedVideo && (
        <button onClick={() => handleVideoSubmit(selectedVideo)}>
          <AlbumIcon />
          Join Queue!
        </button>
      )}
    </div>
  );
};
