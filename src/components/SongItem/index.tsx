import React, { memo, useContext } from "react";
import { PlayIcon, SingleMusicNote } from "~/assets/icons";
import { SongItemProps } from "~/types/track";
import dateFormatConvertor from "~/utils/dateFormatConvertor";
import ImageLazy from "../Image";
import Skeleton from "react-loading-skeleton";
import classNames from "classnames/bind";
import styles from "./SongItem.module.scss";
import {MainLayoutContext} from "~/context/MainLayoutContext";
import SubTitleArtists from "../SubTitle";

const cx = classNames.bind(styles);

const SongItem: React.FC<SongItemProps> = ({
  songName,
  artists,
  thumb,
  duration = 0,
  order,
  isLoading = false,
  dateAdd,
  albumData,
  isExplicit = false,
  type = "default",
  originalData,
}) => {
  const { width } = useContext(MainLayoutContext);

  return (
    <div
      className={cx({
        wrapper: true,
        "grid-md": width <= 780 && type !== "album",
        "is-album-track": type === "album",
        "is-search-result": type === "search",
      })}
    >
      <div className={cx("main")}>
        {type !== "album" && (
          <div className={cx("thumb")}>
            {!isLoading ? (
              thumb ? (
                <ImageLazy src={thumb} alt={songName} />
              ) : (
                <div className={cx("default-thumb")}>
                  <SingleMusicNote />
                </div>
              )
            ) : (
              <Skeleton height={"100%"} />
            )}
          </div>
        )}
        <div className={cx("title")}>
          {!isLoading ? (
            <>
              <p className={cx("name")}>{songName}</p>
              {type !== "artist" && (
                <div className={cx("sub-title")}>
                  {isExplicit && <span className={cx("explicit")}>E</span>}
                  <SubTitleArtists data={artists} />
                </div>
              )}
            </>
          ) : (
            <>
              <Skeleton borderRadius={50} height={"15px"} width={"200px"} />
              <Skeleton borderRadius={50} height={"10px"} width={"60px"} />
            </>
          )}
        </div>
      </div>
      {type !== "album" && type !== "search" && (
        <>
          <div className={cx("album")}>
            {!isLoading && <SubTitleArtists type="album" data={[{ ...albumData }]} />}
          </div>
          {width > 780 && (
            <div className={cx("date-add")}>
              {dateAdd !== "1970-01-01T00:00:00Z" && dateAdd
                ? dateFormatConvertor(dateAdd)
                : ""}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(SongItem)
