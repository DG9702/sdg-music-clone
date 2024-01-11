import React, { useContext, useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import {
  AddIcon,
  EarthIcon,
  LibArrowRight,
  LibraryIcon,
  Recents,
  SearchIcon,
} from "~/assets/icons";
import { LibDataItem, LibSelection } from "~/types/sidebar";
import styles from "../Sidebar.module.scss";
import { AuthContext } from "~/context/AuthContext";
import SidebarItem from "~/components/SidebarItem";
import fetchSidebarData from "~/utils/fetchSidebarData";
import Button from "~/components/Button";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

type libCategory = "playlist" | "album" | "artist";

const Library: React.FC = () => {
  const { userData, isLogged, handleLogin } = useContext(AuthContext);
  const [category, setCategory] = useState<libCategory>("playlist");
  const [bottomShadow, setBottomShadow] = useState<boolean>(false);
  const [data, setData] = useState<LibDataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSidebarData({
        type: category,
        userId: userData?.id,
      });
      setData(data);
    };
    fetchData();
  }, [category, userData]);

  const libSelections: LibSelection[] = useMemo(
    () => [
      {
        type: "playlist",
        title: "Playlists",
        id: "00003",
        active: category === "playlist",
      },
      {
        type: "artist",
        title: "Artists",
        id: "00004",
        active: category === "artist",
      },
      {
        type: "album",
        title: "Albums",
        id: "00005",
        active: category === "album",
      },
    ],
    [category],
  );

  const libSelection = useMemo(
    () => libSelections.find((libSelection) => libSelection.active),
    [category],
  );

  const handleClick = (type: "playlist" | "album" | "artist"): void => {
    setCategory(type);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const yAxis = e.currentTarget.scrollTop;

    if (yAxis > 0) {
      setBottomShadow(true);
    } else {
      setBottomShadow(false);
    }
  };

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
                {isLogged && (
                  <button>
                    <LibArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </header>
          {isLogged && (
            <div className={cx("selection")}>
              <div className={cx("selection-body")}>
                {libSelections.map((item, index) => (
                  <button
                    onClick={() => handleClick(item.type)}
                    className={cx("libSelect-btn")}
                    key={index}
                  >
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div onScroll={handleScroll} className={cx("playlist-section")}>
          <div className={cx("section-list")}>
            <div className={cx("section-list-body")}>
              <div className={cx("section-list-flex")}>
                {isLogged ? (
                  <>
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
                    <div className={cx("section-playlist")}>
                      {data?.map((item, index: number) => (
                        <SidebarItem
                          key={item?.id || index}
                          id={item?.id || item?.album?.id}
                          author={item?.owner && item?.owner?.display_name}
                          artists={item?.artists || item?.album?.artists}
                          type={libSelection?.type}
                          name={item?.name || item?.album?.name}
                          thumbnail={
                            item?.images?.[item?.images?.length - 1]?.url ??
                            item?.album?.images?.[
                              item?.album?.images?.length - 1
                            ]?.url
                          }
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <section className={cx("section-suggest")}>
                      <div className={cx("section-suggest-body")}>
                        <span className={cx("section-text-medium")}>
                          Create your first playlist
                        </span>
                        <span className={cx("section-text-small")}>
                          It's easy, we'll help you
                        </span>
                      </div>
                      <div className={cx("section-suggest-btn")}>
                        <Button type="primary" small className={cx("btn-sc")}>
                          <span>Create Playlist</span>
                        </Button>
                      </div>
                    </section>
                    <section className={cx("section-suggest")}>
                      <div className={cx("section-suggest-body")}>
                        <span className={cx("section-text-medium")}>
                          Let's find some podcasts to follow
                        </span>
                        <span className={cx("section-text-small")}>
                          We'll keep you updated on new episodes
                        </span>
                      </div>
                      <div className={cx("section-suggest-btn")}>
                        <Button type="primary" small className={cx("btn-sc")}>
                          <span>Browse podcasts</span>
                        </Button>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isLogged && (
        <div className={cx("left-sidebar-bottom")}>
          <div className={cx("left-sidebar-link")}>
            <div className={cx("BottomLinksList")}>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>Legal</span>
                </Link>
              </div>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>Privacy Center</span>
                </Link>
              </div>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>Privacy Policy</span>
                </Link>
              </div>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>Cookies</span>
                </Link>
              </div>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>About Ads</span>
                </Link>
              </div>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>Accessibility</span>
                </Link>
              </div>
            </div>
            <Link className={cx("Cookie-link")} to={"/"}>
              <span>Cookies</span>
            </Link>
          </div>
          <div className={cx("language")}>
            <Button type="default" leftIcon={<EarthIcon />} small>
              English
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
