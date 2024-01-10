import React from "react";
import classNames from "classnames/bind";

import styles from "./Search.module.scss";

const cx = classNames.bind(styles);

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import SearchGenre from "~/components/SearchGenre";

const Search = () => {
  return (
    <div className={cx("search")}>
      <Header type="search"  />
      <div className={cx("body")}>
        <SearchGenre  />
      </div>
      <Footer />
    </div>
  );
};

export default Search
