import React, { useContext, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Queue.module.scss";
import { AppContext } from "~/App";
import { CloseIcon } from "~/assets/icons";
import SongItem from "../SongItem";
import SongList from "../SongList";
import { PlayerContext } from "~/context/PlayerContext";

const cx = classNames.bind(styles);

const Queue = () => {
  const { setQueueShowed } = useContext(AppContext);
  const {
    queue,
    currentTrack,
    currentTrackIndex,
    isShuffle,
    //isPlaying,
    //prevDocumentTitle,
  } = useContext(PlayerContext);
  const [navOpacity, setNavOpacity] = useState<number>(0);
  const queueNormalized=queue.filter((item) => item);    

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const yAxis = e.currentTarget.scrollTop;
    

    if (yAxis > 64) {
      setNavOpacity(1);
    } else setNavOpacity(yAxis / 64);
  };    

  console.log("Check navOpacity: ", navOpacity);
  

  return (
    <div className={cx("queue-view-wrapper")}>
        <div className={cx("header")}>
          <div className={cx("header-title")}>
            <h1 className={cx("text")}>Queue</h1>
          </div>
          <div className={cx("close-btn")}>
            <button onClick={() => setQueueShowed(false)}>
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className={cx("body")} onScroll={(e) => handleScroll(e)}>
          {queueNormalized.length !== 0 ? (
            <>
              <div className={cx("now-playing")}>
                <h2 className={cx("sub-title")}>Now playing</h2>
                <SongItem
                  view={'LIST'}
                  type="queue"
                  id={currentTrack?.id}
                  albumData={currentTrack?.album}
                  artists={currentTrack?.artists}
                  duration={currentTrack?.duration_ms}
                  isExplicit={currentTrack?.explicit}
                  order={1}
                  songName={currentTrack?.name}
                  thumb={
                    currentTrack?.album?.images?.[
                      currentTrack?.album?.images?.length - 1
                    ]?.url ??
                    currentTrack?.images?.[currentTrack?.images?.length - 1]
                      ?.url
                  }
                  originalData={currentTrack}
                />
              </div>
              {queue?.filter((item) => item)?.length > 1 && (
                <div className={cx("queue-list")}>
                  <h2 className={cx("sub-title")}>
                    Next from: {currentTrack?.name}
                  </h2>
                <SongList
                    view={'LIST'}
                    type="queue"
                    inclHeader={false}
                    songList={
                      isShuffle
                        ? queueNormalized.filter(
                            (track) => track?.id !== currentTrack?.id,
                          )
                        : queueNormalized.slice(currentTrackIndex + 1)
                    }
                    adjustOrder={1}
                  />
                </div>
              )}
            </>
          ) : (
            <div className={cx("queue-notify")}>
              <h1 className={cx("content")}>No Queue Tracks</h1>
            </div>
          )}
        </div>
      </div>
  );
};

export default Queue;
