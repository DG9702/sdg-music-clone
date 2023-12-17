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
  const { bgColor, navOpacity = 1, type = "default", title = "" } = props;

  const { key } = useLocation();
  const navigate = useNavigate();
  const queryRef = useRef<any>(null);

  useEffect(() => {
    if (type === "search") {
      queryRef?.current.focus();
    }
  }, []);

  return (
    <header className={cx("header")}>
      <div
        style={{
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
        <button className={cx("btn-title")}>Premium</button>
        <button className={cx("btn-title")}>Support</button>
        <button className={cx("btn-title")}>Download</button>
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
          <button className={cx("btn-login")}>
            <span>Log in</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
