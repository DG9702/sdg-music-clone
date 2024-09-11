import { FC, ReactNode, memo, useState } from "react";
import classNames from "classnames/bind";

import styles from "./Sidebar.module.scss";
import Navbar from "./Navbar";
import Library from "./Library";

const cx = classNames.bind(styles);

interface SidebarProps {
  children?: ReactNode;
}

const Sidebar: FC<SidebarProps>=() => {
  const[isCollapsed, setCollapsed]=useState<boolean>(false);


  return (
    <div className={cx("sidebar")}
      style={{
        minWidth: isCollapsed ? 85 : 280,
        maxWidth: isCollapsed ? 85 : undefined,
      }}
    >
      <Navbar
        isCollapsed={isCollapsed}
        setCollapsed={setCollapsed}
      />
      <Library
        isCollapsed={isCollapsed}
        setCollapsed={setCollapsed}
      />
    </div>
    );
};

export default memo(Sidebar);
