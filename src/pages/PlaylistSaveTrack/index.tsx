import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./PlaylistSaveTrack.module.scss";
import Header from "~/components/Header";
import HeadSection from "~/components/HeadSection";
import PlayButton from "~/components/PlayButton";
import { SaveTrack } from "~/assets/icons";
import SongList from "~/components/SongList";
import Footer from "~/components/Footer";
import { PlaylistData, PlaylistSaveData } from "~/types/playlist";
import { usePalette } from "color-thief-react";
import { useInView } from "react-intersection-observer";
import useComponentSize from "~/hook/useComponentSize";
import { PlayerContext } from "~/context/PlayerContext";
import { getUserSaveTrack } from "~/services/trackApi";
import {getUserData} from "~/services/userApi";
import {PlaylistOwner} from "~/types/artist";

const cx = classNames.bind(styles);

const PlaylistSaveSong: React.FC = () => {
  //const {
  //  setQueue,
  //  setCurrentTrack,
  //  setCurrentTrackIndex,
  //  calNextTrackIndex,
  //  setPlayingType,
  //  isPlaying,
  //  prevDocumentTitle,
  //} = useContext(PlayerContext);

  const [navOpacity, setNavOpacity] = useState<number>(0);
  const [data, setData] = useState<PlaylistSaveData>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [navPlayBtnVisible, setNavPlayBtnVisible] = useState<boolean>(false);
  const [owner, setOwner] = useState<PlaylistOwner>();
  const { data: dataColor } = usePalette(
    "https://misc.scdn.co/liked-songs/liked-songs-64.png",
    10,
    "hex",
    {
      crossOrigin: "Anonymous",
      quality: 100,
    },
  );

  const bgColor = dataColor?.[0] ?? "#181818";

  const { ref: pivotTrackingRef, inView: isTracking } = useInView({
    threshold: 0,
  });

  const headerRef = useRef<any>();
  const { height: headerHeight } = useComponentSize(headerRef);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserData();      
      setOwner({
        image: user?.images[0].url,
        display_name: user?.display_name,
        id: user?.id
      });
    };
    fetchUser();
  }, [])  

  useEffect(() => {
    const fetchLikeSong = async () => {
      const result = await getUserSaveTrack({
        market: "VN",
        limit: 20,
      });
      setData(result);
    };
    fetchLikeSong();
  }, []);

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
  //  setQueue(data?.items?.map((item) => item?.track) || []);
  //  setCurrentTrack(data?.items?.[0]?.track);
  //  setCurrentTrackIndex(0);
  //  calNextTrackIndex();
  //  setPlayingType("track");
  };
  

  return (
    <main className={cx("wrapper")}>
      <Header
        navOpacity={navOpacity}
        bgColor={bgColor}
        title="Liked Songs"
        playBtnVisible={navPlayBtnVisible}
        inclPlayBtn
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
        <div>
          <HeadSection
            type="Playlist"
            isLoading={isLoading}
            title="Liked Song"
            owner={owner}
            bgColor={bgColor}
            thumbnail="https://misc.scdn.co/liked-songs/liked-songs-64.png"
            quantity={data?.total}
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
            </div>
            <SongList
              isLoading={isLoading}
              top={0}
              pivotTop={64}
              songList={data?.items}
              type={"playlist"}
            />
          </div>
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default PlaylistSaveSong;
