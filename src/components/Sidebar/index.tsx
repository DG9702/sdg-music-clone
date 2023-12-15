import React from "react";
import classNames from "classnames/bind";

import styles from "./Sidebar.module.scss";
import Navbar from "./Navbar";
import Library from "./Library";

const cx = classNames.bind(styles);


const Sidebar = () => {
  return (
    <div className={cx("sidebar")}>
      <Navbar  />
      <Library  />
    </div>
    );
};

export default Sidebar
