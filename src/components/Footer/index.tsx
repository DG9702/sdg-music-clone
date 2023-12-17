import { socialNetworkLinks, topLinkGroups } from "~/constants";
import classNames from "classnames/bind";
import { FC, memo } from "react";
import styles from "./Footer.module.scss";

const cx = classNames.bind(styles);

const Footer: FC = () => {
  return (
    <footer className={cx("footer")}>
      <nav className={cx("footer-container")}>
        <div className={cx("footer__top")}>
          <div className={cx("footer__top-left")}>
            {topLinkGroups.map((links, index) => (
              <div key={index} className={cx("linkGroup")}>
                <h3 className={cx("linkGroup-title")}>{links.title}</h3>
                <div className={cx("linkGroup-list")}>
                  {links.links.map((item, index) => (
                    <a target="_blank" key={index}>
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={cx("footer__top-right")}>
            {socialNetworkLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.title} target="_blank">
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
        <hr className={cx("horizontalRule")} />
        <div className={cx("footer__bottom")}>
          <div className={cx("footer__bottom-copyright")}>
            <p>© 2023 Spotify AB</p>
          </div>
        </div>
      </nav>
    </footer>
  );
};

export default memo(Footer);
