import React, {useContext} from "react";
import classNames from "classnames/bind";
import styles from "./AudioPlayer.module.scss";
import AudioLeft from "../AudioLeft";
import AudioControl from "../AudioControl";
import AudioRight from "../AudioRight";
import {PlayerContext} from "~/context/PlayerContext";

const cx = classNames.bind(styles);

const AudioPlayer: React.FC = () => {
  const { currentTrack } = useContext(PlayerContext);  

  return (
    <div className={cx("audio-wrapper")}>
      <div className={cx("audio-left")}>
       {currentTrack && <AudioLeft />}
      </div>
      <div className={cx("audio-center")}>
        <AudioControl />
      </div>
      <div className={cx("audio-right")}>
        <AudioRight />
      </div>
    </div>
  );
};

export default AudioPlayer;
