import classNames from "classnames/bind";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./SectionContainer.module.scss";
import Header from "~/components/Header";
import { SectionProps } from "~/types/section";
import { HomePageContext } from "~/context/HomePageContext";
import Footer from "~/components/Footer";
import Section from "~/components/Section";

const cx = classNames.bind(styles);

const SectionContainer: React.FC = () => {
  const [data, setData] = useState<SectionProps | undefined>();

  const { featurePlaylist, newReleases, suggestArtists, topMixes } =
    useContext(HomePageContext);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (id === "newReleases") {
        setData({
          title: newReleases?.title,
          href: newReleases?.href,
          dataType: newReleases?.dataType,
          data: newReleases?.data,
          apiType: newReleases?.apiType,
        });
      } else if (id === "featurePlaylist") {
        setData({
          title: featurePlaylist?.title,
          href: featurePlaylist?.href,
          dataType: featurePlaylist?.dataType,
          data: featurePlaylist?.data,
          apiType: featurePlaylist?.apiType,
        });
      } else if (id === "topMixes") {
        setData({
          title: topMixes?.title,
          href: topMixes?.href,
          dataType: topMixes?.dataType,
          data: topMixes?.data,
          apiType: topMixes?.apiType,
        });
      } else if (id === "suggestedArtists") {
        setData({
          title: suggestArtists?.title,
          href: suggestArtists?.href,
          dataType: suggestArtists?.dataType,
          data: suggestArtists?.data,
          apiType: suggestArtists?.apiType,
        });
      } 
    };
    fetchData();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <Header type="section" />
      <div className={cx("body")}>
        <Section
          apiType={data?.apiType}
          isClickable
          isFull
          dataType={data?.dataType}
          title={data?.title}
          data={data?.data}
        />
        <Footer />
      </div>
    </div>
  );
};

export default SectionContainer;
