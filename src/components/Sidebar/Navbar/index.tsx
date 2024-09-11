import {
  HomeActiveIcon,
  HomeIcon,
  SearchActiveIcon,
  SearchIcon,
} from "~/assets/icons";
import classNames from "classnames/bind";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../Sidebar.module.scss";


export interface yourLibraryState {
  isCollapsed?: boolean;
  setCollapsed?: any;
}


const cx = classNames.bind(styles);

const Nav: React.FC<yourLibraryState> = ({ isCollapsed }) => {
  const { pathname } = useLocation();  
  
  const routes = useMemo(
    () => [
      {
        name: "Home",
        path: "/",
        active: pathname === "/",
        icons: [HomeActiveIcon, HomeIcon],
      },
      {
        name: "Search",
        path: "/search",
        active: pathname === "/search",
        icons: [SearchActiveIcon, SearchIcon],
      },
    ],
    [pathname],
  );

  return (
    <div className={cx("navbar-container")}>
      <ul>
        {routes.map((item, index) => {
          const ActiveIcon = item.icons[0];
          const InactiveIcon = item.icons[1];

          return (
            <li className={cx("nav-item")} key={index}>
              <Link
                to={item.path}
                className={cx({"nav-item-body": true, active: item.active})}
                style={{
                  gap: isCollapsed? 0 : 20,
                  justifyContent: isCollapsed ? "center" : ""

                 }}
              >
                <div className={cx("nav-icon")}>
                  {item.active ? <ActiveIcon /> : <InactiveIcon />}
                </div>
                <span className={cx("nav-name")}>{!isCollapsed && item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Nav;
