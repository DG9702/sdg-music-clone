import React from 'react';
import classNames from 'classnames/bind';

import styles from "../Sidebar.module.scss";

const cx = classNames.bind(styles);

const Library = () => {
  return (
    <div className={cx("library")}>
      Library
    </div>
  )
}

export default Library
