import React from "react";
import classNames from "classnames/bind";
import styles from "./AudioButton.module.scss";
import AudioLeft from "../AudioLeft";

const cx = classNames.bind(styles);

const AudioPlayer: React.FC = () => {
  return (
    <div className={cx("audio")}>
      <div className={cx("audio-left")}>
        <AudioLeft  />
      </div>
      <div className={cx("audio-center")}>Center</div>
      <div className={cx("audio-right")}>Right</div>
    </div>
  );
};

export default AudioPlayer;
