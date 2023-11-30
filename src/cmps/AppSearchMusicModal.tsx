import { useYoutubeSearch } from "@/hooks/useYoutubeSearch";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { VideoList } from "./VideoList";
import InfiniteScroll from "react-infinite-scroller";
import { useRef } from "react";
import { Video } from "@/types";

type Props = {
  setIsModalOpen: (isModalOpen: boolean) => void;
  handleVideoSubmit: (selectedVideo: Video) => void;
};

export const AppSearchMusicModal = ({
  setIsModalOpen,
  handleVideoSubmit,
}: Props) => {
  const { queryYoutubeData, setFilterBy, youtubeData } = useYoutubeSearch();
  const scrollElementRef = useRef<HTMLDivElement | null>(null);

  const handleFilterChange = (input: string) => {
    setFilterBy(input);
  };

  const getScrollElement = () => scrollElementRef.current;

  return (
    <section className="search-music-modal-container">
      <header className="search-music-header-container">
        <ArrowBackIcon
          onClick={() => setIsModalOpen((prevState) => !prevState)}
        />
        <h1>Search Music</h1>
      </header>
      <section className="main-input-container">
        <div className="input-container">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search music here..."
            onChange={({ target }) => handleFilterChange(target.value)}
          />
        </div>
      </section>
      {youtubeData && (
        <div ref={scrollElementRef} className="search-result-container">
          <InfiniteScroll
            className="infinite-scroll-container"
            pageStart={1}
            loadMore={(page) => {
              if (page > 2) return;
              console.log("load more!");
              queryYoutubeData(youtubeData.nextPageToken, page);
            }}
            hasMore={!!youtubeData.nextPageToken.length}
            loader={<h1 key={0}>Loading...</h1>}
            useWindow={false}
            getScrollParent={getScrollElement}
          >
            <VideoList
              videos={youtubeData.videos}
              handleVideoSubmit={handleVideoSubmit}
            />
          </InfiniteScroll>
        </div>
      )}
    </section>
  );
};
