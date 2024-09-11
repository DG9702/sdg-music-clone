import React, { useContext } from "react";
import classNames from "classnames/bind";
import styles from "./SectionItem.module.scss";
import ImageLazy from "../Image";
import { UserImgDefault } from "~/assets/icons";
import { SectionItemI } from "~/types/section";
import Skeleton from "react-loading-skeleton";
import PlayButton from "../PlayButton";
import dateFormatConvertor from "~/utils/dateFormatConvertor";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "~/context/PlayerContext";
import categoryApi from "~/services/categoryApi";
import { getArtistTopTrack } from "~/services/artistApi";
import {SubTitleArtists} from "../SubTitle";
import {episodeApi} from "~/services/episodeApi";
import {showApi} from "~/services/showApi";

const cx = classNames.bind(styles);

const SectionItem: React.FC<SectionItemI> = ({
  title,
  name,
  imageUrl,
  id,
  dataType,
  author,
  artists,
  desc,
  isLoading,
  publisher,
  dateAdd,
  type,
}) => {
  const {
    setCurrentTrack,
    setCurrentTrackIndex,
    setQueue,
    calNextTrackIndex,
    setPlayingType,
  } = useContext(PlayerContext);

  const navigate = useNavigate();
  const handleClickPlayBtn = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (dataType === "album") {
      const fetchData = async () => {
        const data = await categoryApi({
          type: "albums",
          id,
        });
        const queueList = data?.tracks?.items?.map((item: any) => {
          return {
            ...item,
            album: {
              album_type: data?.album_type,
              id: data?.name,
              name: data?.name,
              images: data?.images,
            },
          };
        });
        setQueue([...queueList]);
        setCurrentTrack({ ...queueList?.[0] });
        setCurrentTrackIndex(0);
        setPlayingType("track");
        calNextTrackIndex();
      };
      fetchData();
    } else if (dataType === "playlist") {
      const fetchData = async () => {
        const data = await categoryApi({
          type: `playlists`,
          id,
        });
        const queueList =
          data?.tracks?.items?.map((item: any) => item?.track) || [];
        setQueue([...queueList]);
        setCurrentTrack({ ...queueList?.[0] });
        setCurrentTrackIndex(0);
        setPlayingType("track");
        calNextTrackIndex();
      };
      fetchData();
    } else if (dataType === "artist") {
      const fetchData = async () => {
        const data = await getArtistTopTrack(id);
        setQueue([...data.tracks]);
        setCurrentTrack({ ...data?.tracks?.[0] });
        setCurrentTrackIndex(0);
        calNextTrackIndex();
        setPlayingType("track");
      };
      fetchData();
    } else if (dataType === "show") {
      const fetchData = async () => {
        const data = await showApi({ id });
        const queueList =
          data?.episodes?.items?.map((item: any) => {
            return {
              ...item,
              show: {
                name: data?.name,
                id: data?.id,
                publisher: data?.publisher,
              },
            };
          }) || [];
        setQueue([...queueList]);
        setCurrentTrack({ ...queueList?.[0] });
        setCurrentTrackIndex(0);
        calNextTrackIndex();
        setPlayingType("show");
      };
      fetchData();
    } else if (dataType === "episode") {
      const fetchData = async () => {
        const data = await episodeApi({ id });
        setQueue([{ ...data }]);
        setCurrentTrack({ ...data });
        setCurrentTrackIndex(0);
        setPlayingType("show");
        calNextTrackIndex();
      };
      fetchData();
    }
  };

  return (
    <div
      onClick={() => navigate(`/${dataType}/${id}`)}
      className={cx("wrapper")}
    >
      <div className={cx("container")}>
        <div
          className={cx(
            { isArtist: dataType === "artist" },
            "section-item-img",
          )}
        >
          {!isLoading ? (
            dataType === "artist" ? (
              imageUrl ? (
                <ImageLazy src={imageUrl} alt={title || name} />
              ) : (
                <div className={cx("user-img-default")}>
                  <UserImgDefault />
                </div>
              )
            ) : (
              <ImageLazy src={imageUrl} alt={title || name} />
            )
          ) : (
            <Skeleton height={"100%"} />
          )}
        </div>
        <div className={cx("btn-pivot")}>
          {!isLoading && (
            <div
              className={cx({
                "play-btn": true,
              })}
              onClick={handleClickPlayBtn}
            >
              <PlayButton
                size={50}
                fontSize={24}
                scaleHovering={1.05}
                transitionDuration={33}
              />
            </div>
          )}
        </div>

        <div className={cx("body")}>
          {!isLoading ? (
            <h3 className={cx("heading")}>{title || name}</h3>
          ) : (
            <Skeleton height={30} borderRadius={50} />
          )}
          <div className={cx("section-item-desc")}>
            {!isLoading ? (
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    (type === "show" && publisher) ||
                    (dataType === "episode" && dateFormatConvertor(dateAdd)) ||
                    desc ||
                    (author && `By ${author}`) ||
                    (dataType === "artist" && "Artist") ||
                    (artists && <SubTitleArtists data={artists} />) ||
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                }}
              ></p>
            ) : (
              <Skeleton width={"60%"} height={22.5} borderRadius={50} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionItem;
