import React from "react";
import classNames from "classnames/bind";
import styles from "./SectionItem.module.scss";
import ImageLazy from "../Image";
import { UserImgDefault } from "~/assets/icons";
import { SectionItemI } from "~/types/section";
import Skeleton from "react-loading-skeleton";
import PlayButton from "../PlayButton";
import dateFormatConvertor from "~/utils/dateFormatConvertor";

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
  return (
    <div className={cx("wrapper")}>
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
          <div className={cx("btn-pivot")}>
            {!isLoading && (
                <PlayButton
                  size={48}
                  fontSize={24}
                  scaleHovering={1.05}
                  transitionDuration={33}
                />
            )}
          </div>
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
