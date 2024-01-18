import { FC } from "react";
import styles from "../SearchResult.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface SearchNotFoundProps {
  query?: string;
}

const SearchNotFound: FC<SearchNotFoundProps> = ({ query }) => {
  return (
    <div className={cx("not-found")}>
      <div className={cx("not-found-container")}>
        <p className={cx("title")}>{`No results found for "${query}"`}</p>
        <span className={cx("msg")}>
          Please make sure your words are spelled correctly, or use fewer or
          different keywords.
        </span>
      </div>
    </div>
  );
};

export default SearchNotFound;
