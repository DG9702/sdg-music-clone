import React, { memo, useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./userProfile.module.scss";
import Header from "~/components/Header";
//import PlayButton from "~/components/PlayButton";
//import { OrderCompactIcon, OrderListIcon, SaveTrack, UserSavedTrack } from "~/assets/icons";
//import SongList from "~/components/SongList";
import Footer from "~/components/Footer";
import HeadSection from "~/components/HeadSection";
//import { PlaylistData } from "~/types/playlist";
import { usePalette } from "color-thief-react";
import { useInView } from "react-intersection-observer";
import useComponentSize from "~/hook/useComponentSize";
//import { useNavigate, useParams } from "react-router-dom";
//import categoryApi from "~/services/categoryApi";
import { PlayerContext } from "~/context/PlayerContext";
import documentTitle from "~/utils/documentTitle";
//import {checkCurrentUserFollowPlaylist} from "~/services/playlistApi";
import {AuthContext} from "~/context/AuthContext";
import {getArtistsUserFollowing, getUserTopByType} from "~/services/userApi";
import TopTracks from "~/components/TopTracks";
import {fetchSidebarData} from "~/utils";
import Section from "~/components/Section";
//import {MenuProps} from "antd";

const cx = classNames.bind(styles);

type libCategory = 'playlist' | 'album' | 'artist'; 


const UserProfile: React.FC=() => {
  const {
    isPlaying,
    prevDocumentTitle,
  }=useContext(PlayerContext);
  
  const {
    userData
  }=useContext(AuthContext);

  const [navOpacity, setNavOpacity]=useState<number>(0);
  //const [data, setData] = useState<PlaylistData>();
  const [category, setCategory] = useState<libCategory>("playlist");
  const [isLoading, setIsLoading]=useState<boolean>(false);
  const [navPlayBtnVisible, setNavPlayBtnVisible]=useState<boolean>(false);
  const [following, setFollowing]=useState<any>();
  const [topTrack, setTopTrack]=useState<any>();
  const [publicPlaylists, setPublicPlaylists]=useState<any>();

  useEffect(() => {
    try {
      const fetchData=async () => {
        const result=await getArtistsUserFollowing();
        console.log("Check result: ", result);
        
        if(result) {
          setFollowing(result.artists);
        }
      }
      fetchData();
    } catch(error) {
      console.log("Check error: ", error);
      
    }
  }, [])

  useEffect(() => {
    try {
      const fetchData=async () => {
        const result=await getUserTopByType("tracks", "short_term");
        console.log("Check result: ", result);
        
        if(result) {
          setIsLoading(true);
          setTopTrack(result?.items);
        }
      }
      fetchData();
    } catch(error) {
      console.log("Check error: ", error);
      
    }
  }, [])

  useEffect(() => {
    setIsLoading(Boolean(!topTrack));
  }, [topTrack]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSidebarData({
        type: "playlist",
        userId: userData?.id,
      });
      setPublicPlaylists(data);
    };
    fetchData();
  }, [category, userData]);

  const { data: dataColor } = usePalette(
    userData?.images?.[0]?.url as string,
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
        userData?.display_name ? userData?.display_name : "user"
      } | Spotify Playlist`;
    } else {
      documentTitle(
        `${userData?.display_name ? userData?.display_name : "Playlist"} | Spotify Playlist`,
      );
    }
  }, [isPlaying, userData]);

  const headerRef = useRef<any>();
  const { height: headerHeight } = useComponentSize(headerRef);


  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const yAxis = e.currentTarget.scrollTop;
    if (yAxis > 64) {
      setNavOpacity(1);
    } else setNavOpacity(yAxis / 64);
    if (yAxis > headerHeight + 14) {
      setNavPlayBtnVisible(true);
    } else setNavPlayBtnVisible(false);
  };

  console.log("Check following: ", following);
  
  
  return (
    <main className={cx("wrapper")}>
      <Header
        navOpacity={navOpacity}
        bgColor={bgColor}
        playBtnVisible={navPlayBtnVisible}
        inclPlayBtn
        title={userData?.display_name}
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
            headerType="user"
            type="user"
            bgColor={bgColor}
            title={userData?.display_name}
            thumbnail={userData?.images?.[1]?.url}
            owner={userData}
            quantity={following?.total}
          />
        </div>
        <div className={cx("song-list")}>
          <div
            style={{ backgroundColor: `${bgColor}` }}
            className={cx("bg-blur")}
          ></div>
        </div>
        <div style={{ marginTop: 40 }}>
          <TopTracks title={"Top tracks this month"} view={false} isLoading={isLoading} songList={topTrack} />
        </div>
        {publicPlaylists?.length!==0&&(
            <Section
              apiType="spotify"
              title={`Public Playlists`}
              data={publicPlaylists}
              dataType="playlist"
              isClickable={true}
              href="playlist"
            />
        )}
        {following?.items?.length !== 0 && (
            <Section
              apiType="spotify"
              title={`Following`}
              data={following?.items}
              dataType="artist"
              isClickable={true}
              href="following"
            />
          )}
        <Footer />
      </div>
    </main>
  );
};

export default memo(UserProfile);
