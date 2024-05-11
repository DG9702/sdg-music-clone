import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import SearchGenre from "~/components/SearchGenre";
import styles from "./Search.module.scss";
import { SearchContext } from "~/context/SearchContext";
import SearchResult from "~/components/SearchResult";

const cx = classNames.bind(styles);

interface SearchProps {
  children?: React.ReactNode;
}

const Search: React.FC<SearchProps> = () => {
  const { setQuery: setSearchQuery, query: searchQuery } =
    useContext(SearchContext);
  const [query, setQuery] = useState<string | undefined>(searchQuery);
  const [debounceValue, setDebounceValue] = useState<string | undefined>(
    searchQuery,
  );

  useEffect(() => {
    window.document.title = "Spotify – Search";
  });

  useEffect(() => {
    let timeoutId: any;
    if (!query?.trim()) {
      setDebounceValue("");
    } else {
      timeoutId = setTimeout(() => {
        setDebounceValue(query?.trim());
      }, 500);
    }

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    setSearchQuery(debounceValue);
  }, [debounceValue]);

  return (
    <div className={cx("search")}>
      <Header type="search" {...{ query, setQuery }} />
      <div className={cx("body")}>
        {debounceValue && <SearchResult />}
        <div style={{ display: debounceValue && "none" }}>
          <SearchGenre />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
