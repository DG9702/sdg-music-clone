/* eslint-disable react-refresh/only-export-components */
import { FC, memo, useContext, useEffect, useMemo, useState } from "react";
import styles from "./SongList.module.scss";
import classNames from "classnames/bind";
import SongItem from "../SongItem";
import { MainLayoutContext } from "~/context/MainLayoutContext";
import { useInView } from "react-intersection-observer";
import { ClockIcon } from "~/assets/icons";
import { SongListProps } from "~/types/track";
import { AppContext } from "~/App";
import { fetchSidebarData } from "~/utils";
import { AuthContext } from "~/context/AuthContext";

const cx = classNames.bind(styles);

type libCategory = "playlist" | "album";

const SongList: FC<SongListProps> = ({
    songList,
    setData,
    playlist,
    pivotTop,
    isLoading = false,
    top,
    view,
    type = "default",
    albumId,
    albumImages,
    inclHeader = true,
    albumName,
    albumType,
    adjustOrder = 0,
}) => {
    const { width } = useContext(MainLayoutContext);
    const { isQueueShowed } = useContext(AppContext);
    const { userData } = useContext(AuthContext);

    const [category, setCategory] = useState<libCategory>("playlist");

    const [myPlaylists, setMyPlaylists]=useState<any>();
    
    useMemo(() => {
        const fetchData = async () => {
            const data = await fetchSidebarData({
                type: category,
                userId: userData?.id,
            });
            setMyPlaylists(data);
        };
        fetchData();
    }, [userData, setCategory]);

    const [renderNumb, setRenderNumb] = useState<number>(() => {
        if ((songList?.length ?? 0 < 9) && songList?.length)
            return songList.length;
        return 9;
    });

    const { ref, inView } = useInView({ threshold: 0 });

    const { ref: lazyRenderRef, inView: lazyRenderInView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (renderNumb === songList?.length) {
            return;
        }
        if (
            lazyRenderInView &&
            songList?.length &&
            renderNumb + 10 > songList?.length
        ) {
            setRenderNumb(songList.length);
        } else {
            setRenderNumb((prev) => prev + 10);
        }
    }, [lazyRenderInView]);

    return (
        <div className={cx("wrapper")}>
            {inclHeader && (
                <>
                    <div
                        ref={ref}
                        style={{
                            position: "absolute",
                            top: `-${pivotTop}px`,
                        }}
                    ></div>
                    {type !== "album" ? (
                        <div
                            style={{ top: `${top}px` }}
                            className={cx({
                                "freeze-top-row": true,
                                stuck: !inView,
                                "grid-md": width <= 780,
                                "is-compact": view === 'COMPACT',
                            })}
                        >
                            <>
                                {" "}
                                <div>#</div>
                                <div>Title</div>
                                {view === 'COMPACT' && <div>Artists</div>}
                                <div>Album</div>
                                {width > 780 && <div>Date added</div>}
                                <div className={cx("clock-icon")}>
                                    <ClockIcon />
                                </div>{" "}
                            </>
                        </div>
                    ) : (
                        <div
                            style={{ top: `${top}px` }}
                            className={cx({
                              "freeze-top-row": true,
                              stuck: !inView,
                              "grid-md": width <= 780,
                              "is-album-track": type === "album",
                              "is-compact": view === 'COMPACT',
                            })}
                        >
                            <>
                                <div>#</div>
                                <div>Title</div>
                                {view === true && <div>Artists</div>}
                                <div className={cx("clock-icon")}>
                                    <ClockIcon />
                                </div>
                            </>
                        </div>
                    )}
                </>
            )}
            <div
                style={{ paddingTop: isQueueShowed ? "0" : "16px" }}
                className={cx("songs")}
            >
                {(() => {
                    let order = 1;
                    if (!isLoading) {
                        return (
                            <>
                                {songList
                                    ?.slice(0, renderNumb)
                                    ?.map((item: any, index: number) => (
                                        <SongItem
                                            view={view}
                                            myPlaylist={myPlaylists}
                                            playlist={playlist}
                                            setPlaylist={setData}
                                            AddBy={item?.added_by?.id}
                                            type={type || item?.track?.type}
                                            key={
                                                (item?.id || item?.track?.id) ??
                                                index
                                            }
                                            order={order++ + adjustOrder}
                                            thumb={
                                                item?.album?.images?.[
                                                    item?.album?.images
                                                        ?.length - 1
                                                ]?.url ||
                                                item?.track?.album?.images[
                                                    item?.track?.album?.images
                                                        ?.length - 1
                                                ]?.url ||
                                                item?.images?.[
                                                    item?.images?.length - 1
                                                ]?.url
                                            }
                                            songName={
                                                item?.name ?? item?.track?.name
                                            }
                                            artists={
                                                item?.artists ??
                                                item?.track?.artists
                                            }
                                            albumData={{
                                                name:
                                                    item?.album?.name ??
                                                    item?.track?.album?.name,
                                                id:
                                                    item?.track?.album?.id ??
                                                    item?.album?.id,
                                            }}
                                            dateAdd={item?.added_at}
                                            duration={
                                                item?.duration_ms ??
                                                item?.track?.duration_ms
                                            }
                                            isExplicit={
                                                item?.explicit ??
                                                item?.track?.explicit
                                            }
                                            isLoading={isLoading}
                                            id={item?.track?.id ?? item?.id}
                                            originalData={
                                                (type === "playlist" &&
                                                    item?.track) ||
                                                (type === "album" && {
                                                    ...item,
                                                    album: {
                                                        images: albumImages,
                                                        id: albumId,
                                                        album_type: albumType,
                                                        name: albumName,
                                                    },
                                                }) ||
                                                item
                                            }
                                        />
                                    ))}
                                <div ref={lazyRenderRef}></div>
                            </>
                        );
                    } else {
                        return Array(9)
                            ?.fill(0)
                            ?.map((item, index) => (
                                <SongItem
                                    view={view}
                                    isLoading={isLoading}
                                    key={item + index}
                                />
                            ));
                    }
                })()}
            </div>
        </div>
    );
};

export default memo(SongList);
