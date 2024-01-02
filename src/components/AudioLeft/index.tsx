import React from "react";
import classNames from "classnames/bind";
import styles from "./AudioLeft.module.scss";
import { ArrowTop, HeartIcon } from "~/assets/icons";
import ImageLazy from "../Image";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const AudioLeft: React.FC = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("avatar")}>
        <Link
          to={
            "https://open.spotify.com/album/5NODJ4FZWvaLLiFd554kLI?uid=d3790a907a97d86a669c&uri=spotify%3Atrack%3A2nFXaYb2fWOoUJXMPb6y4C"
          }
          className={cx("avatar-link")}
        >
          <ImageLazy
            src={
              "https://i.scdn.co/image/ab67616d000048510ecdf596e76b0403506c1375"
            }
            alt="danh-doi"
          />
        </Link>
        <button className={cx("arrow-top")}>
          <ArrowTop />
        </button>
      </div>
      <div className={cx("textSong")}>
        <div className={cx("textSong-item")}>
          <div className={cx("textSong-body")}>
            <div className={cx("textSong-pivot")}>
              <span>
                <Link
                  to={
                    "https://open.spotify.com/album/5NODJ4FZWvaLLiFd554kLI?uid=d3790a907a97d86a669c&uri=spotify%3Atrack%3A2nFXaYb2fWOoUJXMPb6y4C"
                  }
                  style={{ color: "#fff" }}
                >
                  Đầu Đường Xó Chợ (ft. Lăng LD)
                </Link>
              </span>
            </div>
          </div>
        </div>
        <div className={cx("textSong-item")}>
          <div className={cx("textSong-body")}>
            <div className={cx("textSong-pivot", "textSong-artist")}>
              <span>
                <Link
                  to={"https://open.spotify.com/artist/0ZbgKh0FgPYeFP38nVaEGp"}
                >
                  Obito
                </Link>
              </span>
              <>, </>
              <span>
                <Link
                  to={"https://open.spotify.com/artist/0EOMdQwzUG6CKh9oWvcANr"}
                >
                  Lăng LD
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <button className={cx("btn-audio-icon")}>
        <span>
          <HeartIcon />
        </span>
      </button>
    </div>
  );
};

export default AudioLeft;
