/* eslint-disable react-hooks/exhaustive-deps */
import { getTrackRecommendation } from '~/services/trackApi'
import { ArtistData } from '~/types/artist'
import { ImageSource } from '~/types/others'
import { Episode } from '~/types/show'
import { SpotifyTrack } from '~/types/track'
import { FC, ReactNode, createContext, useEffect, useMemo, useRef, useState } from 'react'
import {getAudioLink} from '~/services/getAudioLink'

interface PlayBarData {
  trackId?: string
  trackName?: string
  thumb?: string
  artists?: ArtistData[]
  albumId?: string
  albumName?: string
  episode?: string
  show?: (
    | {
        id?: string
        images?: ImageSource[]
        name?: string
        publisher?: string
      }
    | undefined
  )[]
}

interface PlayerProviderProps {
  children: ReactNode
}

interface ReturnData {
  duration?: number
  playBarData?: PlayBarData
}

interface isSavedTrack {
  isSaving: boolean
  ids: any
}

export interface CurrentTrack extends SpotifyTrack, Episode {}

interface PlayerContext extends ReturnData {
  setCurrentTrack: React.Dispatch<React.SetStateAction<CurrentTrack | undefined>>
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>
  setQueue: React.Dispatch<React.SetStateAction<CurrentTrack[]>>
  setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number>>
  setReady: React.Dispatch<React.SetStateAction<boolean>>
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
  setUserClicked: React.Dispatch<React.SetStateAction<boolean>>
  setNextTrackIndex: React.Dispatch<React.SetStateAction<number>>
  setRepeat: React.Dispatch<React.SetStateAction<boolean>>
  setShuffle: React.Dispatch<React.SetStateAction<boolean>>
  setPlayingType: React.Dispatch<React.SetStateAction<'track'|'show'>>
  setSaving: any
  //setDurationAudio: any
  handlePlay: () => void
  handlePause: () => void
  handleForward: () => void
  handleBack: () => void
  calNextTrackIndex: () => void
  audioData: React.MutableRefObject<any>
  audioRef: React.MutableRefObject<any>
  durationAudio: number
  prevDocumentTitle: React.MutableRefObject<string>
  isPlaying: boolean
  intervalIdRef: any
  currentTrack?: CurrentTrack
  queue: SpotifyTrack[]
  fakeCurrentIndex?: number
  currentTrackIndex: number
  isReady: boolean
  userClicked: boolean
  nextTrackIndex: number
  isRepeat: boolean
  isShuffle: boolean
  isBtnClickable: boolean
  isSaving: any
  playingType: 'track' | 'show'
}

export const PlayerContext = createContext({} as PlayerContext)

export const PlayerProvider: FC<PlayerProviderProps> = ({ children }) => {
  const [audioData, setAudioData] = useState<any>()
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)
  const [nextTrackIndex, setNextTrackIndex] = useState<number>(1)
  const [playingType, setPlayingType]=useState<'track'|'show'>('track')
  const [isSaving, setSaving] = useState<isSavedTrack[]>()

  // ----------Control-----------------
  const [currentTime, setCurrentTime] = useState<number>(0) //s
  const [isPlaying, setPlaying] = useState<boolean>(false)
  const [isReady, setReady] = useState<boolean>(false)
  const [userClicked, setUserClicked] = useState<boolean>(false) //detect the user clicked or yet
  const [isRepeat, setRepeat] = useState<boolean>(false)
  const [isShuffle, setShuffle] = useState<boolean>(false)
  const [isBtnClickable, setBtnClickable]=useState<boolean>(false)
  //const [durationAudio, setDurationAudio] = useState<number>(30)

  // ---------------Queue list----------------
  const [queue, setQueue] = useState<CurrentTrack[]>([])
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | undefined>()

  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem('spotify_current_track', JSON.stringify(currentTrack))
    }
    if (currentTrackIndex >= queue?.length - 1 && currentTrack) {
      if (playingType === 'track') {
        const getRecommendation = async () => {
          const data = await getTrackRecommendation({
            seed_artists: currentTrack?.artists?.[0]?.id as string,
            seed_tracks: currentTrack?.id,
            limit: 19,
          })
          setQueue((prev) => [...prev, ...data])
        }
        getRecommendation()
      } else if (queue?.length >= 2) {
        setCurrentTrackIndex(0)
        setCurrentTrack({ ...queue[0] })
        calNextTrackIndex()
      }
    }
  }, [currentTrack])

  // -----------------------------------------------

  const intervalIdRef = useRef<number>()

  // const audioRef = useRef<HTMLAudioElement>(new Audio())
  const audioRef=useRef<any>()

  let durationAudio=29.753469;

  useEffect(() => {
    //if (playingType === 'show') setAudioData(queue[currentTrackIndex]?.audio_preview_url) 
    setAudioData(queue[currentTrackIndex]?.preview_url);
  })

  useEffect(() => {
    if(audioRef?.current) {
      durationAudio = audioRef?.current?.duration
    }
  }, [durationAudio])


  const prevDocumentTitle = useRef<string>('')

  // set default state from localStorage
  useEffect(() => {
    audioRef.current.volume = localStorage.getItem('spotify_volume')
      ? JSON.parse(localStorage.getItem('spotify_volume') as string)
      : 1
    const initTrack =
      JSON.parse(localStorage.getItem('spotify_current_track') as string) || undefined
    const initPlayingType =
      JSON.parse(localStorage.getItem('spotify_playing_type') as 'track' | 'show') ??
      'track'
    const isShuffle =
      JSON.parse(localStorage.getItem('spotify_is_shuffle') as string) ?? false
    const isRepeat =
      JSON.parse(localStorage.getItem('spotify_is_repeat') as string) ?? false

    setPlayingType(initPlayingType)
    setCurrentTrack(initTrack && { ...initTrack })
    setQueue(initTrack ? [{ ...initTrack }] : [])
    setBtnClickable(Boolean(initTrack))
    setShuffle(isShuffle)
    setRepeat(isRepeat)
  }, [])    

  if(audioRef?.current) {
    audioRef.current.onloadeddata = () => {
      audioRef.current.muted = false
      setBtnClickable(true)
      if (userClicked) {
        setReady(true)
        setPlaying(true)
      }
    }
  }


  useMemo(() => {
    if (audioData) {
      audioRef.current.src = audioData
      audioRef.current.load()
      setBtnClickable(false)
    }
  }, [audioData])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime
    }
  }, [currentTime])

  useEffect(() => {
    //audioRef.current.pause();
    audioRef.current.src = queue[currentTrackIndex]?.preview_url;
      handlePlay();
      setPlaying(true)
  }, [audioRef, currentTrackIndex]);

  useEffect(() => {
    calNextTrackIndex()
  }, [currentTrack, isShuffle])

  useEffect(() => {
    localStorage.setItem('spotify_playing_type', JSON.stringify(playingType))
  }, [playingType])

  useEffect(() => {
    if (isBtnClickable) return
    if (localStorage.getItem('spotify_current_track') !== null) setBtnClickable(true)
  }, [queue])

  useEffect(() => {
    if (currentTrack && userClicked) {
      if (isPlaying) {
        prevDocumentTitle.current = window.document.title
        window.document.title = `${currentTrack?.name} • ${currentTrack?.artists?.[0]?.name}`
      } else {
        window.document.title = prevDocumentTitle.current
      }
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    localStorage.setItem('spotify_is_shuffle', JSON.stringify(isShuffle))
  }, [isShuffle])

  useEffect(() => {
    localStorage.setItem('spotify_is_repeat', JSON.stringify(isRepeat))
  }, [isRepeat])

  // -----------------------------------------  

  const handlePlay = () => {
    if (audioRef.current?.paused) {
      audioRef?.current?.play()
      setPlaying(true)
    }
  }

  const handlePause = () => {
    // if (!audioRef.current?.paused) {
      audioRef.current.pause()
      setPlaying(false)
    // }
  }

  const handleBack = () => {
    handlePause()
    if (currentTrackIndex > 0) {
      setCurrentTrack({ ...queue[currentTrackIndex - 1] })
      setCurrentTrackIndex(currentTrackIndex - 1)
    }
    setCurrentTime(0)
  }

  const handleForward = () => {
    if (currentTrackIndex < queue.length - 1) {
      //handlePause()
      setCurrentTrack({ ...queue[nextTrackIndex] })
      setCurrentTrackIndex(nextTrackIndex)
      calNextTrackIndex()
      setCurrentTime(0)
    }
  }

  const calNextTrackIndex = () => {
    if (isShuffle) {
      let randomIndex = currentTrackIndex
      while (randomIndex === currentTrackIndex) {
        randomIndex = Math.floor(Math.random() * queue?.length)
      }
      setNextTrackIndex(randomIndex)
    } else {
      setNextTrackIndex(currentTrackIndex + 1)
    }
  }

  const returnData = useMemo(() => {
    return {
      duration: audioRef?.current?.duration,
      playBarData: {
        trackId: currentTrack?.id,
        trackName: currentTrack?.name,
        thumb:
          playingType === 'track'
            ? currentTrack?.album?.images?.[currentTrack?.album?.images?.length - 1]?.url
            : currentTrack?.images?.[currentTrack?.images?.length - 1]?.url,
        albumId: currentTrack?.album?.id,
        albumName: currentTrack?.album?.name,
        artists: currentTrack?.artists,
        episode: currentTrack?.id,
        show: [currentTrack?.show],
      },
      
    }
  }, [currentTrack, audioData])  

  console.log("Check audioRef: ", audioRef, audioData);

  
  return (
    <PlayerContext.Provider
      value={{
        handlePlay,
        handlePause,
        setCurrentTime,
        setCurrentTrack,
        setQueue,
        setCurrentTrackIndex,
        handleForward,
        handleBack,
        setPlaying,
        setReady,
        setUserClicked,
        setNextTrackIndex,
        setRepeat,
        setShuffle,
        calNextTrackIndex,
        setPlayingType,
        setSaving,
        //setDurationAudio,
        audioData,
        audioRef,
        isPlaying,
        intervalIdRef,
        currentTrack,
        queue,
        currentTrackIndex,
        isReady,
        userClicked,
        nextTrackIndex,
        isRepeat,
        isShuffle,
        isSaving,
        isBtnClickable,
        prevDocumentTitle,
        playingType,
        durationAudio,
        ...returnData,
      }}
    >
      {children}
      <audio ref={audioRef} src="" muted></audio>
    </PlayerContext.Provider>
  )
}
