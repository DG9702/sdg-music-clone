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
import React from "react";
import styles from "./AudioRight.module.scss";
import Range from "../Range";

const cx = classNames.bind(styles);

const AudioRight: React.FC = () => {
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
        <button className={cx({ btn: true })}>
          <QueueIcon />
        </button>
      </Tooltip>
      <Tooltip overlayInnerStyle={{ backgroundColor: "#282828" }} title="Connect to a device">
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
