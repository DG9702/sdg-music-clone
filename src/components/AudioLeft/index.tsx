import React, { useContext, useMemo, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./AudioLeft.module.scss";
import { ArrowDown, ArrowTop, HeartIcon, MusicNote } from "~/assets/icons";
import ImageLazy from "../Image";
import { Link } from "react-router-dom";
import { PlayerContext } from "~/context/PlayerContext";
import useEllipsisHorizontal from "~/hook/useEllipsisHorizontal";
import Marquee from "react-fast-marquee";
import Skeleton from "react-loading-skeleton";
import SubTitleArtists from "../SubTitle";
import { AppContext } from "~/App";
import { Tooltip } from "antd";

const cx = classNames.bind(styles);

const AudioLeft: React.FC = () => {
  const { playBarData, playingType, isBtnClickable } =
    useContext(PlayerContext);
  const {
    isPlayingViewShowed,
    isQueueShowed,
    setPlayingViewShowed,
    setQueueShowed,
  } = useContext(AppContext);
  const isLoading = useMemo(
    () => Boolean(!playBarData?.trackName),
    [playBarData?.trackName],
  );

  const trackNameRef = useRef<any>();
  const isEllipsisActive = useEllipsisHorizontal(
    trackNameRef.current,
    playBarData?.trackName,
  );

  const handleClickPlayingView = () => {
    if (playingType === "show") return;
    if (isBtnClickable) {
      setPlayingViewShowed((prev) => !prev);
      setQueueShowed(false);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("avatar")}>
        {playBarData?.thumb ? (
          <>
            <ImageLazy src={playBarData?.thumb} alt={playBarData?.trackName} />
            <Tooltip
              overlayInnerStyle={{ backgroundColor: "#282828" }}
              title={isPlayingViewShowed ? "collapse" : "Extend"}
            >
            <button
              className={cx("arrow-top")}
              onClick={handleClickPlayingView}
            >
                {isPlayingViewShowed ? <ArrowDown /> : <ArrowTop />}
            </button>
              </Tooltip>
          </>
        ) : (
          <div className={cx("default-thumb")}>
            <MusicNote size={16} />
          </div>
        )}
      </div>
      <div className={cx("textSong")}>
        <div className={cx("textSong-item")}>
          <div className={cx("textSong-body")}>
            {!isLoading ? (
              isEllipsisActive ? (
                <Marquee speed={15} pauseOnHover={true}>
                  <Link
                    to={
                      playingType === "track"
                        ? `/album/${playBarData?.albumId}`
                        : `/episode/${playBarData?.episode}`
                    }
                  >
                    <span>{playBarData?.trackName}</span>
                  </Link>
                </Marquee>
              ) : (
                <Link
                  to={
                    playingType === "track"
                      ? `/album/${playBarData?.albumId}`
                      : `/episode/${playBarData?.episode}`
                  }
                >
                  <span>{playBarData?.trackName}</span>
                </Link>
              )
            ) : (
              <Skeleton width={124} height={16} borderRadius={50} />
            )}
          </div>
        </div>
        <div className={cx("textSong-item")}>
          <div className={cx("textSong-body", "textSong-artist")}>
            {!isLoading ? (
              <SubTitleArtists
                fontSize={11}
                apiType="spotify"
                type={playingType === "track" ? "artist" : "show"}
                data={
                  playingType === "track"
                    ? playBarData?.artists
                    : playBarData?.show
                }
              />
            ) : (
              <Skeleton width={50} borderRadius={50} />
            )}
          </div>
        </div>
      </div>
      <button className={cx("btn-audio-icon")}>
        <span>
          <HeartIcon />
        </span>
      </button>
    </div>
  );
};

export default AudioLeft;
