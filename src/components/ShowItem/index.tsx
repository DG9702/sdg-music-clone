import { FC, memo, useContext } from "react";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import { CurrentTrack, PlayerContext } from "~/context/PlayerContext";
import { ShowItem as ShowItemProps } from "~/types/show";
import { dateFormatConvertor, durationConvertor } from "~/utils";
import styles from "./ShowItem.module.scss";
import PlayButton from "../PlayButton";
import ImageLazy from "../Image";
import {PlusCircle} from "~/assets/icons";

const cx = classNames.bind(styles);

interface ShowItemComponentProps {
  isLoading?: boolean;
  show?: {
    name?: string;
    id?: string;
    publisher?: string;
  };
  item?: ShowItemProps;
}

const ShowItem: FC<ShowItemComponentProps> = ({ item, show, isLoading }) => {
  const {
    setQueue,
    setCurrentTrack,
    setCurrentTrackIndex,
    setPlayingType,
    calNextTrackIndex,
  } = useContext(PlayerContext);

  const navigate = useNavigate();

  const handleClickPlayBtn = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    const dataNormalized = { ...item, show };
    setQueue([{ ...(dataNormalized as CurrentTrack) }]);
    setCurrentTrack({ ...dataNormalized });
    setCurrentTrackIndex(0);
    setPlayingType("show");
    calNextTrackIndex();
  };

  return (
    <div className={cx("main")}>
      <div
        onClick={() => navigate(`/episode/${item?.id}`)}
        className={cx("show-item-wrapper")}
      >
        <div className={cx("thumb")}>
          {!isLoading ? (
            <ImageLazy alt={item?.name} src={item?.images?.[0].url} />
          ) : (
            <Skeleton height={"100%"} width={"100%"} />
          )}
        </div>
        <div className={cx("body")}>
          <div className={cx("title")}>
            {!isLoading ? (
              <h4>{item?.name}</h4>
            ) : (
              <Skeleton
                style={{ marginTop: "6px" }}
                height={20}
                width={"30%"}
                borderRadius={500}
              />
            )}
          </div>
          <div className={cx("desc")}>
            {!isLoading ? (
              item?.description
            ) : (
              <Skeleton
                style={{ marginTop: "16px" }}
                width={"50%"}
                borderRadius={500}
              />
            )}
          </div>
          {!isLoading && (
            <>
              <div className={cx("release-date")}>
                <span>{dateFormatConvertor(item?.release_date)}</span>
                <div className={cx("dot")}></div>
                <span>
                  {durationConvertor({
                    milliseconds: item?.duration_ms,
                    type: "short",
                  })}
                </span>
              </div>
              <div className={cx("action")}>
                <div className={cx("plus-btn")}>
                  <PlusCircle />
                </div>
                <div onClick={handleClickPlayBtn} className={cx("play-btn")}>
                  <PlayButton
                    size={32}
                    bgColor="#fff"
                    scaleHovering={1.04}
                    transitionDuration={33}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ShowItem)
