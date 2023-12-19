import {
  ArrowBackIcon,
  ArrowForwardIcon,
  SearchIcon,
  UserImgDefault,
} from "~/assets/icons";
import classNames from "classnames/bind";
import React, { FC, useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { AuthContext } from "../../context/AuthContext";
import UserDropdown from "../UserDropdown";
import ImageLazy from "../Image";
import Button from "../Button";

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
    title = "",
    playBtnVisible = false,
    inclPlayBtn = false,
    handleClickPlayBtn,
    showTitle = false,
  } = props;

  const { isLogged, userData, handleLogin } = useContext(AuthContext);

  const { key } = useLocation();
  const navigate = useNavigate();
  const queryRef = useRef<any>(null);

  useEffect(() => {
    if (type === "search") {
      queryRef?.current.focus();
    }
  }, []);

  console.log("Userdata: ", userData);
  

  return (
    <header className={cx("header")}>
      <div
        style={{
          opacity: isLogged ? "1" : "0",
          backgroundColor: `${type === "section" ? "#121212" : bgColor}`,
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
          disabled
          name="forward"
          onClick={() => navigate(1)}
        >
          <ArrowForwardIcon />
        </button>
      </div>

      <div className={cx("header-search")}>
        {type === "search" && (
          <div className={cx("header-search-control")}>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                ref={queryRef}
                placeholder="What do you want to listen to?"
                spellCheck={false}
              />
            </form>

            <div className={cx({ icon: true, "search-icon": true })}>
              <SearchIcon />
            </div>
          </div>
        )}
      </div>

      <div className={cx("header-right")}>
        <Button type="text">Premium</Button>
        <button className={cx("btn-title")}>Support</button>
        <button className={cx("btn-title")}>Download</button>
        {isLogged ? (
          <div className={cx('user')}>
          {userData?.images?.length === 0 ? (
            <button name="user account">
              <UserImgDefault />
            </button>
          ) : (
            <div className={cx('user-avt')}>
              <ImageLazy src={userData?.images?.[0].url} alt={userData?.display_name} />
            </div>
          )}

          <div className={cx('user-dropdown')}>
            <UserDropdown />
          </div>
        </div>
        ) : (
        <>
          <div className={cx("hr")}></div>
          <div>
            <button
              className={cx("btn-title")}
              style={{
                paddingInlineStart: "8px",
                paddingInlineEnd: "32px",
              }}
            >
              Sign up
            </button>
            <button className={cx("btn-login")} onClick={handleLogin}>
              <span>Log in</span>
            </button>
          </div>
        </>

        )}
        
      </div>
    </header>
  );
};

export default Header;
