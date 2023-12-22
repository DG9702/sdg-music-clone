import React from "react";
import classNames from "classnames/bind";

import styles from "./Home.module.scss";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

const cx = classNames.bind(styles);

const Home = () => {
  return (
    <div className={cx("home")}>
      <Header type="home" />
      <div className={cx("body")}>Home page</div>
      <Footer />
    </div>
  );
};

export default Home;
