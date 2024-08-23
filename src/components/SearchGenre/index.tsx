import React, { useContext } from "react";
import classNames from "classnames/bind";
import styles from "./SearchGenre.module.scss";
import { MainLayoutContext } from "~/context/MainLayoutContext";
import { SearchContext } from "~/context/SearchContext";
import SearchGenreItem from "./SearchGenreItem";

const cx = classNames.bind(styles);

const SearchGenre: React.FC = () => {
  const { quantityCol } = useContext(MainLayoutContext);
  const { categoriesData } = useContext(SearchContext);  

  return (
    <div className={cx("wrapper")}>
      <h2 className={cx("heading")}>Browse all</h2>
      <div
        style={{ gridTemplateColumns: `repeat(${quantityCol}, 1fr)` }}
        className={cx("body")}
      >
        {categoriesData?.map((item, index) => (
          <SearchGenreItem
            title={item?.title}
            imgUrl={item?.imgUrl}
            id={item?.id}
            bgColor={item?.bgColor}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(SearchGenre)
