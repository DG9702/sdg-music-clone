import React, { memo, useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Greeting.module.scss";
import { HomePageContext } from "~/context/HomePageContext";
import { MainLayoutContext } from "~/context/MainLayoutContext";
import Skeleton from "react-loading-skeleton";
import { ResponseSectionItem } from "~/types/section";
import SongItemTag from "../SongItemTag";

const cx = classNames.bind(styles);

interface GreetingProps {
  bgColor?: string | null;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;
}

const Greeting: React.FC<GreetingProps> = (props) => {
  const { bgColor, setBgColor } = props;
  const [isLoading, setLoading] = useState<boolean>(true);

  const { greetingAlbum } = useContext(HomePageContext);

  const { width } = useContext(MainLayoutContext);

  useEffect(() => {
    setBgColor("rgb(83, 83, 83)");
    setLoading(greetingAlbum?.length === 0);
  }, [greetingAlbum]);

  const greeting = (): string => {
    const currentHour = new Date().getHours();
    if (5 <= currentHour && currentHour <= 11) return "Good morning";
    if (12 <= currentHour && currentHour <= 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div style={{ backgroundColor: `${bgColor}` }} className={cx("greet")}>
      <div className={cx("greet-heading")}>
        {!isLoading ? (
          <p>{greeting()}</p>
        ) : (
          <Skeleton width={"35%"} height={50} borderRadius={50} />
        )}
      </div>

      <div
        className={cx("greet-body", {
          "songs-section": true,
          "songs-section-responsive": width !== -1 && width <= 900,
          "songs-section-mobile": width !== -1 && width <= 600,
        })}
      >
        {!isLoading
          ? greetingAlbum
              ?.slice(0, 6)
              .map((item: ResponseSectionItem, index) => (
                <SongItemTag
                  id={item?.id}
                  isLoading={isLoading}
                  key={item.id || index}
                  thumbnailUrl={item.images[0].url}
                  name={item.name}
                  setBgColor={setBgColor}
                />
              ))
          : Array(6)
              .fill(0)
              .map((item, index) => (
                <SongItemTag
                  key={index + item}
                  isLoading={isLoading}
                  setBgColor={setBgColor}
                />
              ))}
      </div>
    </div>
  );
};

export default memo(Greeting);
