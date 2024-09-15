import React, { useContext, useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import {
  AddIcon,
  EarthIcon,
  EpisodesIcon,
  LibraryCollapseIcon,
  LibraryIcon,
  NewPlaylistIcon,
} from "~/assets/icons";
import { LibDataItem, LibSelection } from "~/types/sidebar";
import styles from "../Sidebar.module.scss";
import { AuthContext } from "~/context/AuthContext";
import SidebarItem from "~/components/SidebarItem";
import fetchSidebarData from "~/utils/fetchSidebarData";
import Button from "~/components/Button";
import { Link, useNavigate } from "react-router-dom";
import {Dropdown} from "antd";
import {createPlaylist} from "~/services/playlistApi";
import {toast} from "react-toastify";
import {SearchArea} from "./Filters";
import NoLogged from "./NoLogged";

const cx = classNames.bind(styles);

export interface yourLibraryState {
  isCollapsed?: boolean;
  setCollapsed?: any;
}

type libCategory = 'playlist' | 'album' | 'artist'; 
type viewAs = "Compact" | "List" | "Grid";

const Library: React.FC<yourLibraryState>=({ isCollapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const { userData, isLogged } = useContext(AuthContext);
  const [category, setCategory] = useState<libCategory>("playlist");
  const [bottomShadow, setBottomShadow] = useState<boolean>(false);
  const [data, setData]=useState<LibDataItem[]>([]);
  const [totalMyPlaylist, setTotalMyPlaylist]=useState<number>(0);

  const [searchValue, setSearchValue]=useState<any>();

  const [view, setView]=useState<viewAs>("List");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSidebarData({
        type: category,
        userId: userData?.id,
      });
      setData(data);
    };
    fetchData();
    if(data) {
      setTotalMyPlaylist(data?.filter((p: any) => p?.owner?.id === userData?.id)?.length);
    }
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
        title: "Artist",
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

  const handleClick = (type: "playlist" | "artist" | "album"): void => {
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

  console.log("Check data in category: ", category, data);
  
  
  return (
    <div className={cx("library")}>
      <div className={cx("playlist", { "open": isCollapsed === true })}>
        <div className={cx({ "bottom-shadow": bottomShadow })}>
          <header className={cx("playlist-header")}>
            <div className={cx("playlist-header-container")}>
              <div
                className={cx("playlist-header-title")}
                onClick={() => setCollapsed(!isCollapsed)}
                style={{
                  gap: isCollapsed? 0 : 20,
                  justifyContent: isCollapsed ? "center" : ""

                 }}
              >
                <div className={cx("playlist-header-icon")}>
                  {!isCollapsed ? <LibraryIcon /> : <LibraryCollapseIcon  />}
                </div>
                {!isCollapsed && (<span className={cx("playlist-header-text")}>Your Library</span>)}
              </div>
              {!isCollapsed && (<div className={cx("playlist-button")}>
                <Dropdown
                  placement='bottomRight'
                  trigger={['click']}
                  menu={{
                    items: [
                      {
                        key: 'create',
                        icon: <NewPlaylistIcon />,
                        label: 'Create a new Playlist',
                        onClick: () => {
                          createPlaylist(userData?.id, {name: `My Playlist ${totalMyPlaylist+1}`}).then((playlist) => {
                            toast.success("Create playlist success");
                            navigate(`/playlist/${playlist.data.id}`);
                          });

                        },
                      },
                    ],
                  }}
                >
                  <button className='addButton'>
                    <AddIcon />
                  </button>
                </Dropdown>
              </div>)}
            </div>
          </header>
          {isLogged && !isCollapsed && (
            <div className={cx("selection")}>
              <div className={cx("selection-body")}>
                {libSelections.map((item, index) => (
                  <button
                    onClick={() => handleClick(item?.type)}
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
        <div className={cx("playlist-section")}>
          <div onScroll={handleScroll} className={cx("section-list")}>
            <div className={cx("section-list-body")}>
              <div className={cx("section-list-flex")}>
                {isLogged ? (
                  <>
                    {!isCollapsed &&
                      <SearchArea
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        view={view}
                        setView={setView}
                      />
                    }
                    <div className={cx("section-playlist", { "section-playlist-grid": view === 'Grid' })}>
                      <SidebarItem
                        view={view}
                        searchValue={searchValue}
                        name="Liked Songs"
                        thumbnail="https://misc.scdn.co/liked-songs/liked-songs-64.png"
                        type="collection"
                      />
                      <SidebarItem
                        view={view}
                        searchValue={searchValue}
                        isEpisodes={true}
                        icon={<EpisodesIcon size={24} />}
                        name="Your Episodes"
                        type="collection"
                      />
                      {data?.sort()?.map((item, index: number) => (
                        <SidebarItem
                          searchValue={searchValue}
                          view={view}
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
        <NoLogged  />
      )}
    </div>
  );
};

export default Library;
