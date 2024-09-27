import React, { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Playlist.module.scss";
import Header from "~/components/Header";
import PlayButton from "~/components/PlayButton";
import { OrderCompactIcon, OrderListIcon, SaveTrack, UserSavedTrack } from "~/assets/icons";
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
import {toast} from "react-toastify";
import {checkCurrentUserFollowPlaylist, followPlaylistForCurrentUser, unFollowPlaylistForCurrentUser} from "~/services/playlistApi";
import {AuthContext} from "~/context/AuthContext";
import {Dropdown, Space, Tooltip} from "antd";
import BlurBackground from "~/components/BlurBackground";

const cx=classNames.bind(styles);

type viewAs = "LIST" | "COMPACT";
const VIEW = ["LIST", "COMPACT"] as const;


const Playlist: React.FC = () => {
  const {
    setQueue,
    setCurrentTrack,
    setCurrentTrackIndex,
    calNextTrackIndex,
    setPlayingType,
    handlePause,
    currentTrack,
    isPlaying,
    prevDocumentTitle,
    isBtnClickable
  }=useContext(PlayerContext);
  
  const {
    userData
  }=useContext(AuthContext);

  const [navOpacity, setNavOpacity] = useState<number>(0);
  const [data, setData] = useState<PlaylistData>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [navPlayBtnVisible, setNavPlayBtnVisible] = useState<boolean>(false);
  const [isSavingPlaylist, setSavingPlaylist]=useState<boolean>(false);

  const [view, setView]=useState<viewAs>("LIST");

  const items=VIEW.map((view) => ({
    key: view,
    label: view,
    onClick: () => {
      setView(view);
    },
  }));

  const { data: dataColor } = usePalette(
    data?.images?.[0]?.url as string,
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
    if(isPlayBtn && isCurrent) {
      handlePause();
    } else if (!isCurrent) {
        setQueue(data?.tracks?.items?.map((item) => item.track) || []);
        setCurrentTrack(data?.tracks?.items?.[0]?.track);
        setCurrentTrackIndex(0);
        calNextTrackIndex();
        setPlayingType("track");    
    }
  };  

   useEffect(() => {
    if (data?.id) {
      const fetchData = async () => {
        const result = await checkCurrentUserFollowPlaylist(data?.id, { ids: userData?.id });
        
        if (result.data[0] === true) {
          setSavingPlaylist(true);
        } else {
          setSavingPlaylist(false)
        }
      }
      fetchData();
    } else {
      //
    }
  }, [isSavingPlaylist, setSavingPlaylist, data?.id])

  const followPlaylistRequest = async () => {
    const result = await followPlaylistForCurrentUser(`${data?.id}`);
    return result;
  }

  const unFollowPlaylistRequest = async () => {
    const result = await unFollowPlaylistForCurrentUser(`${data?.id}`);
    return result;
  }

  const handleFollowPlaylist = async () => {
    if (isSavingPlaylist) {
      await unFollowPlaylistRequest();
      setSavingPlaylist(false)
      toast('🦄 Remove from liked Song');
    } else {
      await followPlaylistRequest();
      setSavingPlaylist(true);
      toast('🦄 Added to liked Song');
    }
  };

  const isCurrent = useMemo(() => {
    return !!data?.tracks?.items?.some((item) => item?.track?.id === currentTrack?.id);
  }, [data, currentTrack])

  const isPlayBtn = isCurrent && isPlaying;

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
            owner={data?.owner}
            bgColor={bgColor}
            title={data?.name}
            thumbnail={data?.images?.[0]?.url}
            quantity={data?.tracks?.total}
          />
        </div>
        <div className={cx("song-list")}>
          <BlurBackground bgColor={bgColor} />
          <div className={cx("main")}>
            <div className={cx("action-bar")}>
              <div className={cx("action-left")}>
                <div onClick={handleClickPlayBtn}>
                  <PlayButton
                    size={56}
                    fontSize={24}
                    scaleHovering={1.05}
                    transitionDuration={33}
                    isPlay={isPlayBtn}
                  />
                </div>
                <button
                  className={cx("heart", {active: isSavingPlaylist})}
                  onClick={() => isBtnClickable && handleFollowPlaylist()}
                >
                  {isSavingPlaylist ? <UserSavedTrack /> : <SaveTrack />}
                </button>
              </div>
              <div className={cx("action-right")}>
                <Space className='mobile-hidden'>
                  <Tooltip title={'VIEW'}>
                    <Dropdown placement='bottomRight' menu={{ items, selectedKeys: [view] }}>
                      <button className={cx('order-button')}>
                        <Space align='center'>
                          <span>{view}</span>
                          {view === 'LIST' ? <OrderListIcon size={15} /> : <OrderCompactIcon size={15} />}
                        </Space>
                      </button>
                    </Dropdown>
                  </Tooltip>
                </Space>
              </div>
            </div>
            <SongList
              playlist={data}
              setData={setData}
              isLoading={isLoading}
              view={view}
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
