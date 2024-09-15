import {
  ArrowBackIcon,
  ArrowForwardIcon,
  InstallApp,
  NotificationIcon,
  OutlineCLear,
  SearchIcon,
  UserImgDefault,
} from "~/assets/icons";
import classNames from "classnames/bind";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { AuthContext } from "../../context/AuthContext";
import Button from "../Button";
import {Dropdown, MenuProps} from "antd";

const cx = classNames.bind(styles);

interface HeaderProps {
  type?: "default" | "home" | "section" | "search" | "artist" | "genre";
  bgColor?: string | null;
  navOpacity?: number;
  query?: string;
  title?: string;
  playBtnVisible?: boolean;
  inclPlayBtn?: boolean;
  setQuery?: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleClickPlayBtn?: any;
  showTitle?: boolean;
}

const Header: FC<HeaderProps> = (props) => {
  const {
    bgColor,
    navOpacity = 1,
    query,
    setQuery,
    type = "default",
  } = props;

  const { isLogged, userData, handleLogin, handleLogout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState<any>(false);

  const { key } = useLocation();
  const navigate = useNavigate();
  const queryRef = useRef<any>(null);

  const items: MenuProps['items'] = [
      {
        label: 'Profile',
        key: 'Profile',
        onClick: () => {
          navigate(`/user/${userData?.id}`)
        }
      },
      {
        label: 'Settings',
        key: 'Settings',
        onClick: () => {
          console.log("Check settings");
        }
      },
      { type: "divider" },
      {
        label: 'Logout',
        key: 'Logout',
        onClick: () => {
          handleLogout();
        }
      }
    ];

  useEffect(() => {
    if (type === "search") {
      queryRef?.current.focus();
    }
  }, []);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      style={{
        backgroundColor: isLogged ? "transparent" : "rgba(0, 0, 0, 0.5)",
      }}
      className={cx("header")}
    >
      <div
        style={{
          backgroundColor: `${type === "section" ? "#121212" : bgColor}`,
          opacity: `${navOpacity}`,
          backgroundImage: `${
            type === "home" &&
            "linear-gradient(rgba(0, 0, 0, .6), rgba(0, 0, 0, .6))"
          }`,
        }}
        className={cx({ "header-bg": true, darken: bgColor })}
      ></div>
      <div className={cx("header-left")}>
        <button
          name="back"
          disabled={key === "default"}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </button>
        <button
          // disabled={Boolean(location.next)}
          //disabled
          name="forward"
          onClick={() => navigate(1)}
        >
          <ArrowForwardIcon />
        </button>
      </div>

      <div className={cx("header-search")}>
        {type === "search" && (
          <div className={cx("header-search-control")}>
            <div className={cx("header-search-body")}>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  ref={queryRef}
                  placeholder="What do you want to listen to?"
                  spellCheck={false}
                  onChange={(e) => setQuery!(e.target.value)}
                  value={query}
                />
              </form>
  
              <div className={cx({ icon: true, "search-icon": true })}>
                <SearchIcon />
              </div>
              {query && (
                <button
                  name="clear query"
                  className={cx({ icon: true, "clear-btn": true })}
                  onClick={() => setQuery!("")}
                >
                  <OutlineCLear />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={cx("header-right")}>
        <Button type={isLogged ? "primary" : "text"} small>
          {isLogged ? "Explore Premium" : "Premium"}
        </Button>
        {isLogged ? (
          <></>
        ) : (
          <Button type="text" small>
            Support
          </Button>
        )}
        <Button
          type={isLogged ? "default" : "text"}
          leftIcon={isLogged ? <InstallApp /> : ""}
          small
        >
          {isLogged ? "Install App" : "Download"}
        </Button>
        {isLogged ? (
          <Button type="circle">
            <NotificationIcon />
          </Button>
        ) : (
          <></>
        )}
        {isLogged ? (
          <Dropdown placement='bottomRight' menu={{ items }} trigger={["click"]}>
            <Button
              className={cx("user")}
              type="circle"
              onClick={handleMenuClick}
            >
              {userData?.images?.length === 0 ? (
                <button name="user account">
                  <UserImgDefault />
                </button>
              ) : (
                <img
                  src={userData?.images?.[0].url}
                  alt={userData?.display_name}
                />
              )}
            </Button>
          </Dropdown>
        ) : (
          <>
            <div className={cx("hr")}></div>
            <div>
              <Button type="text" className={cx("btn-sign-up")}>
                Sign up
              </Button>
              <Button
                type="primary"
                large
                className={cx("btn-login")}
                onClick={handleLogin}
              >
                <span>Log in</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
