import classNames from "classnames/bind"
import {FC, useContext} from "react"
import styles from "./NextSong.module.scss"
import {SpotifyTrack} from "~/types/track"
import {PlayerContext} from "~/context/PlayerContext"
import {Link} from "react-router-dom"
import {SingleMusicNote} from "~/assets/icons"
import ImageLazy from "~/components/Image"
import {SubTitleArtists} from "~/components/SubTitle"

const cx = classNames.bind(styles)

interface NextSongProps {
  nextSong: SpotifyTrack
}
const NextSong: FC<NextSongProps> = ({ nextSong }) => {
  const {
    setQueue,
    setCurrentTrack,
    setCurrentTrackIndex,
    calNextTrackIndex,
    setPlayingType,
  } = useContext(PlayerContext)

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setCurrentTrack({ ...nextSong })
    setQueue([{ ...nextSong }])
    setCurrentTrackIndex(0)
    calNextTrackIndex()
    setPlayingType('track')
  }
  return (
    <div className={cx('next-song-wrapper')}>
      <div className={cx('header')}>
        <span className={cx('title')}>Next in queue</span>
        <Link to={`/queue`}>
          <div className={cx('open-queue-btn')}>
            <button>Open queue</button>
          </div>
        </Link>
      </div>
      <div className={cx('body')}>
        <div onClick={(e) => handleClick(e)} className={cx('next-song')}>
          <div className={cx('icon')}>
            <SingleMusicNote size={16} />
          </div>
          <div className={cx('thumb')}>
            <ImageLazy src={nextSong?.album?.images?.[0]?.url} alt={nextSong?.name} />
          </div>
          <div className={cx('content')}>
            <Link to={`/album/${nextSong?.album?.id}`}>
              <span className={cx('name-track')}>{nextSong?.name}</span>
            </Link>
            <span className={cx('artists')}>
              <SubTitleArtists data={nextSong?.artists} fontSize={14} type="artist" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NextSong
