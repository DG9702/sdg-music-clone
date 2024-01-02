import React from "react";
import classNames from "classnames/bind";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import styles from "./SectionPage.module.scss";

const cx = classNames.bind(styles);

const Section: React.FC = () => {
  return (
    <div className={cx("section")}>
      <Header type="section" />
      <div className={cx("body")}>Section page</div>
      <Footer />
    </div>
  );
};

export default Section
