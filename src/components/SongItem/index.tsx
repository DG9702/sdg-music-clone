import React, { memo, useContext, useEffect, useState } from "react";
import { MoreIcon, PlayIcon, SaveTrack, SingleMusicNote, UserSavedTrack } from "~/assets/icons";
import { SongItemProps } from "~/types/track";
import dateFormatConvertor from "~/utils/dateFormatConvertor";
import ImageLazy from "../Image";
import Skeleton from "react-loading-skeleton";
import classNames from "classnames/bind";
import styles from "./SongItem.module.scss";
import { MainLayoutContext } from "~/context/MainLayoutContext";
import {SubTitleArtists} from "../SubTitle";
import { PlayerContext } from "~/context/PlayerContext";
import durationConvertor from "~/utils/durationConvertor";
import equaliser from "~/assets/images/animation/equaliser-animated-green.f5eb96f2.gif";
import {removeTrackForCurrentUser, saveTrackForCurrentUser} from "~/services/trackApi";
import {toast} from "react-toastify";
import {TrackContext} from "~/context/TrackContext";
import {AuthContext} from "~/context/AuthContext";
import {SongAction} from "../Song/SongAction";

const cx = classNames.bind(styles);

const SongItem: React.FC<SongItemProps>=({
  songName,
  artists,
  thumb,
  duration = 0,
  order,
  isLoading = false,
  dateAdd,
  view,
  AddBy,
  albumData,
  isExplicit = false,
  type = "default",
  originalData,
  myPlaylist,
  playlist,
  setPlaylist
}) => {
  const { width } = useContext(MainLayoutContext);
  const {
    setCurrentTrack,
    setQueue,
    setCurrentTrackIndex,
    calNextTrackIndex,
    setPlayingType,
    queue,
    isPlaying,
    currentTrack,
    isBtnClickable,
  }=useContext(PlayerContext);

  const {
    userData
  }=useContext(AuthContext);

  const { isTrackSaved }=useContext(TrackContext);  

  const [isSavingLocally, setIsSavingLocally]=useState(isTrackSaved(originalData?.id));  
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (currentTrack?.id === originalData?.id) return;
    const indexOfTrackInQueue = queue.findIndex(
      (item) => item?.id === originalData?.id,
    );

    console.log('Check view: ', view);
    
    
    if (indexOfTrackInQueue === -1) {
      setQueue(originalData ? [{ ...originalData }] : []);
      setCurrentTrack({ ...originalData });
      setCurrentTrackIndex(0);
      calNextTrackIndex();
    } else {
      setCurrentTrack({ ...originalData });
      setCurrentTrackIndex(indexOfTrackInQueue);
      calNextTrackIndex();
    }
    if (originalData?.album) {
      setPlayingType("track");
    } else {
      setPlayingType("show");
    }
  }; 

  useEffect(() => {
    if(originalData?.id) {
      setIsSavingLocally(isTrackSaved(originalData?.id));
    }
  }, [originalData?.id]);

  useEffect(() => {
    if(AddBy===userData?.id) {
      setIsSavingLocally(true);      
    }
  }, [AddBy, userData?.id, isSavingLocally])

  const handleSaveTrack = async () => {
    if (isSavingLocally) {
      await removeTrackForCurrentUser(`${originalData?.id}`);
      toast('🦄 Remove to liked Song');
    } else {
      await saveTrackForCurrentUser(`${originalData?.id}`);
      toast('🦄 Add from liked Song');
    }
    setIsSavingLocally(!isSavingLocally);
  };   
  
  return (
    <div
      //onClick={(e) => handleClick(e)}
      //onMouseOver={() => setHover(!isHover)}
      className={cx({
        wrapper: true,
        "grid-md": width <= 780 && type !== "album",
        "is-album-track": type === "album",
        "is-search-result": type === "search",
        "is-queue-result": type === "queue",
        "is-playing": currentTrack?.id===originalData?.id,
        "is-list": view===false && type==='album',
        "is-list-no-album": view === false && type !== 'album',
        "is-compact": view===true && type=== 'album',
        "is-compact-no-album": view === true && type !== 'album'
      })}
    >
      {type !== "queue" && type !== "search" && (
        <div className={cx("order")}>
          {!isLoading &&
            (isPlaying && currentTrack?.id === originalData?.id ? (
              <div className={cx("equaliser")}>
                <img src={equaliser} alt="equaliser" />
              </div>
            ) : (
              <>
                <span className={cx("order-number")}>{order}</span>
                <div className={cx("order-icon")} onClick={(e) => handleClick(e)}>
                  <PlayIcon />
                </div>
              </>
            ))}
        </div>
      )}
      <div className={cx("main")}>
        {type!=="album"&&(
          <>
            {view ===false && (
              <div className={cx("thumb")}>
                {!isLoading ? (
                  thumb ? (
                    <>
                      <ImageLazy src={thumb} alt={songName} />
                      {type === "queue" && (
                        <button className={cx("order-icon")}>
                          <PlayIcon />
                        </button>
                      )}
                      {type === "search" && (
                        <button className={cx("order-icon")}>
                          <PlayIcon />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className={cx("default-thumb")}>
                      <SingleMusicNote />
                    </div>
                  )
                ) : (
                  <Skeleton height={"100%"} />
                )}
              </div>
            )}
          </>
        )}
        <div className={cx("title")}>
          {!isLoading ? (
            <>
              <p className={cx("name", { namequeue: type === "queue" })}>
                {songName}
              </p>
              {type !== "artist" && view === false && (
                <div className={cx("sub-title")}>
                  {isExplicit && <span className={cx("explicit")}>E</span>}
                  <SubTitleArtists data={artists} />
                </div>
              )}
            </>
          ) : (
            <>
              <Skeleton borderRadius={50} height={"15px"} width={"200px"} />
              <Skeleton borderRadius={50} height={"10px"} width={"60px"} />
            </>
          )}
        </div>
      </div>
      {view===true && (
        <div className={cx("album",{ "is-none": view === true})}>
            {!isLoading && (
              <SubTitleArtists data={artists} />
            )}
          </div>
      )}
      {type !== "album" && type !== "search" && type !== "queue" && (
        <>
          <div className={cx("album")}>
            {!isLoading && (
              <SubTitleArtists type="album" data={[{ ...albumData }]} />
            )}
          </div>
          {width > 780 && (
            <div className={cx("date-add")}>
              {dateAdd !== "1970-01-01T00:00:00Z" && dateAdd
                ? dateFormatConvertor(dateAdd)
                : ""}
            </div>
          )}
        </>
      )}
      <div className={cx("right-action")}>
        <div
          onClick={() => isBtnClickable&&handleSaveTrack()}
          className={cx("action", {active: isSavingLocally})}
        >
          {isSavingLocally ? <UserSavedTrack /> : <SaveTrack />}
        </div>
        {type !== "queue" && (
          <div className={cx("duration")}>
            {!isLoading && durationConvertor({ milliseconds: duration })}
          </div>
        )}
        <SongAction myPlaylist={myPlaylist} playlist={playlist} setPlaylist={setPlaylist} track={originalData} trigger={['click']}>
          <div className={cx("action")}>
            <MoreIcon />
          </div>
        </SongAction>
      </div>
    </div>
  );
};

export default memo(SongItem)
