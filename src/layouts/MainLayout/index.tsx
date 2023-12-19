import React from "react";
import classNames from "classnames/bind";
import styles from "./MainLayout.module.scss";
import Split from "react-split";
import Sidebar from "~/components/Sidebar";
import {Outlet} from "react-router-dom";
import {AuthProvider} from "~/context/AuthContext";

const cx = classNames.bind(styles);

const MainLayout = () => {
  return (
    <div className={cx("main-layout")}>
      <AuthProvider>
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
            <Sidebar  />
            <div className={cx("main-container")}>
              <Outlet  />
            </div>
          </Split>
        </div>
        <div className={cx("main-layout-bottom")}>Bottom layout</div>
      </AuthProvider>
    </div>
  );
};

export default MainLayout;
