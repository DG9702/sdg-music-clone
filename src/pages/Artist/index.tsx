import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Artist.module.scss";
import { ArtistContext } from "~/context/ArtistContext";
import { PlayerContext } from "~/context/PlayerContext";
import { documentTitle } from "~/utils";
import { useInView } from "react-intersection-observer";
import useComponentSize from "~/hook/useComponentSize";
import { SpotifyTrack } from "~/types/track";
import Footer from "~/components/Footer";
import PlayButton from "~/components/PlayButton";
import ImageLazy from "~/components/Image";
import Header from "~/components/Header";
import ArtistBanner from "~/components/ArtistBanner";
import TopTracks from "~/components/TopTracks";
import Section from "~/components/Section";
import Discography from "~/components/Discography";
import AboutArtist from "~/components/AboutArtist";
import {checkCurrentUserFollowArtists, followArtistForCurrentUser, unFollowArtistForCurrentUser} from "~/services/artistApi";
import {toast} from "react-toastify";
import {Dropdown, MenuProps, Space, Tooltip} from "antd";
import {OrderCompactIcon, OrderListIcon} from "~/assets/icons";

const cx = classNames.bind(styles);

const Artist: React.FC = () => {
  const [navOpacity, setNavOpacity] = useState<number>(0);
  const [bgBannerOpacity, setBgBannerOpacity] = useState<number>(0);
  const [bgBannerScale, setBgBannerScale] = useState<number>(1.05);
  const [navPlayBtnVisible, setNavPlayBtnVisible] = useState<boolean>(false);

  const {
    isLoading,
    profile,
    headerImg,
    avatarImg,
    colorRaw,
    stats,
    topTracks,
    discography,
    playlists,
    featuring,
    relatedArtists,
    discoveredOn,
    appearsOn,
    aboutImg,
    visuals,
  } = useContext(ArtistContext);

  const {
    setCurrentTrack,
    setCurrentTrackIndex,
    setQueue,
    calNextTrackIndex,
    setPlayingType,
    setPlaying,
    isPlaying,
    prevDocumentTitle,
    isBtnClickable,
  }=useContext(PlayerContext);
  
  const [isFollow, setIsFollow]=useState<boolean>(false);
  const [view, setView]=useState<boolean>(false);


  const items: MenuProps['items'] = [
      {
        label: 'LIST',
        key: 'LIST',
        onClick: () => {
          setView(false)
        }
      },
      {
        label: 'COMPACT',
        key: 'COMPACT',
        onClick: () => {
          setView(true)
        }
      }
    ];


  useEffect(() => {
    if (isPlaying) {
      prevDocumentTitle.current = `${
        profile?.name ? profile?.name : "Artist"
      } | Spotify`;
    } else {
      documentTitle(`${profile?.name ? profile?.name : "Artist"} | Spotify`);
    }
  }, [isPlaying, profile]);

  const bannerRef = useRef<any>();

  const { ref: pivotTrackingRef, inView: isTracking } = useInView({
    threshold: 0,
  });

  const { height: bannerHeight } = useComponentSize(bannerRef);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const yAxis = e.currentTarget.scrollTop;
    if (yAxis > bannerHeight / 2) {
      setNavOpacity(1);
      setBgBannerOpacity(1);
      setBgBannerScale(1.2);
    } else {
      setNavOpacity((2 * yAxis) / bannerHeight);
      setBgBannerOpacity((2 * yAxis) / bannerHeight);
      setBgBannerScale(1.05 - 0.05 * ((2 * yAxis) / bannerHeight));
    }

    if (yAxis > 0.6 * bannerHeight) {
      setNavOpacity(1);
    } else setNavOpacity(yAxis / (0.6 * bannerHeight));

    if (yAxis > bannerHeight + 14) {
      setNavPlayBtnVisible(true);
    } else setNavPlayBtnVisible(false);
  };

  const handleClickPlayBtn = () => {
    setQueue([...(topTracks as SpotifyTrack[])])
    setCurrentTrack({ ...topTracks?.[0] });
    setCurrentTrackIndex(0);
    calNextTrackIndex();
    setPlayingType("track");
  };
  
  useEffect(() => {
    if (profile?.id) {
      const fetchData = async () => {
        const result = await checkCurrentUserFollowArtists({ids: `${profile?.id}`});
        console.log("Check result: ", result);
        
        if (result.data[0] === true) {
          setIsFollow(true);
        } else {
          setIsFollow(false)
        }
      }
      fetchData();
    } else {
      //
    }
  }, [isFollow, setIsFollow, profile?.id])

  const followingArtistRequest = async () => {
    const result = await followArtistForCurrentUser({ ids: `${profile?.id}`});
    return result;
  }

  const unFollowingRequest = async () => {
    const result = await unFollowArtistForCurrentUser({ ids: `${profile?.id}`});
    return result;
  }

  const handleFollowArtist = async () => {
    if (isFollow) {
      await unFollowingRequest();
      setIsFollow(false)
      toast('🦄 UnFollow artist');
    } else {
      await followingArtistRequest();
      setIsFollow(true);
      toast('🦄 Following artist');
    }
  };

  return (
    <main className={cx("wrapper")}>
      <Header
        type="artist"
        inclPlayBtn={true}
        title={profile?.name}
        playBtnVisible={navPlayBtnVisible}
        navOpacity={navOpacity}
        bgColor={colorRaw}
        handleClickPlayBtn={handleClickPlayBtn}
      />
      <div
        className={cx("banner-img")}
        style={{
          transform: `scale(${bgBannerScale})`,
          height: `${bannerHeight}px`,
          backgroundColor: !headerImg ? colorRaw : undefined,
        }}
      >
        {!isLoading && (
          <ImageLazy
            inclSkeleton={false}
            src={headerImg}
            alt="banner-image"
            colorRaw={colorRaw}
          />
        )}
        <div className={cx("overlay")}></div>
      </div>
      <div
        onScroll={(e) => isTracking && handleScroll(e)}
        className={cx("body")}
      >
        <div
          ref={pivotTrackingRef}
          className={cx("pivot-tracking")}
          style={{ top: `${bannerHeight + 104}px` }}
        ></div>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: `${bannerHeight}px`,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#121212",
              zIndex: -1,
            }}
          ></div>
          <div
            style={{
              backgroundColor: colorRaw,
              top: `${bannerHeight}px`,
            }}
            className={cx("bg-blur")}
          ></div>
          <div ref={bannerRef}>
            <ArtistBanner
              name={profile?.name}
              avatar={avatarImg}
              followerNumber={stats?.followerNumbers}
              monthlyListeners={stats?.monthlyListeners}
              dominantColor={colorRaw}
              bgBannerOpacity={bgBannerOpacity}
              isVerified={profile?.isVerified}
              inclHeaderImg={!!headerImg}
              isLoading={isLoading}
            />
          </div>
          <div className={cx("action-bar")}>
            <div className={cx("action-left")}>
              <div onClick={handleClickPlayBtn}>
                <PlayButton
                  size={56}
                  transitionDuration={33}
                  scaleHovering={1.05}
                  isPlay={isPlaying}
                  setPlaying={setPlaying}
                />
              </div>
              <button className={cx("follow-btn")}
                onClick={() => isBtnClickable && handleFollowArtist()}
              >
                {isFollow ? "Following" : "follow"}
              </button>
            </div>
            <div className={cx("action-right")}>
                <Space className='mobile-hidden'>
                  <Tooltip title={'VIEW'}>
                    <Dropdown placement='bottomRight' menu={{ items, selectedKeys: [view === false ? "LIST" : "COMPACT"] }}>
                      <button className={cx('order-button')}>
                        <Space align='center'>
                          <span>{view === false ? "LIST" : "COMPACT"}</span>
                          {view === false ? <OrderListIcon size={15} /> : <OrderCompactIcon size={15} />}
                        </Space>
                      </button>
                    </Dropdown>
                  </Tooltip>
                </Space>
              </div>
          </div>
          <TopTracks title="Popular" view={view} isLoading={isLoading} songList={topTracks} />
          <Discography data={discography} />

          {featuring?.length !== 0 && (
            <Section
              apiType="rapid"
              title={`Featuring ${profile?.name}`}
              data={featuring}
              dataType="playlist"
              isClickable={true}
              href="featuring"
            />
          )}
          {relatedArtists?.length !== 0 && (
            <Section
              apiType="rapid"
              title="Fans also like"
              data={relatedArtists}
              dataType="artist"
              type="artist"
              isClickable={true}
              href="related"
            />
          )}
          {appearsOn?.length !== 0 && (
            <Section
              apiType="rapid"
              title="Appears On"
              data={appearsOn}
              dataType="album"
              isClickable={true}
              href="appears-on"
            />
          )}
          {playlists?.length !== 0 && (
            <Section
              apiType="rapid"
              title="Artist Playlists"
              data={playlists}
              dataType="playlist"
              isClickable={true}
              href="playlists"
            />
          )}
          {discoveredOn?.length !== 0 && (
            <Section
              apiType="rapid"
              title="Discovered on"
              data={discoveredOn}
              dataType="playlist"
              type="artist"
              isClickable={true}
              href="discovered-on"
            />
          )}
          {aboutImg && (
            <AboutArtist
              stats={stats}
              profile={profile}
              visuals={visuals}
              isLoading={isLoading}
              aboutImg={aboutImg}
            />
          )}
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Artist
