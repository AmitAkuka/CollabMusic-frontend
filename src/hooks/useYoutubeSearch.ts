import { youtubeService } from "@/services/youtube.service";
import { YoutubeData } from "@/types";
import { useEffect, useRef, useState } from "react";

export const useYoutubeSearch = () => {
  const [filterBy, setFilterBy] = useState("");
  const [youtubeData, setYoutubeData] = useState<YoutubeData | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const queryYoutubeData = async (nextPageToken?: string, page?: number) => {
    try {
      const data = await youtubeService.onReqYoutubeData(
        filterBy,
        nextPageToken
      );

      !youtubeData
        ? setYoutubeData(data)
        : setYoutubeData((prevState) => ({
            videos: [...(prevState?.videos || []), ...data.videos],
            nextPageToken: data.nextPageToken,
          }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!filterBy) return;
    timeoutRef.current = setTimeout(() => {
      //On filter change - clear old youtube data
      setYoutubeData(null);
      queryYoutubeData();
    }, 350);
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [filterBy]);

  return { queryYoutubeData, setFilterBy, youtubeData };
};
