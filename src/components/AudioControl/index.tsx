import React from "react";
import classNames from "classnames/bind";
import styles from "./AudioControl.module.scss";
import { Tooltip } from "antd";
import {
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "~/assets/icons";
import PlayButton from "../PlayButton";
import Range from "../Range";

const cx = classNames.bind(styles);

const PlayerControl: React.FC = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("control-buttons")}>
        <div className={cx("control-left")}>
          <Tooltip
            overlayInnerStyle={{ backgroundColor: "#282828" }}
            title={"Enable shuffle"}
          >
            <button className={cx("btn")}>
              <ShuffleIcon />
            </button>
          </Tooltip>
          <Tooltip
            overlayInnerStyle={{ backgroundColor: "#282828" }}
            title="Previous"
          >
            <button className={cx("btn")}>
              <SkipBackIcon />
            </button>
          </Tooltip>
        </div>
        <Tooltip
          overlayInnerStyle={{ backgroundColor: "#282828" }}
          title={"Play"}
        >
          <div className={cx("btn", "play-or-pause")}>
            <PlayButton
              size={32}
              fontSize={16}
              bgColor="#fff"
              transitionDuration={0}
              scaleHovering={1}
            />
          </div>
        </Tooltip>
        <div className={cx("control-right")}>
          <Tooltip
            overlayInnerStyle={{ backgroundColor: "#282828" }}
            title="Next"
          >
            <button className={cx("btn")}>
              <SkipForwardIcon />
            </button>
          </Tooltip>
          <Tooltip
            overlayInnerStyle={{ backgroundColor: "#282828" }}
            title={"Enable repeat"}
          >
            <button className={cx("btn")}>
              <RepeatIcon />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className={cx("playback-bar")}>
        <div className={cx("playback-position")}>0:13</div>
        <Range  />
        <div className={cx("playback-duration")}>3:04</div>
      </div>
    </div>
  );
};

export default PlayerControl;
