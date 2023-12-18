import { useYoutubeSearch } from "@/hooks/useYoutubeSearch";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { VideoList } from "./VideoList";
import InfiniteScroll from "react-infinite-scroller";
import { FormEvent, useRef } from "react";
import { Video } from "@/types";

type Props = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleVideoSubmit: (selectedVideo: Video) => void;
};

export const AppSearchMusicModal = ({
  setIsModalOpen,
  handleVideoSubmit,
}: Props) => {
  const { queryYoutubeData, setFilterBy, youtubeData } = useYoutubeSearch();
  const scrollElementRef = useRef<HTMLDivElement | null>(null);

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputElement = event.currentTarget[0];
    const inputValue = (inputElement as HTMLInputElement).value;
    if (!inputValue.length) return;
    setFilterBy(inputValue);
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
      <form
        className="main-input-container"
        onSubmit={(event) => handleFilterSubmit(event)}
      >
        <div className="input-container">
          <input type="text" placeholder="Search music here..." />
          <button type="submit">
            <SearchIcon />
          </button>
        </div>
      </form>
      {youtubeData && (
        <div ref={scrollElementRef} className="search-result-container">
          {!youtubeData.videos.length && <h2>No results found</h2>}
          {!!youtubeData.videos.length && (
            <InfiniteScroll
              className="infinite-scroll-container"
              pageStart={1}
              loadMore={(page) => {
                if (page > 2 || !youtubeData.nextPageToken.length) return;
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
          )}
        </div>
      )}
    </section>
  );
};
