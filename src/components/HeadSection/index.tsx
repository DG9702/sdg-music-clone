import React, {useContext} from "react";
import classNames from "classnames/bind";
import Skeleton from "react-loading-skeleton";

import logoImage from "~/assets/images/logo/logo.svg";

import styles from "./HeadSection.module.scss";
import { HeaderProps } from "~/types/others";
import ImageLazy from "../Image";
import ThumbDefault from "../ThumbDefault";
import { Link } from "react-router-dom";
import transformDomain from "~/utils/transformDomain";
import {SubTitleArtists, SubTitleOwner} from "../SubTitle";
import {AuthContext} from "~/context/AuthContext";
import {AppContext} from "~/App";

const cx = classNames.bind(styles);

const HeadSection: React.FC<HeaderProps> = ({
  title,
  thumbnail,
  iconHead,
  quantity,
  bgColor,
  desc,
  isLoading,
  type,
  artists,
  owner,
  releaseDate,
  isWhiteColor = false,
  headerType,
  publisher,
  showName,
  showId,
}) => {  
  const {userData}=useContext(AuthContext);
  const { setModalEditPlaylist }=useContext(AppContext);

  const isMine=userData?.id===owner?.id;
  
  const handleOpenModal=() => {
    setModalEditPlaylist(true);
  }

  return (
    <main style={{ backgroundColor: `${bgColor}` }} className={cx("wrapper")}>
      {headerType !== "genre" ? (
        <div className={cx({ body: true, show: headerType === "show" })}>
          {type === "album" || type === "episode" ? (
            <div className={cx("img-album")}>
              {!isLoading ? (
                thumbnail ?
                  (
                    <ImageLazy src={thumbnail} alt={title} />
                  ) :
                  iconHead ? (
                    <div className="episodes-icon">{iconHead}</div>
                  ) : (
                    <ThumbDefault />
                  )
              ) : (
                <Skeleton height={"100%"} />
              )}
            </div>
          ) : (
            <div
              className={cx("img",
                {
                  "pointer": isMine===true,
                  "border-radius": type === "user"
                }
              )}
                onClick={() => isMine&&handleOpenModal()}>
              {!isLoading ? (
                thumbnail ?
                  (
                    <ImageLazy src={thumbnail} alt={title} />
                  ) :
                  iconHead ? (
                    <div className={cx("episodes-icon")}>{iconHead}</div>
                  ) : (
                    <ThumbDefault />
                  )
              ) : (
                <Skeleton height={"100%"} />
              )}
            </div>
            
          )}

          <div className={cx("content")}>
            {!isLoading ? (
              <>
                {" "}
                <p className={cx("type")}>
                  {(type === "album" && "Album") ||
                    (type === "single" && "Single") ||
                    (type === "compilation" && "Compilation") ||
                    (type === "podcast" && "Podcast") ||
                    (type === "episode" && "Podcast Episode") ||
                    type}
                </p>
                <h2 title={title} className={cx("title", { "pointer": isMine === true })} onClick={() => isMine && handleOpenModal()}>
                  {title}
                </h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: desc ? transformDomain(desc) : "",
                  }}
                  className={cx("desc", {"pointer": isMine===true})}
                  onClick={() => isMine && handleOpenModal()}
                >
                </div>
                {headerType === "show" ? (
                  <Link to={type === "episode" ? `/show/${showId}` : ""}>
                    <div
                      className={cx({
                        publisher: true,
                        underline: type === "episode",
                      })}
                    >
                      <span>{publisher || showName}</span>
                    </div>
                  </Link>
                ) : (
                  <div className={cx("quantity")}>
                    <div
                      style={{  backgroundImage: `url(${ owner?.image ? owner?.image : logoImage})` }}
                      className={cx("logo", {
                        "is-owner-image": owner?.image,
                      })}
                    ></div>
                    {(type === "album" ||
                      type === "single" ||
                      type === "compilation") ? (
                      <>
                        <div className={cx("artist")}>
                          {
                            <SubTitleArtists
                              isWhiteColor={isWhiteColor}
                              data={artists}
                            />
                          }
                        </div>{" "}
                        <div className={cx("dot")}></div>{" "}
                        <div className={cx("release-date")}>
                          {releaseDate?.slice(0, 4)}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={cx("artist")}>
                          {
                            <SubTitleOwner
                              isWhiteColor={isWhiteColor}
                              data={owner}
                            />
                          }
                        </div>{" "}
                      </>
                    )}
                    <div className={cx("dot")}></div>
                    <div className={"text"}>{`${quantity || 0} ${type === 'user' ? 'following' : 'song'}`}</div>
                  </div>
                )}
              </>
            ) : (
              <div style={{}} className={cx("skeleton")}>
                <Skeleton height={"20px"} width={"70px"} borderRadius={50} />
                <Skeleton height={"50px"} width={"90%"} borderRadius={50} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={cx("category-header")}>
          {!isLoading ? (
            <h2 className={cx({ title: true, "category-title": true })}>
              {title}
            </h2>
          ) : (
            <div style={{ marginBottom: "30px" }}>
              <Skeleton width={500} height={60} borderRadius={500} />
            </div>
          )}
        </div>
      )}
      <div
        style={{ backgroundColor: `${bgColor}` }}
        className={cx("bg-blur")}
      ></div>
    </main>
  );
};

export default HeadSection
