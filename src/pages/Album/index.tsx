import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Album.module.scss";
import HeadSection from "~/components/HeadSection";
import PlayButton from "~/components/PlayButton";
import { SaveTrack } from "~/assets/icons";
import SongList from "~/components/SongList";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import categoryApi from "~/services/categoryApi";
import { useNavigate, useParams } from "react-router-dom";
import useComponentSize from "~/hook/useComponentSize";
import documentTitle from "~/utils/documentTitle";
import { useInView } from "react-intersection-observer";
import { usePalette } from "color-thief-react";
import { PlayerContext } from "~/context/PlayerContext";
import { SpotifyAlbum } from "~/types/album";
import { getArtistAlbums } from "~/services/artistApi";
import dateFormatConvertor from "~/utils/dateFormatConvertor";
import {ResponseSectionItem} from "~/types/section";
import Section from "~/components/Section";

const cx = classNames.bind(styles);

const Album: React.FC = () => {
  const {
    setQueue,
    setCurrentTrack,
    setCurrentTrackIndex,
    calNextTrackIndex,
    setPlayingType,
    isPlaying,
    prevDocumentTitle,
    currentTrack,
  } = useContext(PlayerContext);
  const [navOpacity, setNavOpacity] = useState<number>(0);
  const [data, setData] = useState<SpotifyAlbum>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [navPlayBtnVisible, setNavPlayBtnVisible] = useState<boolean>(false);
  const [artistAlbums, setArtistAlbums] = useState<SpotifyAlbum[]>();

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
        data?.name ? data?.name : "Album"
      } | Spotify`;
    } else {
      documentTitle(`${data?.name ? data?.name : "Album"} | Spotify`);
    }
  }, [isPlaying, data]);

  const headerRef = useRef<any>();
  const { height: headerHeight } = useComponentSize(headerRef);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await categoryApi({
        type: "albums",
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
    const fetchArtistAlbum = async () => {
      const artistAlbums = await getArtistAlbums(data?.artists?.[0]?.id);
      if (artistAlbums?.items?.length && artistAlbums?.items?.length !== 0) {
        setArtistAlbums([...artistAlbums.items]);
      }
    };
    fetchArtistAlbum();
  }, [data?.artists?.[0]?.id]);

  const artistAlbumsNormalized = useMemo(() => {
    return artistAlbums?.filter(
      (album: SpotifyAlbum) => album?.id !== data?.id,
    ) as ResponseSectionItem[] | undefined;
  }, [artistAlbums]);

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
    const queueList =
      data?.tracks?.items?.map((item) => {
        return {
          ...item,
          album: {
            images: data?.images,
            id: data?.id,
            album_type: data?.album_type,
            name: data?.name,
          },
        };
      }) || [];
    setQueue(queueList);
    setCurrentTrack(queueList[0]);
    setCurrentTrackIndex(0);
    setPlayingType("track");
    calNextTrackIndex();
  };

  return (
    <main className={cx("wrapper")}>
      <Header
        navOpacity={navOpacity}
        bgColor={bgColor}
        playBtnVisible={navPlayBtnVisible}
        inclPlayBtn
        title={data?.name}
        handleClickPlayBtn={handleClickPlayBtn}
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
            type={data?.album_type}
            artists={data?.artists}
            releaseDate={data?.release_date}
            desc={data?.description}
            bgColor={bgColor}
            title={data?.name}
            thumbnail={data?.images?.[0].url}
            quantity={data?.tracks?.total}
            isLoading={isLoading}
            isWhiteColor
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
                  isPlay={data?.id === currentTrack?.album?.id}
                />
              </div>
              <button className={cx("heart")}>
                <SaveTrack />
              </button>
            </div>
            <SongList
              type="album"
              top={0}
              pivotTop={64}
              songList={data?.tracks?.items || []}
              isLoading={isLoading}
              albumId={data?.id}
              albumImages={data?.images}
              albumName={data?.name}
              albumType={data?.album_type}
            />
          </div>
        </div>

        <div className={cx("copy-rights")}>
          <p className={cx("date")}>
            {dateFormatConvertor(data?.release_date)}
          </p>
          {data?.copyrights?.map((item, index: number) => (
            <p key={index}>
              {item?.text?.replace(/\(C\)|\(P\)/g, (match) => {
                return match === "(C)" ? "©" : "℗";
              })}
            </p>
          ))}
        </div>
        {artistAlbumsNormalized?.length !== 0 && (
          <div className={cx("artist-albums")}>
            <Section
              apiType="spotify"
              data={artistAlbumsNormalized}
              dataType="album"
              isClickable={false}
              title={`More by ${data?.artists?.[0]?.name}`}
              type="album"
            />
            <Footer />
          </div>
        )}
      </div>
    </main>
  );
};

export default Album
