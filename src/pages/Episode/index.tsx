import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Episode.module.scss";
import { CurrentTrack, PlayerContext } from "~/context/PlayerContext";
import { Episode as EpisodeData } from "~/types/show";
import { useInView } from "react-intersection-observer";
import { usePalette } from "color-thief-react";
import { Link, useParams } from "react-router-dom";
import useEllipsisVertical from "~/hook/useEllipsisVertical";
import Header from "~/components/Header";
import HeadSection from "~/components/HeadSection";
import { dateFormatConvertor, documentTitle, durationConvertor } from "~/utils";
import PlayButton from "~/components/PlayButton";
import { SaveTrack, UserSavedTrack } from "~/assets/icons";
import Footer from "~/components/Footer";
import {toast} from "react-toastify";
import {checkUserSaveEpisode, episodeApi, removeEpisodeForCurrentUser, saveEpisodeForCurrentUser} from "~/services/episodeApi";

const cx = classNames.bind(styles);

const Episode: React.FC = () => {
  const {
    setQueue,
    setCurrentTrack,
    setCurrentTrackIndex,
    setPlayingType,
    calNextTrackIndex,
    setPlaying,
    currentTrack,
    queue,
    isPlaying,
    prevDocumentTitle,
    isBtnClickable
  } = useContext(PlayerContext);
  const [navOpacity, setNavOpacity] = useState<number>(0);
  const [data, setData] = useState<EpisodeData>();
  const [isLoading, setLoading]=useState<boolean>(true);
  const [isSaving, setSaving]=useState<boolean>(false);
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const { ref: pivotTrackingRef, inView: isTracking } = useInView(); //put above all

  useEffect(() => {
    if (isPlaying) {
      prevDocumentTitle.current = `${
        data?.name ? data?.name : " | Podcast on Spotify"
      } - ${data?.show?.name} podcast`;
    } else {
      documentTitle(
        `${data?.name ? data?.name : " | Podcast on Spotify"} 
            - ${data?.show?.name} podcast`,
      );
    }
  }, [isPlaying, data]);
  const { data: dataColor } = usePalette(
    data?.images?.[0]?.url as string,
    10,
    "hex",
    {
      crossOrigin: "Anonymous",
      quality: 100,
    },
  );

  const bgColor = dataColor?.[0] ?? "#121212";

  const { id } = useParams();

  const headerRef = useRef<any>();
  const descRef = useRef<any>();

  const isEllipsisActive = useEllipsisVertical(descRef.current);

  useEffect(() => {
    const fetchData = async () => {
      const data = await episodeApi({ id });
      setData({
        preview_url: data?.audio_preview_url,
        ...data
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(Boolean(!data));
  }, [data]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const yAxis = e.currentTarget.scrollTop;
    if (yAxis > 64) {
      setNavOpacity(1);
    } else setNavOpacity(yAxis / 64);
  };

  const handleClickPlayBtn = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (currentTrack?.id === data?.id) return;
    setQueue([{ ...(data as CurrentTrack) }]);
    setCurrentTrack({ ...data });
    setCurrentTrackIndex(0);
    setPlayingType("show");
    calNextTrackIndex();
  };

  useEffect(() => {
    if (data?.id) {
      const fetchData = async () => {
        const result = await checkUserSaveEpisode({ids: `${data?.id}`});
        console.log("Check result: ", result);
        
        if (result.data[0] === true) {
          setSaving(true);
        } else {
          setSaving(false)
        }
      }
      fetchData();
    } else {
      //
    }
  }, [isSaving, setSaving, data?.id])

  const addTrackRequest = async () => {
    const result = await saveEpisodeForCurrentUser(`${data?.id}`);
    return result;
  }

  const removeTrackRequest = async () => {
    const result = await removeEpisodeForCurrentUser(`${data?.id}`);
    return result;
  }

  const handleSaveEpisode = async () => {
    if (isSaving) {
      await removeTrackRequest();
      setSaving(false)
      toast('🦄 Remove from liked Song');
    } else {
      await addTrackRequest();
      setSaving(true);
      toast('🦄 Added to liked Song');
    }
  };

  console.log("Check data in episode: ", data);
  

  console.log("Check queue: ", queue);
  

  return (
    <main className={cx("episode-wrapper")}>
      <Header bgColor={bgColor} navOpacity={navOpacity} />
      <div
        className={cx("body")}
        onScroll={(e) => isTracking && handleScroll(e)}
      >
        <div
          ref={pivotTrackingRef}
          className={cx("pivot-tracking")}
          style={{ top: `${100}px` }}
        ></div>
        <div ref={headerRef}>
          <HeadSection
            type="episode"
            headerType="show"
            title={data?.name}
            thumbnail={data?.images?.[0]?.url}
            bgColor={bgColor}
            showName={data?.show?.name}
            showId={data?.show?.id}
            isLoading={isLoading}
          />
        </div>
        <div className={cx("main")}>
          <div
            style={{ backgroundColor: bgColor }}
            className={cx("bg-blur")}
          ></div>
          <div className={cx("action-bar")}>
            <div className={cx("top")}>
              <span>{dateFormatConvertor(data?.release_date)}</span>
              <div className={cx("dot")}></div>
              <span ref={descRef}>
                {durationConvertor({
                  milliseconds: data?.duration_ms,
                  type: "short",
                })}
              </span>
            </div>
            <div className={cx("bottom")}>
              <div onClick={handleClickPlayBtn} className={cx("play-btn")}>
                <PlayButton
                  size={56}
                  scaleHovering={1.04}
                  transitionDuration={33}
                  isPlay={isPlaying}
                  setPlaying={setPlaying}
                />
              </div>
              <div className={cx("plus-btn", { active: isSaving })} onClick={() => isBtnClickable && handleSaveEpisode()}>
                {isSaving ? <UserSavedTrack /> : <SaveTrack />}
              </div>
            </div>
          </div>
          <div className={cx("content")}>
            <h2 className={cx("title")}>Episode Description</h2>
            <div className={cx({ desc: true, expanded: !isExpanded })}>
              <span
                dangerouslySetInnerHTML={{
                  __html: data?.html_description as string,
                }}
              ></span>
            </div>
            {isEllipsisActive && (
              <div className={cx("expand-btn")}>
                <button onClick={() => setExpanded((prev) => !prev)}>
                  {isExpanded ? "Show less" : "... Show more"}
                </button>
              </div>
            )}
          </div>
          <Link to={`/show/${data?.show?.id}`}>
            <div className={cx("see-all-btn")}>
              <button>See all episode</button>
            </div>
          </Link>
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default Episode;
