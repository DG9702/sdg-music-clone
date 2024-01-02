import React from "react";
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

const cx = classNames.bind(styles);

const MainLayout = () => {
  return (
    <div className={cx("main-layout")}>
      <AuthProvider>
        <HomePageProvider>
          <SkeletonTheme baseColor="#333" highlightColor="hsla(0,0%,100%,.1)">
            <div className={cx("main-layout-top")}>
              <Split
                cursor="col-resize"
                minSize={[280, 600]}
                maxSize={[500, 99999]}
                // sizes={[20, 70, 10]}
                sizes={[20, 80]}
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
              </Split>
            </div>
            <div className={cx("main-layout-bottom")}>
              <AudioPlayer />
            </div>
          </SkeletonTheme>
        </HomePageProvider>
      </AuthProvider>
    </div>
  );
};

export default MainLayout;
