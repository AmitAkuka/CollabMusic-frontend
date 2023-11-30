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
    "2014winter-s01",
    "2014winter-s02",
    "2014winter-s03",
    "2014winter-s04",
    "2014winter-s05",
    "2014winter-s06",
    "2014winter-s07",
    "2014winter-s08",
    "2014winter-s09",
    "2014winter-s10",
  ],
  country: ["country12", "country13", "country15"],
  hiphop: ["hiphop-s01", "hiphop15"],
  island: [
    "island-e01",
    "island-e02",
    "island-s03",
    "island-t02",
    "island-t03",
    "rock12",
    "rock14",
  ],
  sea: [
    "sea-e01",
    "sea-e02",
    "sea-s01",
    "sea-s03",
    "sea-s04",
    "sea-s06",
    "sea-s07",
    "sea-t01",
    "sea-t02",
    "sea-t04",
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
export const YOUTUBE_API_KEY = "AIzaSyDIdBNqqc22eFS7bwBoScBw97a_QM_YxKA";
export const YOUTUBE_API_KEY_2 = "AIzaSyArNzNzxQ3Vxrf3OSpZq2xhh9WoxopjQQ0";
export const YOUTUBE_SEARCH_URL =
  "https://www.googleapis.com/youtube/v3/search";
export const YOUTUBE_INFO_URL =
  "https://www.googleapis.com/youtube/v3/videos?part=contentDetails";

// videoCategoryId = 10 - music only
// videoDuration = short - 4mins video duration and below
export const YOUTUBE_API_PARAMS =
  "order=relevance&type=video&videoCategoryId=10&videoDuration=short&part=snippet";
