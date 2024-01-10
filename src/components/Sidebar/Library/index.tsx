import React, { useMemo } from "react";
import classNames from "classnames/bind";
import {
  AddIcon,
  LibArrowRight,
  LibraryIcon,
  Recents,
  SearchIcon,
} from "~/assets/icons";
import { LibSelection } from "~/types/sidebar";
import styles from "../Sidebar.module.scss";

const cx = classNames.bind(styles);

const Library: React.FC = () => {
  const libSelections: LibSelection[] = useMemo(
    () => [
      {
        type: "playlist",
        title: "Playlists",
        id: "00003",
      },
      {
        type: "artist",
        title: "Artists",
        id: "00004",
      },
      {
        type: "album",
        title: "Albums",
        id: "00005",
      },
    ],
    [],
  );

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
          <div className={cx("selection")}>
            <div className={cx("selection-body")}>
              {libSelections.map((item, index) => (
                <button className={cx("libSelect-btn")} key={index}>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={cx("playlist-section")}>
          <div className={cx("section-list")}>
            <div className={cx("section-list-body")}>
              <div className={cx("section-list-flex")}>
                <div className={cx("section-head")}>
                  <div className={cx("head-search")}>
                    <button>
                      <SearchIcon />
                    </button>
                  </div>

                  <button className={cx("head-recent")}>
                    <span className={cx("recent-title")}>Recents</span>
                    <span className={cx("recent-icon")}>
                      <Recents />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
