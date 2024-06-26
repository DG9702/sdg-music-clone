import React, { memo, useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Playlist.module.scss";
import Header from "~/components/Header";
import PlayButton from "~/components/PlayButton";
import { HeartIcon } from "~/assets/icons";
import SongList from "~/components/SongList";
import Footer from "~/components/Footer";
import HeadSection from "~/components/HeadSection";
import { PlaylistData } from "~/types/playlist";
import { usePalette } from "color-thief-react";
import { useInView } from "react-intersection-observer";
import useComponentSize from "~/hook/useComponentSize";
import { useNavigate, useParams } from "react-router-dom";
import categoryApi from "~/services/categoryApi";
import { PlayerContext } from "~/context/PlayerContext";
import documentTitle from "~/utils/documentTitle";

const cx = classNames.bind(styles);

const Playlist: React.FC = () => {
  const {
    setQueue,
    setCurrentTrack,
    setCurrentTrackIndex,
    calNextTrackIndex,
    setPlayingType,
    isPlaying,
    prevDocumentTitle,
  } = useContext(PlayerContext);
  const [navOpacity, setNavOpacity] = useState<number>(0);
  const [data, setData] = useState<PlaylistData>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [navPlayBtnVisible, setNavPlayBtnVisible] = useState<boolean>(false);

  // const bgColor = useRaiseColorTone(useDominantColor(data?.images?.[0]?.url) || '#121212')

  const { data: dataColor } = usePalette(
    data?.images?.[0]?.url as string,
    10,
    "hex",
    {
      crossOrigin: "Anonymous",
      quality: 100,
    },
  );

  const bgColor = dataColor?.[0] ?? "#121212";

  const { ref: pivotTrackingRef, inView: isTracking } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (isPlaying) {
      prevDocumentTitle.current = `${
        data?.name ? data?.name : "Playlist"
      } | Spotify Playlist`;
    } else {
      documentTitle(
        `${data?.name ? data?.name : "Playlist"} | Spotify Playlist`,
      );
    }
  }, [isPlaying, data]);

  const headerRef = useRef<any>();
  const { height: headerHeight } = useComponentSize(headerRef);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await categoryApi({
        type: "playlists",
        id: id,
      });
      if (data?.error) {
        navigate("/not-found");
      } else {
        setData({ ...data });
      }
    };
    if (id !== "undefined") {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    setLoading(Boolean(!data));
  }, [data]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const yAxis = e.currentTarget.scrollTop;
    if (yAxis > 64) {
      setNavOpacity(1);
    } else setNavOpacity(yAxis / 64);
    if (yAxis > headerHeight + 14) {
      setNavPlayBtnVisible(true);
    } else setNavPlayBtnVisible(false);
  };

  const handleClickPlayBtn = () => {
    setQueue(data?.tracks?.items?.map((item) => item.track) || []);
    setCurrentTrack(data?.tracks?.items?.[0]?.track);
    setCurrentTrackIndex(0);
    calNextTrackIndex();
    setPlayingType("track");
  };

  return (
    <main className={cx("wrapper")}>
      <Header
        navOpacity={navOpacity}
        bgColor={bgColor}
        playBtnVisible={navPlayBtnVisible}
        inclPlayBtn
        title={data?.name}
      />
      <div
        onScroll={(e) => isTracking && handleScroll(e)}
        className={cx("body")}
      >
        <div
          ref={pivotTrackingRef}
          className={cx("pivot-tracking")}
          style={{ top: `${headerHeight + 104}px` }}
        ></div>
        <div ref={headerRef}>
          <HeadSection
            type="Playlist"
            desc={data?.description}
            isLoading={isLoading}
            bgColor={bgColor}
            title={data?.name}
            thumbnail={data?.images?.[0]?.url}
            quantity={data?.tracks?.total}
          />
        </div>
        <div className={cx("song-list")}>
          <div
            style={{ backgroundColor: `${bgColor}` }}
            className={cx("bg-blur")}
          ></div>
          <div className={cx("main")}>
            <div className={cx("action-bar")}>
              <div onClick={handleClickPlayBtn}>
                <PlayButton
                  size={56}
                  fontSize={24}
                  scaleHovering={1.05}
                  transitionDuration={33}
                />
              </div>
              <button className={cx("heart")}>
                <HeartIcon />
              </button>
            </div>
            <SongList
              isLoading={isLoading}
              top={0}
              pivotTop={64}
              songList={data?.tracks?.items}
              type={"playlist"}
            />
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default memo(Playlist);
