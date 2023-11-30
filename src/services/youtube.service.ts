import {
  YOUTUBE_API_KEY,
  YOUTUBE_API_KEY_2,
  YOUTUBE_API_PARAMS,
  YOUTUBE_INFO_URL,
  YOUTUBE_SEARCH_URL,
} from "@/constants";
import { PureYoutubeData, Video, YoutubeData } from "@/types";
import { getErrorMessage, getFormattedIso8601ToSeconds } from "@/utils";
import axios from "axios";
let currentUsedApiKey = YOUTUBE_API_KEY;

const onReqYoutubeData = async (
  filterBy: string,
  nextPageToken: string = ""
) => {
  try {
    const { data } = await axios.get(
      `${YOUTUBE_SEARCH_URL}?q=${filterBy}&${YOUTUBE_API_PARAMS}&key=${currentUsedApiKey}&pageToken=${nextPageToken}`
    );
    const normalizedData: Video[] = _normalizeData(data.items);
    const nextToken = data?.nextPageToken ? data.nextPageToken : "";
    return { videos: normalizedData, nextPageToken: nextToken };
  } catch (err) {
    const errMsg = getErrorMessage(err);
    if (errMsg.indexOf("exceeded") >= 0) {
      currentUsedApiKey = YOUTUBE_API_KEY_2;
      const data: YoutubeData = await onReqYoutubeData(filterBy, nextPageToken);
      return data;
    }
    throw err;
  }
};

const onReqVideoInfo = async (videoId: string) => {
  try {
    const { data } = await axios.get(
      `${YOUTUBE_INFO_URL}&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const iso8061Duration = data?.items[0]?.contentDetails?.duration;
    const normalizedDuration = getFormattedIso8601ToSeconds(iso8061Duration);
    return normalizedDuration;
  } catch (err) {
    throw err;
  }
};

const _normalizeData = (data: PureYoutubeData[]) => {
  return data
    .map((d) => {
      const {
        id: { videoId },
        snippet: { title, channelTitle, thumbnails },
      } = d;
      //Sometimes youtube API returning channels and not actuall video
      //in results. A channel wont contain a videoId.
      if (!videoId) return null;
      return {
        videoId,
        title,
        channelTitle,
        imgUrl: thumbnails.high.url,
      } as Video;
    })
    .filter((video): video is Video => video !== null);
};

export const youtubeService = {
  onReqYoutubeData,
  onReqVideoInfo,
};
