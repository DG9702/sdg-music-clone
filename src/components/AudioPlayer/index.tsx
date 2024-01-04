import React from "react";
import classNames from "classnames/bind";
import styles from "./AudioPlayer.module.scss";
import AudioLeft from "../AudioLeft";
import AudioControl from "../AudioControl";
import AudioRight from "../AudioRight";

const cx = classNames.bind(styles);

const AudioPlayer: React.FC = () => {
  return (
    <div className={cx("audio")}>
      <div className={cx("audio-left")}>
        <AudioLeft  />
      </div>
      <div className={cx("audio-center")}>
        <AudioControl  />
      </div>
      <div className={cx("audio-right")}>
        <AudioRight  />
      </div>
    </div>
  );
};

export default AudioPlayer;
