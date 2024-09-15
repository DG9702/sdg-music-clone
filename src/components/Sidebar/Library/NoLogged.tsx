import React from 'react'
import {Link} from 'react-router-dom'
import classNames from 'classnames/bind';
import styles from "../Sidebar.module.scss";
import {EarthIcon} from '~/assets/icons';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

const NoLogged: React.FC = () => {
  return (
            <div className={cx("left-sidebar-bottom")}>
          <div className={cx("left-sidebar-link")}>
            <div className={cx("BottomLinksList")}>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>Legal</span>
                </Link>
              </div>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>Privacy Center</span>
                </Link>
              </div>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>Privacy Policy</span>
                </Link>
              </div>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>Cookies</span>
                </Link>
              </div>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>About Ads</span>
                </Link>
              </div>
              <div className={cx("BottomLink-item")}>
                <Link className={cx("item-title")} to={"/"}>
                  <span>Accessibility</span>
                </Link>
              </div>
            </div>
            <Link className={cx("Cookie-link")} to={"/"}>
              <span>Cookies</span>
            </Link>
          </div>
          <div className={cx("language")}>
            <Button type="default" leftIcon={<EarthIcon />} small>
              English
            </Button>
          </div>
        </div>
  )
}

export default NoLogged