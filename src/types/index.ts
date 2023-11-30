export type ComponentRoute = {
  path: string;
  component: React.ComponentType;
  auth: boolean;
  children?: ChildrenRoute[];
};

type ChildrenRoute = {
  index: boolean;
  path?: string;
  component: React.ComponentType;
};

export type ActionType = {
  type: string;
};

export type LoginInput = {
  identifyBy: string;
  password: string;
};

export type UserCred = {
  username?: string;
  email?: string;
  password: string;
};

export type CustomError = {
  errorMsg: string;
  status: number;
};

export type User = {
  _id: string;
  email: string;
  username: string;
  avatar: string;
  isDancing: boolean;
};

export type ChatMessage = {
  chatId: string;
  sender: {
    id: string;
    username: string;
  };
  message: string;
  timestamp: number;
  color: string;
  eventType?: string;
};

export type RoomData = {
  lastPlayingTimestamp: number | null;
  queuedMusic: QueuedMusic[];
  roomId: string;
};

export type QueuedVideo = Video & {
  duration: number;
};

export type Video = {
  videoId: string;
  title: string;
  channelTitle: string;
  imgUrl: string;
};

export type YoutubeData = {
  videos: Video[];
  nextPageToken: string;
};

export type QueuedMusic = {
  video: QueuedVideo;
  user: QueuedUser;
  begginingTS?: number;
};

export type QueuedUser = {
  userId: string;
  username: string;
  avatar: string;
};

export type QueuedMusicPreview = QueuedMusic & {
  isRequirePeekView?: boolean;
};

export type QueueUpdateEvent = {
  type: string;
  data: string | QueuedMusic;
};

export type NormalizedQueuePreview = {
  userId: string;
  username: string;
  avatar: string;
  estimatedQueueTime: number;
  isRequirePeekView: boolean;
  isLoggedUser: boolean;
};

export type PlayingMusic = QueuedMusic & {
  votes: MusicVote[];
};

export type MusicVote = {
  user: {
    userId: string;
    username: string;
  };
  voteValue: number;
};

export type NormalizedAvatarConfig = AvatarConfig & {
  standingImage: string;
  dancingImage: string;
  djImage: string;
};

export type AvatarConfig = {
  id: string;
  username: string;
  image: string;
  isDancing: boolean;
  style: {
    top: number;
    left: number;
    zIndex: number;
  };
};

export type NormalizedAvatarStyle = {
  containerConfig: {
    className: string;
    style: {
      top: number;
      left: number;
      zIndex?: number;
    };
  };
  imageConfig: {
    src: string;
  };
};

export type PureYoutubeData = {
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    publishTime: string;
    publishedAt: string;
    thumbnails: {
      default: YoutubeLink;
      high: YoutubeLink;
      medium: YoutubeLink;
    };
    title: string;
  };
  kind: string;
  nextPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  regionCode: string;
};

export type YoutubeLink = {
  height: number;
  width: number;
  url: string;
};

export type ReactPlayerStyle = {
  inline: {
    left: number;
  };
  width: number;
  height: number;
};
