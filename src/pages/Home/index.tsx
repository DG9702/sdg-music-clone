import React, { useContext, useState } from "react";
import classNames from "classnames/bind";

import styles from "./Home.module.scss";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Section from "~/components/Section";
import {HomePageContext} from "~/context/HomePageContext";

const cx = classNames.bind(styles);

const Home = () => {
  const [bgColor, setBgColor] = useState<string>("#c0b8c1");
  const [navOpacity, setNavOpacity] = useState<number>(0);

  const {
    trending,
    focus,
  } = useContext(HomePageContext);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const yAxis = e.currentTarget.scrollTop;

    if (yAxis > 64) {
      setNavOpacity(1);
    } else setNavOpacity(yAxis / 64);
  };

  return (
    <div className={cx("home")}>
      <Header type="home" navOpacity={navOpacity} />
      <div onScroll={(e) => handleScroll(e)} className={cx("home-container")}>
        <Section
          apiType="spotify"
          title={trending?.title}
          href={trending?.href}
          data={trending?.data}
          dataType={trending?.dataType}
        />
        <Section
          apiType="spotify"
          title={focus?.title}
          href={focus?.href}
          data={focus?.data}
          dataType={focus?.dataType}
        />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
