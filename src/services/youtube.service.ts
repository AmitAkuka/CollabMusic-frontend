import {
  YOUTUBE_API_KEYS,
  YOUTUBE_API_PARAMS,
  YOUTUBE_INFO_URL,
  YOUTUBE_ISRAEL_MUSIC_TRENDING,
  YOUTUBE_SEARCH_URL,
} from "@/constants";
import { PureYoutubeData, Video, YoutubeData } from "@/types";
import { getErrorMessage, getFormattedIso8601ToSeconds } from "@/utils";
import axios from "axios";
let currentUsedApiKeyIdx = 0;

const onReqYoutubeData = async (
  filterBy: string,
  nextPageToken: string = "",
  maxRetries: number = 2
) => {
  try {
    const requestUrl = filterBy.length
      ? `${YOUTUBE_SEARCH_URL}?q=${filterBy}&${YOUTUBE_API_PARAMS}&pageToken=${nextPageToken}`
      : YOUTUBE_ISRAEL_MUSIC_TRENDING;
    const { data } = await axios.get(
      `${requestUrl}&key=${YOUTUBE_API_KEYS[currentUsedApiKeyIdx]}`
    );
    const normalizedData: Video[] = _normalizeData(data.items);

    const nextToken = data?.nextPageToken ? data.nextPageToken : "";
    return { videos: normalizedData, nextPageToken: nextToken };
  } catch (err) {
    const errMsg = getErrorMessage(err);
    if (errMsg.indexOf("exceeded") >= 0 && maxRetries > 0) {
      currentUsedApiKeyIdx =
        (currentUsedApiKeyIdx + 1) % YOUTUBE_API_KEYS.length;
      const data: YoutubeData = await onReqYoutubeData(
        filterBy,
        nextPageToken,
        maxRetries
      );
      return data;
    }
    throw err;
  }
};

const onReqVideoInfo = async (videoId: string) => {
  try {
    const { data } = await axios.get(
      `${YOUTUBE_INFO_URL}&id=${videoId}&key=${YOUTUBE_API_KEYS[currentUsedApiKeyIdx]}`
    );
    const iso8061Duration = data?.items[0]?.contentDetails?.duration;
    const normalizedDuration = getFormattedIso8601ToSeconds(iso8061Duration);
    return normalizedDuration;
  } catch (err) {
    const errMsg = getErrorMessage(err);
    if (errMsg.indexOf("exceeded") >= 0) {
      currentUsedApiKeyIdx =
        (currentUsedApiKeyIdx + 1) % YOUTUBE_API_KEYS.length;
      const normalizedDuration: number = await onReqVideoInfo(videoId);
      return normalizedDuration;
    }
    throw err;
  }
};

const _normalizeData = (data: PureYoutubeData[]) => {
  return data
    .map((d) => {
      const {
        id,
        snippet: { title, channelTitle, thumbnails },
      } = d;
      //Trending videos will return their id inside id main object and not inside id.videoId.
      const videoId = id?.videoId || id;
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
