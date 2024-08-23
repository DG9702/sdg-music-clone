import classNames from "classnames/bind";
import { FC } from "react";
import { Link } from "react-router-dom";

import styles from "./SidebarItem.module.scss";
import { SidebarItemProps } from "~/types/sidebar";
import ImageLazy from "../Image";
import ThumbDefault from "../ThumbDefault";
import {SubTitleArtists} from "../SubTitle";

const cx = classNames.bind(styles);

const SidebarItem: FC<SidebarItemProps> = (props) => {
  const { type, thumbnail, name, author, id, artists } = props;

  const newType = (() => {
    if (type === "playlist") return author;
    if (type === "album" && artists) return <SubTitleArtists data={artists} />;
  })();

  return (
    <Link to={type === 'collection' ? `/${type}/track` : `/${type}/${id}`}>
      <div className={cx("sidebar-item")}>
        <div className={cx("thumbnail")}>
          {thumbnail ? (
            <ImageLazy src={thumbnail} alt={name} />
          ) : (
            <ThumbDefault />
          )}
        </div>
        <div className={cx("body")}>
          <h4 className={cx("heading")}>{name}</h4>
          <span className={cx("type")}>{newType}</span>
        </div>
      </div>
    </Link>
  );
};

export default SidebarItem;
