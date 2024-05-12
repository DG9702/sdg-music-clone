import {
  DeviceIcon,
  LyricsIcon,
  PlayingViewIcon,
  QueueIcon,
  SoundIcon,
} from "~/assets/icons";
//import Range from "../Range";
import { Tooltip } from "antd";
import classNames from "classnames/bind";
import React, { useContext, useState } from "react";
import styles from "./AudioRight.module.scss";
import Range from "../Range";
import { AppContext } from "~/App";

const cx = classNames.bind(styles);

const AudioRight: React.FC = () => {
  const { setQueueShowed, isQueueShowed } = useContext(AppContext);

  const handleClickQueueBtn = () => {
    setQueueShowed((prev) => !prev);
  };

  return (
    <div className={cx("wrapper")}>
      <Tooltip
        overlayInnerStyle={{ backgroundColor: "#282828" }}
        title="Now Playing View"
      >
        <button className={cx({ btn: true })}>
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
          title={"Mute"}
        >
          <button className={cx("btn")}>
            <SoundIcon level="mute" />
          </button>
        </Tooltip>
        <Range />
      </div>
    </div>
  );
};

export default AudioRight;
