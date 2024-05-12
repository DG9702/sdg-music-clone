import React, { useContext } from "react";
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
                  <div className={cx("main-layout-top")}>
                    <Split
                      cursor="col-resize"
                      minSize={
                        isPlayingViewShowed || isQueueShowed
                          ? [280, 400, 0]
                          : [280, 600]
                      }
                      maxSize={
                        isPlayingViewShowed || isQueueShowed
                          ? [500, 99999, 400]
                          : [500, 99999]
                      }
                      // sizes={[20, 70, 10]}
                      sizes={
                        isPlayingViewShowed || isQueueShowed
                          ? [20, 50, 30]
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
                      {isQueueShowed ? (
                        <Queue />
                      ) : (
                        <div style={{ marginRight: "-8px" }}></div>
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
