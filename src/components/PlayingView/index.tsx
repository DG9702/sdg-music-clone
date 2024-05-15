import {FC, useContext, useEffect} from "react"
import {Link} from "react-router-dom"
import classNames from "classnames/bind"
import Marquee from "react-fast-marquee"
import styles from "./PlayingView.module.scss"
import {PlayerContext} from "~/context/PlayerContext"
import {ArtistContext} from "~/context/ArtistContext"
import {AppContext} from "~/App"
import {CloseIcon, HeartIcon, MusicNote} from "~/assets/icons"
import ImageLazy from "../Image"
import SubTitleArtists from "../SubTitle"
import AboutArtist from "../AboutArtist"
import NextSong from "./NextSong"

const cx = classNames.bind(styles)

const PlayingView: FC = () => {
  const { currentTrack, queue, nextTrackIndex } = useContext(PlayerContext)
  const { setId, isLoading, profile, stats, aboutImg, avatarImg } =
    useContext(ArtistContext)
  const { setPlayingViewShowed } = useContext(AppContext)

  useEffect(() => {
    setId(currentTrack?.artists?.[0]?.id)
  }, [currentTrack])

  return (
    <div className={cx('playing-view-wrapper')}>
      <div>
        <div className={cx('header')}>
          <div className={cx('close-btn')}>
            <button onClick={() => setPlayingViewShowed(false)}>
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className={cx('track-banner')}>
          <div>
            {currentTrack?.album?.images?.[0]?.url ? (
              <ImageLazy
                src={currentTrack?.album?.images?.[0]?.url}
                alt={currentTrack?.name}
              />
            ) : (
              <div className={cx('default-banner')}>
                <MusicNote size={114} />
              </div>
            )}
          </div>
        </div>
        <div className={cx('content')}>
          <div className={cx('title')}>
            <Link to={`/album/${currentTrack?.album?.id}`}>
              <Marquee pauseOnHover={true} speed={25}>
                <h2 className={cx('name-track')}>{currentTrack?.name}</h2>
              </Marquee>
            </Link>
            <span className={cx('artist')}>
              <Marquee pauseOnHover={true} speed={35}>
                <SubTitleArtists data={currentTrack?.artists} fontSize={16} type="artist" />
              </Marquee>
            </span>
          </div>
          <div className={cx('heart-btn')}>
            <HeartIcon size={16} />
          </div>
        </div>
        <div className={cx('about-artist')}>
          <div>
            <AboutArtist
              type="playing-view"
              profile={profile}
              stats={stats}
              aboutImg={aboutImg ?? avatarImg}
              inclHeader={false}
              isLoading={isLoading}
            />
          </div>
        </div>
        <div className={cx('next-song')}>
          <NextSong nextSong={queue[nextTrackIndex]} />
        </div>
      </div>
    </div>
  )
}

export default PlayingView
