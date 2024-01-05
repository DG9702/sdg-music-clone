import React, { useContext, useState } from "react";
import classNames from "classnames/bind";

import styles from "./Home.module.scss";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Section from "~/components/Section";
import { HomePageContext } from "~/context/HomePageContext";
import { AuthContext } from "~/context/AuthContext";
import Greeting from "~/components/Greeting";

const cx = classNames.bind(styles);

const Home = () => {
  const [bgColor, setBgColor] = useState<string>("rgb(83, 83, 83)");
  const [navOpacity, setNavOpacity] = useState<number>(0);

  const { isLogged } = useContext(AuthContext);

  const {
    recently,
    trending,
    focus,
    jazz,
    chill,
    featurePlaylist,
    suggestArtists,
    newReleases,
    topMixes,
  } = useContext(HomePageContext);

  //console.log("recently: ", recently?.data);
  //console.log("featurePlaylist: ", featurePlaylist);
  //console.log("Artist: ", suggestArtists);
  //console.log("New Releases: ", newReleases);
  

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
        {isLogged && <Greeting bgColor={bgColor} setBgColor={setBgColor} />}
        {/*<Section
          apiType="spotify"
          title={recently?.title}
          href={recently?.href}
          data={recently?.data}
          dataType={recently?.dataType}
        />*/}
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
        {isLogged && (
          <>
            <Section
              apiType="spotify"
              title={featurePlaylist?.title}
              href={featurePlaylist?.href}
              data={featurePlaylist?.data}
              dataType={featurePlaylist?.dataType}
            />
            <Section
              apiType="spotify"
              title={suggestArtists?.title}
              href={suggestArtists?.href}
              data={suggestArtists?.data}
              dataType={suggestArtists?.dataType}
            />
            <Section
              apiType="spotify"
              title={chill?.title}
              href={chill?.href}
              data={chill?.data}
              dataType={chill?.dataType}
            />
            <Section
              apiType="spotify"
              title={jazz?.title}
              href={jazz?.href}
              data={jazz?.data}
              dataType={jazz?.dataType}
            />
            <Section
              apiType="spotify"
              title={newReleases?.title}
              href={newReleases?.href}
              data={newReleases?.data}
              dataType={newReleases?.dataType}
            />
            <Section
              apiType="spotify"
              title={topMixes?.title}
              href={topMixes?.href}
              data={topMixes?.data}
              dataType={topMixes?.dataType}
            />
          </>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
