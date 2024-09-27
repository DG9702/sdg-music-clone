import React, {FC, useContext, useEffect, useMemo, useRef, useState} from "react"
import classNames from "classnames/bind"
import styles from "./EpisodeSave.module.scss"
import {PlayerContext} from "~/context/PlayerContext"
import {UserSaveEpisodesData} from "~/types/show"
import {useNavigate} from "react-router-dom"
import {usePalette} from "color-thief-react"
import {MainLayoutContext} from "~/context/MainLayoutContext"
import {useInView} from "react-intersection-observer"
import {documentTitle} from "~/utils"
import Header from "~/components/Header"
import HeadSection from "~/components/HeadSection"
import Footer from "~/components/Footer"
import {getUserEpisodeSaveApi} from "~/services/showApi"
import ShowItem from "~/components/ShowItem"
import {EpisodesIcon} from "~/assets/icons"
import PlayButton from "~/components/PlayButton"

const cx = classNames.bind(styles)

const EpisodeSave: FC = () => {
  const {
    isPlaying,
    prevDocumentTitle,
    setCurrentTrack,
    setCurrentTrackIndex,
    setQueue,
    calNextTrackIndex,
    setPlayingType,
    handlePause,
    currentTrack, } = useContext(PlayerContext)
  const [navOpacity, setNavOpacity] = useState<number>(0)
  const [data, setData] = useState<UserSaveEpisodesData>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  
  const { data: dataColor } = usePalette(data?.images?.[0]?.url as string, 10, 'hex', {
    crossOrigin: 'Anonymous',
    quality: 100,
  })

  const bgColor = dataColor?.[0] ?? '#121212'

  const { width } = useContext(MainLayoutContext)
  const { ref: pivotTrackingRef, inView: isTracking } = useInView() //put above all

  useEffect(() => {
    if (isPlaying) {
      prevDocumentTitle.current = `${
        data?.name ? data?.name : ' | Podcast on Spotify'
      } | Spotify Podcast`
    } else {
      documentTitle(
        `${data?.name ? data?.name : ' | Podcast on Spotify'} | Spotify Podcast`
      )
    }
  }, [isPlaying, data])

  const headerRef = useRef<any>()

  useMemo(() => {
    const fetchData = async () => {
      const data = await getUserEpisodeSaveApi({
        market: "VN",
        limit: 20,
      });
      if (data?.error) {
        navigate('/not-found')
      } else {
        setData({ ...data })
      }
    }
    fetchData()
  }, [])

  

  useEffect(() => {
    setLoading(Boolean(!data))
  }, [data])

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const yAxis = e.currentTarget.scrollTop
    if (yAxis > 64) {
      setNavOpacity(1)
    } else setNavOpacity(yAxis / 64)
  }

  const [renderNumb, setRenderNumb] = useState<number>(() => {
    if ((data?.items?.length ?? 0 < 9) && data?.items?.length) {
      return data?.items?.length
    }
    return 9
  })

  const { ref, inView } = useInView({ threshold: 0 })

  useEffect(() => {
    if (renderNumb === data?.items?.length) {
      return
    }
    if (inView && data?.items?.length && renderNumb + 10 > data?.items?.length) {
      setRenderNumb(data?.items.length)
    } else {
      setRenderNumb((prev) => prev + 10)
    }
  }, [inView])

  const handleClickPlayBtn = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
     e.stopPropagation();
    if (isPlayBtn && isCurrent) {
      handlePause();
    } else if (!isCurrent) {
      const queueList =
        data?.items?.map((item: any) => 
          item.episode
        )||[];
      
      setQueue(queueList);      
      setCurrentTrack({ ...queueList?.[0] });
      setCurrentTrackIndex(0);
      calNextTrackIndex();
      setPlayingType("show");
    }
  }; 

    const isCurrent = useMemo(() => {
      return !!data?.items?.some((item: any) => item?.episode?.id === currentTrack?.id);
  }, [data, currentTrack]);
  
  const isPlayBtn=isCurrent&&isPlaying;  
  

  return (
    <main className={cx({ 'show-wrapper': true, 'col-layout': width <= 1100 })}>
      <Header
        navOpacity={navOpacity}
        bgColor={bgColor}
        title="Your Episodes"
        inclPlayBtn />
      <div className={cx('body')} onScroll={(e) => isTracking && handleScroll(e)}>
        <div
          ref={pivotTrackingRef}
          className={cx('pivot-tracking')}
          style={{ top: `${100}px` }}
        ></div>
        <div ref={headerRef}>
          <HeadSection
            type="podcast"
            headerType="show"
            iconHead={<EpisodesIcon  />}
            title={"Your Episodes"}
            bgColor={bgColor}
            publisher={data?.publisher}
            isLoading={isLoading}
          />
        </div>
        <div className={cx('main')}>
          <div style={{ backgroundColor: bgColor }} className={cx('bg-blur')}></div>
          <div className={cx('action-bar')}>
            <div className={cx("action-left")} onClick={handleClickPlayBtn}>
                <PlayButton
                  size={56}
                  fontSize={24}
                  scaleHovering={1.05}
                  transitionDuration={33}
                  isPlay={isPlayBtn}
                />
              </div>
          </div>
          <div className={cx('content')}>
            <div className={cx('episodes-list')}>
                <>
                  {data?.items?.slice(0, renderNumb)?.map((item) => (
                    <ShowItem
                      isLoading={isLoading}
                      key={item?.episode?.id}
                      item={item?.episode}
                    />
                  ))}
                  <div ref={ref} style={{ marginTop: '-60px' }}></div>
                </>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  )
}

export default EpisodeSave
