import { usePalette } from "color-thief-react";
import React, { useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import useComponentSize from "~/hook/useComponentSize";
import { SongItemTagProps } from "~/types/track";
import PlayButton from "../PlayButton";
import classNames from "classnames/bind";
import styles from "./SongItemTag.module.scss"
import ImageLazy from "../Image";

const cx = classNames.bind(styles);

const SongItemTag: React.FC<SongItemTagProps> = (props) => {
  const { thumbnailUrl, name, setBgColor, isLoading, id } = props;
  const { data: dataColor } = usePalette(thumbnailUrl as string, 10, "hex", {
    crossOrigin: "Anonymous",
    quality: 100,
  });

  const color = dataColor?.[0] ?? "#121212";

  const imgRef = useRef<HTMLDivElement>(null);
  const handleHover = (): void => {
    setBgColor(color as string);
  };

  const navigate = useNavigate();

  const songTagRef = useRef<HTMLDivElement>(null);

  const { width } = useComponentSize(songTagRef);

  return (
    <div
      ref={songTagRef}
      onMouseEnter={handleHover}
      onMouseLeave={() => setBgColor("#e0e0e0")}
      className={cx("song-item-tag")}
      onClick={() => navigate(`/album/${id}`)}
    >
      <div className={cx("thumbnail")} ref={imgRef}>
        {!isLoading ? (
          // <img src={thumbnailUrl} alt={name} />
          <ImageLazy src={thumbnailUrl} alt={name} />
        ) : (
          <Skeleton height={"100%"} />
        )}
      </div>
      <div className={cx("body")}>
        {!isLoading ? (
          <>
            <p className={cx("body-name")}>{name}</p>
            <div
              className={cx({
                "play-btn": true,
                hidden: width !== -1 && width <= 270,
              })}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <PlayButton
                size={44}
                scaleHovering={1.1}
                transitionDuration={33}
              />
            </div>
          </>
        ) : (
          <Skeleton
            height={26}
            borderRadius={50}
            style={{
              position: "absolute",
              left: "0",
              right: "0",
              paddingInline: "16px",
              marginTop: "-7px",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SongItemTag
SongItemTag