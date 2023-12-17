export const STORAGE_KEY_LOGGED_USER = "loggedUser";
export const ROOM_ID = "1000";
export const DJ_DEFAULT_POS = { top: 685, left: 752 };
export const PLAYER_DEFAULT_STYLE = {
  height: 295,
  width: 519,
  inline: { left: 583 },
};
export const AVATARS_LIST: { [key: string]: string[] } = {
  base: [
    "base01",
    "base12",
    "base13",
    "base14",
    "base15",
    "classic04",
    "classic05",
  ],
  winter: [
    "2014hw15",
    "2014winters01",
    "2014winters02",
    "2014winters03",
    "2014winters04",
    "2014winters05",
    "2014winters06",
    "2014winters07",
    "2014winters08",
    "2014winters09",
    "2014winters10",
  ],
  country: ["country12", "country13", "country15"],
  hiphop: ["hiphops01", "hiphop15"],
  island: [
    "islande01",
    "islande02",
    "islands03",
    "islandt02",
    "islandt03",
    "rock12",
    "rock14",
  ],
  sea: [
    "seae01",
    "seae02",
    "seas01",
    "seas03",
    "seas04",
    "seas06",
    "seas07",
    "seat01",
    "seat02",
    "seat04",
  ],
  zoo: [
    "zoo01",
    "zoo02",
    "zoo03",
    "zoo04",
    "zoo06",
    "zoo07",
    "zoo08",
    "zoo09",
    "zoo10",
    "zoo11",
    "zoo12",
    "zoo13",
    "zoo14",
    "zoo15",
    "zoo16",
  ],
  rave: ["rave02", "rave06", "rave12"],
  warrior: [
    "warrior01",
    "warrior04",
    "warrior05",
    "warrior06",
    "warrior07",
    "warrior08",
  ],
};

export const SPECIAL_CHARS_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
export const YOUTUBE_SEARCH_URL =
  "https://www.googleapis.com/youtube/v3/search";
export const YOUTUBE_INFO_URL =
  "https://www.googleapis.com/youtube/v3/videos?part=contentDetails";

// videoCategoryId = 10 - music only
// videoDuration = short - 4mins video duration and below
export const YOUTUBE_API_PARAMS =
  "order=relevance&type=video&videoCategoryId=10&videoDuration=short&part=snippet";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_KEY_2 = import.meta.env.VITE_YOUTUBE_API_KEY_2;
const YOUTUBE_API_KEY_3 = import.meta.env.VITE_YOUTUBE_API_KEY_3;
const YOUTUBE_API_KEY_4 = import.meta.env.VITE_YOUTUBE_API_KEY_4;
const YOUTUBE_API_KEY_5 = import.meta.env.VITE_YOUTUBE_API_KEY_5;
const YOUTUBE_API_KEY_6 = import.meta.env.VITE_YOUTUBE_API_KEY_6;
export const YOUTUBE_API_KEYS = [
  YOUTUBE_API_KEY,
  YOUTUBE_API_KEY_2,
  YOUTUBE_API_KEY_3,
  YOUTUBE_API_KEY_4,
  YOUTUBE_API_KEY_5,
  YOUTUBE_API_KEY_6,
];