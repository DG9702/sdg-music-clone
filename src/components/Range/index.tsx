import React from "react";
import classNames from "classnames/bind";
import styles from "./Range.module.scss";

const cx = classNames.bind(styles);

const Range: React.FC = () => {
  return (
    <div className={cx("range")}>
      <label className={cx("hidden-visually")}>
        Change progress
        <input
          type="range"
          min="0"
          max="184"
          step="5"
          aria-valuetext="0:32/3:04"
          //value="32"
        />
      </label>
      <div className={cx("progress-bar")}>
        <div
          className={cx("progress-bar-background")}
          style={{ height: "4px", borderRadius: "2px" }}
        >
          <div className={cx("process-bar-container")}>
            <div className={cx("process-bar-rule")}></div>
          </div>
          <div className={cx("dot")}></div>
        </div>
      </div>
    </div>
  );
};

export default Range;
