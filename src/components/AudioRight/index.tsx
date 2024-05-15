import {
  DeviceIcon,
  LyricsIcon,
  PlayingViewIcon,
  QueueIcon,
  SoundIcon,
  SoundLevel,
} from "~/assets/icons";
//import Range from "../Range";
import { Tooltip } from "antd";
import classNames from "classnames/bind";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./AudioRight.module.scss";
import Range from "../Range";
import { AppContext } from "~/App";
import { PlayerContext } from "~/context/PlayerContext";

const cx = classNames.bind(styles);

const AudioRight: React.FC = () => {
  const {
    setQueueShowed,
    isQueueShowed,
    setPlayingViewShowed,
    isPlayingViewShowed,
  } = useContext(AppContext);
  const { audioRef, isBtnClickable, playingType } = useContext(PlayerContext);

  const [volume, setVolume] = useState<number>(
    JSON.parse(localStorage.getItem("spotify_volume") as string) ?? 1,
  );
  const [volumeLevel, setVolumeLevel] = useState<SoundLevel>("high");
  const prevVolume = useRef<number>(volume);

  useEffect(() => {
    if (playingType === "show") {
      setPlayingViewShowed(false);
    }
  }, [playingType]);

  const handleClickPlayingView = () => {
    if (playingType === "show") return;
    if (isBtnClickable) {
      setPlayingViewShowed((prev) => !prev);
      setQueueShowed(false);
    }
  };

  const handleClickQueueBtn = () => {
    setQueueShowed((prev) => !prev);
    setPlayingViewShowed(false);
  };

  const volumeLevelFilter = useCallback((value: number): SoundLevel => {
    if (+value === 0) {
      return "mute";
    } else if (+value < 0.33) {
      return "low";
    } else if (+value < 0.66) {
      return "medium";
    } else {
      return "high";
    }
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volumeValue = Number(e.target.value);
    localStorage.setItem("spotify_volume", JSON.stringify(volumeValue));
    audioRef.current.volume = volumeValue;
    setVolumeLevel(volumeLevelFilter(volumeValue));
    setVolume(volumeValue);
  };

  const handleSoundClicked = () => {
    if (volumeLevel === "mute") {
      audioRef.current.volume = prevVolume.current;
      setVolume(prevVolume.current);
      setVolumeLevel(volumeLevelFilter(prevVolume.current));
    } else {
      prevVolume.current = volume;
      audioRef.current.volume = 0;
      setVolume(0);
      setVolumeLevel("mute");
    }
  };

  const handleMouseUp = () => {
    return;
  };

  return (
    <div className={cx("wrapper")}>
      <Tooltip
        overlayInnerStyle={{ backgroundColor: "#282828" }}
        title="Now Playing View"
      >
        <button
          className={cx({ btn: true, active: isPlayingViewShowed })}
          onClick={handleClickPlayingView}
        >
          <PlayingViewIcon />
        </button>
      </Tooltip>
      <Tooltip overlayInnerStyle={{ backgroundColor: "#282828" }} title="Lyric">
        <button className={cx({ btn: true })}>
          <LyricsIcon />
        </button>
      </Tooltip>
      <Tooltip overlayInnerStyle={{ backgroundColor: "#282828" }} title="Queue">
        <button
          onClick={handleClickQueueBtn}
          className={cx({ btn: true, active: isQueueShowed })}
        >
          <QueueIcon />
        </button>
      </Tooltip>
      <Tooltip
        overlayInnerStyle={{ backgroundColor: "#282828" }}
        title="Connect to a device"
      >
        <button className={cx({ btn: true })}>
          <DeviceIcon />
        </button>
      </Tooltip>
      <div className={cx("volume")}>
        <Tooltip
          overlayInnerStyle={{ backgroundColor: "#282828" }}
          title={volumeLevel === "mute" ? "Ummute" : "Mute"}
        >
          <button className={cx("btn")} onClick={handleSoundClicked}>
            <SoundIcon level={volumeLevel} />
          </button>
        </Tooltip>
        <Range
          maxValue={1}
          step={0.01}
          process={volume}
          handleChange={handleVolumeChange}
          handleMouseUp={handleMouseUp}
        />
      </div>
    </div>
  );
};

export default AudioRight;
