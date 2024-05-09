import React from "react";
import classNames from "classnames/bind";
import Skeleton from "react-loading-skeleton";

import logoImage from "~/assets/images/logo/logo.svg";

import styles from "./HeadSection.module.scss";
import { HeaderProps } from "~/types/others";
import ImageLazy from "../Image";
import ThumbDefault from "../ThumbDefault";
import { Link } from "react-router-dom";
import SubTitleArtists from "../SubTitle";
import transformDomain from "~/utils/transformDomain";

const cx = classNames.bind(styles);

const HeadSection: React.FC<HeaderProps> = ({
  title,
  thumbnail,
  quantity,
  bgColor,
  desc,
  isLoading,
  type,
  artists,
  releaseDate,
  isWhiteColor = false,
  headerType,
  publisher,
  showName,
  showId,
}) => {
  console.log("Header type: ", headerType);
  

  return (
    <main style={{ backgroundColor: `${bgColor}` }} className={cx("wrapper")}>
      {headerType !== "genre" ? (
        <div className={cx({ body: true, show: headerType === "show" })}>
          {type !== "album" ? (
            <div className={cx("img")}>
              {!isLoading ? (
                thumbnail ? (
                  <ImageLazy src={thumbnail} alt={title} />
                ) : (
                  <ThumbDefault />
                )
              ) : (
                <Skeleton height={"100%"} />
              )}
            </div>
          ) : (
            <div className={cx("img-album")}>
              {!isLoading ? (
                thumbnail ? (
                  <ImageLazy src={thumbnail} alt={title} />
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
                <h2 title={title} className={cx("title")}>
                  {title}
                </h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: desc ? transformDomain(desc) : "",
                  }}
                  className={cx("desc")}
                >
                  {/* <ArtistList data={htmlCleaner(stringCleaner(desc))} /> */}
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
                      style={{ backgroundImage: `url(${logoImage})` }}
                      className={cx("logo")}
                    ></div>
                    {(type === "album" ||
                      type === "single" ||
                      type === "compilation") && (
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
                    )}
                    <div className={cx("dot")}></div>
                    <div className={"text"}>{`${quantity || 0} songs`}</div>
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
