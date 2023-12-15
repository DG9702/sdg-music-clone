import React from 'react';
import classNames from 'classnames/bind';

import styles from "../Sidebar.module.scss";

const cx = classNames.bind(styles);

const Navbar = () => {
  return (
    <div className={cx("navbar")}>
      Navbar container
    </div>
  )
}

export default Navbar
