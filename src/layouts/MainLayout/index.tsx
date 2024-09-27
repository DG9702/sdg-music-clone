import { useContext } from "react";
import classNames from "classnames/bind";
import styles from "./MainLayout.module.scss";
import Split from "react-split";
import Sidebar from "~/components/Sidebar";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "~/context/AuthContext";
import { MainLayoutProvider } from "~/context/MainLayoutContext";
import { SkeletonTheme } from "react-loading-skeleton";
import { HomePageProvider } from "~/context/HomePageContext";
import AudioPlayer from "~/components/AudioPlayer";
import { SearchProvider } from "~/context/SearchContext";
import { ArtistProvider } from "~/context/ArtistContext";
import { PlayerProvider } from "~/context/PlayerContext";
import { AppContext } from "~/App";
import Queue from "~/components/Queue";
import PlayingView from "~/components/PlayingView";
import EditPlaylistModal from "~/components/Modal/EditPlaylistModal";

const cx = classNames.bind(styles);

const MainLayout = () => {
  const { isPlayingViewShowed, isQueueShowed } = useContext(AppContext);  

  return (
    <div className={cx("main-layout")}>
      <AuthProvider>
          <PlayerProvider>
            <HomePageProvider>
              <SearchProvider>
                <ArtistProvider>
                  <SkeletonTheme
                    baseColor="#333"
                    highlightColor="hsla(0,0%,100%,.1)"
                  >
                    <EditPlaylistModal  />

                    <div className={cx("main-layout-top")}>
                      <Split
                        cursor="col-resize"
                        minSize={
                          isPlayingViewShowed
                            ? [280, 400, 0]
                            : [280, 600]
                        }
                        maxSize={
                          isPlayingViewShowed
                            ? [500, 99999, 400]
                            : [500, 99999]
                        }
                        // sizes={[20, 70, 10]}
                        sizes={
                          isPlayingViewShowed
                            ? [20, 55, 25]
                            : [20, 80]
                        }
                        className={cx("split")}
                        gutterSize={8}
                        snapOffset={20}
                      >
                        <Sidebar />
                        <MainLayoutProvider>
                          <div className={cx("main-container")}>
                            <Outlet />
                          </div>
                        </MainLayoutProvider>
                        {isPlayingViewShowed && !isQueueShowed && (
                          <>
                            <div></div>
                            <PlayingView />
                          </>
                        )}
                        {isQueueShowed && !isPlayingViewShowed && (
                          <>
                            <div></div>
                            <Queue />
                          </>
                        )}
                      </Split>
                    </div>
                    <div className={cx("main-layout-bottom")}>
                      <AudioPlayer />
                    </div>
                  </SkeletonTheme>
                </ArtistProvider>
              </SearchProvider>
            </HomePageProvider>
          </PlayerProvider>
      </AuthProvider>
    </div>
  );
};

export default MainLayout;
