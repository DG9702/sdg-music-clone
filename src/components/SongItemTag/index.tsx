import { usePalette } from "color-thief-react";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import useComponentSize from "~/hook/useComponentSize";
import { SongItemTagProps, SpotifyTrack } from "~/types/track";
import PlayButton from "../PlayButton";
import classNames from "classnames/bind";
import styles from "./SongItemTag.module.scss"
import ImageLazy from "../Image";
import {SpotifyAlbum} from "~/types/album";
import categoryApi from "~/services/categoryApi";
import {PlayerContext} from "~/context/PlayerContext";

const cx = classNames.bind(styles);

const SongItemTag: React.FC<SongItemTagProps> = (props) => {
  const {thumbnailUrl, name, setBgColor, isLoading, id}=props;
  const [data, setData] = useState<SpotifyAlbum>();
  
  const {
    setCurrentTrack,
    setCurrentTrackIndex,
    setQueue,
    calNextTrackIndex,
    setPlayingType,
    handlePause,
    currentTrack,
    isPlaying
  } = useContext(PlayerContext)

  const { data: dataColor } = usePalette(thumbnailUrl as string, 10, "hex", {
    crossOrigin: "Anonymous",
    quality: 100,
  });

  const color = dataColor?.[0] ?? "#121212";

  const imgRef = useRef<HTMLDivElement>(null);
  const handleHover = (): void => {
    setBgColor(color as string);
  };

  const navigate = useNavigate();

  const songTagRef = useRef<HTMLDivElement>(null);

  const {width}=useComponentSize(songTagRef);

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
  
  const handleClickPlayBtn=() => {
    if(isPlayBtn && isCurrent) {
      handlePause()
    } else if (!isCurrent) {
      const queueList =
        data?.tracks?.items?.map((item: SpotifyTrack) => {
          return {
            ...item,
            album: {
              images: data?.images,
              id: data?.id,
              album_type: data?.album_type,
              name: data?.name,
            },
          }
        }) || []
      setQueue([...queueList])
      setCurrentTrack({ ...queueList[0] })
      setCurrentTrackIndex(0)
      calNextTrackIndex()
      setPlayingType('track')
    }
  }

  const isCurrent = useMemo(() => {
    return !!data?.tracks?.items?.some((item) => item?.id === currentTrack?.id);
  }, [data, currentTrack])

  const isPlayBtn = isCurrent && isPlaying;

  return (
    <div
      ref={songTagRef}
      onMouseEnter={handleHover}
      onMouseLeave={() => setBgColor("#e0e0e0")}
      className={cx("song-item-tag")}
      onClick={() => navigate(`/album/${id}`)}
    >
      <div className={cx("thumbnail")} ref={imgRef}>
        {!isLoading ? (
          <ImageLazy src={thumbnailUrl} alt={name} />
        ) : (
          <Skeleton height={"100%"} />
        )}
      </div>
      <div className={cx("body")}>
        {!isLoading ? (
          <>
            <p className={cx("body-name")}>{name}</p>
            <div
              className={cx({
                "play-btn": true,
                hidden: width !== -1 && width <= 270,
              })}
              onClick={(e) => {
                e.stopPropagation();
                handleClickPlayBtn();
              }}
            >
              <PlayButton
                size={44}
                scaleHovering={1.1}
                transitionDuration={33}
                isPlay={isPlayBtn}
              />
            </div>
          </>
        ) : (
          <Skeleton
            height={26}
            borderRadius={50}
            style={{
              position: "absolute",
              left: "0",
              right: "0",
              paddingInline: "16px",
              marginTop: "-7px",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SongItemTag
SongItemTag