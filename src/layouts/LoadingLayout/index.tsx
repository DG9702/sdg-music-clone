import React from "react";
import classNames from "classnames/bind";
import styles from "./LoadingLayout.module.scss";
import { StageSpinner } from "react-spinners-kit";

const cx = classNames.bind(styles);

const LoadingLayout: React.FC = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("spinner")}>
        <StageSpinner size={100} color="#333" />
      </div>
      <div className={cx("audio-player-bar")}>
        Bottom Layout
      </div>
    </div>
  );
};

export default LoadingLayout
