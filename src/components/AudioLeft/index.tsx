import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./AudioLeft.module.scss";
import {
  ArrowDown,
  ArrowTop,
  MusicNote,
  SaveTrack,
  UserSavedTrack,
} from "~/assets/icons";
import ImageLazy from "../Image";
import { Link } from "react-router-dom";
import { PlayerContext } from "~/context/PlayerContext";
import useEllipsisHorizontal from "~/hook/useEllipsisHorizontal";
import Marquee from "react-fast-marquee";
import Skeleton from "react-loading-skeleton";
import { AppContext } from "~/App";
import { Tooltip } from "antd";
import { checkUserSaveTrack, removeTrackForCurrentUser, saveTrackForCurrentUser} from "~/services/trackApi";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SubTitleArtists} from "../SubTitle";
import {TrackContext} from "~/context/TrackContext";

const cx = classNames.bind(styles);

const AudioLeft: React.FC = () => {
  const { playBarData, playingType, isBtnClickable, isSaving, setSaving } =
    useContext(PlayerContext);
  const {
    isPlayingViewShowed,
    setPlayingViewShowed,
    setQueueShowed,
  }=useContext(AppContext);
  
   const {
    savingTracks, isTrackSaved 
  }=useContext(TrackContext);

  const [isSavingLocally, setIsSavingLocally]=useState(isTrackSaved(playBarData?.trackId));

  const isLoading = useMemo(
    () => Boolean(!playBarData?.trackId),
    [playBarData?.trackId],
    
  );

  //const [isSaving, setSaving] = useState<boolean>(false)

    useEffect(() => {
      setIsSavingLocally(isTrackSaved(playBarData?.trackId));
    }, [savingTracks, playBarData?.trackId, isTrackSaved]);
  
  const handleSaveTrack = async () => {
    if (isSavingLocally) {
      await removeTrackForCurrentUser(`${playBarData?.trackId}`);
      toast('🦄 Remove to liked Song');
    } else {
      await saveTrackForCurrentUser(`${playBarData?.trackId}`);
      toast('🦄 Add from liked Song');
    }
    setIsSavingLocally(!isSavingLocally);
  };

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
      <div>
        <button
          onClick={() => isBtnClickable && handleSaveTrack()}
          className={cx("btn-audio-icon", { active: isSavingLocally })}
        >
          <span>{isSavingLocally ? <UserSavedTrack  /> : <SaveTrack />}</span>
        </button>
        <ToastContainer
          position="bottom-center"
          className={cx("toast")}
          autoClose={1000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Zoom}
        />
      </div>
    </div>
  );
};

export default AudioLeft;
