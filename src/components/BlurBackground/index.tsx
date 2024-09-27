import React from 'react';
import classNames from 'classnames/bind';
import styles from "./BlurBackground.module.scss";

const cx=classNames.bind(styles);

type Props={
  bgColor?: any;
  top?: number;
}

const BlurBackground: React.FC<Props> = ({ bgColor, top }) => {
  return (
    <div
      style={{
        backgroundColor: `${bgColor}`,
        top: top    
      }}
        className={cx("bg-blur")}
    ></div>
  )
}

export default BlurBackground