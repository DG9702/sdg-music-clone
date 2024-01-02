import React from "react";
import classNames from "classnames/bind";

import styles from "../Sidebar.module.scss";
import { AddIcon, LibArrowRight, LibraryIcon } from "~/assets/icons";

const cx = classNames.bind(styles);

const Library = () => {
  return (
    <div className={cx("library")}>
      <div className={cx("playlist")}>
        <div>
          <header className={cx("playlist-header")}>
            <div className={cx("playlist-header-container")}>
              <div className={cx("playlist-header-title")}>
                <div className={cx("playlist-header-icon")}>
                  <LibraryIcon />
                </div>
                <span className={cx("playlist-header-text")}>Your Library</span>
              </div>
              <div className={cx("playlist-button")}>
                <button>
                  <AddIcon size={16} />
                </button>
                <button>
                  <LibArrowRight size={16} />
                </button>
              </div>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
};

export default Library;
