import React, {useContext, useEffect, useState} from "react";
import classNames from "classnames/bind";

import styles from "./SectionPage.module.scss";
import {SectionProps} from "~/types/section";
import {ArtistContext} from "~/context/ArtistContext";
import {HomePageContext} from "~/context/HomePageContext";
import {useLocation, useParams} from "react-router-dom";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Section from "~/components/Section";
import {AuthContext} from "~/context/AuthContext";
import {getUserPlaylist} from "~/services/userApi";

const cx = classNames.bind(styles);

const SectionPage: React.FC = () => {
  const [data, setData] = useState<SectionProps | undefined>();
  const featuringRegex = /^\/artist\/.*\/featuring$/;
  const relatedRegex = /^\/artist\/.*\/related$/;
  const playlistsRegex = /^\/artist\/.*\/playlists$/;
  const discoveredOnRegex = /^\/artist\/.*\/discovered-on$/;
  const appearsOnRegex = /^\/artist\/.*\/appears-on$/;
  const userPlaylistsRegex = /^\/user\/.*\/playlist$/;

  const {
    profile,
    featuring,
    relatedArtists,
    discoveredOn,
    playlists,
    appearsOn,
  } = useContext(ArtistContext);
  const {
    userData,
  }=useContext(AuthContext);
  const { featurePlaylist, newReleases, suggestArtists, topMixes } =
    useContext(HomePageContext);

  const { id } = useParams();
  const { pathname } = useLocation();
  

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
      } else if(userPlaylistsRegex.test(pathname)) {
        console.log("Check id userPlaylistsRegex");
        const response = await getUserPlaylist(id);
        const result = response?.items?.filter((p: any) => p?.owner?.id===userData?.id).map((p: any) => {
          return p
        })        

        setData({
          title: `Public Playlists`,
          dataType: "playlist",
          data: result,
          apiType: 'spotify',
        })

      } else if (featuringRegex.test(pathname)) {
        setData({
          title: `Featuring ${profile?.name}`,
          dataType: "playlist",
          data: featuring,
          apiType: "rapid",
        });
      } else if (relatedRegex.test(pathname)) {
        setData({
          title: `Fans also like`,
          dataType: "artist",
          data: relatedArtists,
          apiType: "rapid",
        });
      } else if (discoveredOnRegex.test(pathname)) {
        setData({
          title: `Discovered on`,
          dataType: "playlist",
          data: discoveredOn,
          apiType: "rapid",
        });
      } else if (playlistsRegex.test(pathname)) {
        setData({
          title: `Artist Playlists`,
          dataType: "playlist",
          data: playlists,
          apiType: "rapid",
        });
      } else if (appearsOnRegex.test(pathname)) {
        setData({
          title: `Appear On`,
          dataType: "album",
          data: appearsOn,
          apiType: "rapid",
        });
      }
    };
    fetchData();
  }, [pathname]);    

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

export default SectionPage
