import React, {FC, useContext, useEffect, useRef, useState} from "react"
import classNames from "classnames/bind"
import styles from "./Show.module.scss"
import {PlayerContext} from "~/context/PlayerContext"
import {ShowData} from "~/types/show"
import {useNavigate, useParams} from "react-router-dom"
import {usePalette} from "color-thief-react"
import {MainLayoutContext} from "~/context/MainLayoutContext"
import {useInView} from "react-intersection-observer"
import {documentTitle} from "~/utils"
import showApi from "~/services/showApi"
import Header from "~/components/Header"
import HeadSection from "~/components/HeadSection"
import Footer from "~/components/Footer"
import AboutShow from "~/components/AboutShow"
import ShowsList from "~/components/ShowsList"

const cx = classNames.bind(styles)

const Show: FC = () => {
  const { isPlaying, prevDocumentTitle } = useContext(PlayerContext)
  const [navOpacity, setNavOpacity] = useState<number>(0)
  const [data, setData] = useState<ShowData>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  
  const { data: dataColor } = usePalette(data?.images?.[0]?.url as string, 10, 'hex', {
    crossOrigin: 'Anonymous',
    quality: 100,
  })

  const bgColor = dataColor?.[0] ?? '#121212'

  const { id } = useParams()
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

  useEffect(() => {
    const fetchData = async () => {
      const data = await showApi({ id })
      if (data?.error) {
        navigate('/not-found')
      } else {
        setData({ ...data })
      }
    }
    if (id !== 'undefined') {
      fetchData()
    }
  }, [id])

  useEffect(() => {
    setLoading(Boolean(!data))
  }, [data])

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const yAxis = e.currentTarget.scrollTop
    if (yAxis > 64) {
      setNavOpacity(1)
    } else setNavOpacity(yAxis / 64)
  }

  return (
    <main className={cx({ 'show-wrapper': true, 'col-layout': width <= 1100 })}>
      <Header bgColor={bgColor} navOpacity={navOpacity} />
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
            title={data?.name}
            thumbnail={data?.images?.[0].url}
            bgColor={bgColor}
            publisher={data?.publisher}
            isLoading={isLoading}
          />
        </div>
        <div className={cx('main')}>
          <div style={{ backgroundColor: bgColor }} className={cx('bg-blur')}></div>
          <div className={cx('action-bar')}>
            <button className={cx('follow-btn')}>Follow</button>
          </div>
          <div className={cx('content')}>
            <div className={cx('about')}>
              <AboutShow isLoading={isLoading} htmlDesc={data?.html_description} />
            </div>
            <div className={cx('episodes-list')}>
              <ShowsList
                isLoading={isLoading}
                data={data?.episodes?.items}
                originalData={data}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  )
}

export default Show
