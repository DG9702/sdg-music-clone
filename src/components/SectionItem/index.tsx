import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./SectionItem.module.scss";
import ImageLazy from "../Image";
import { UserImgDefault } from "~/assets/icons";
import { SectionItemI } from "~/types/section";
import Skeleton from "react-loading-skeleton";
import PlayButton from "../PlayButton";
import dateFormatConvertor from "~/utils/dateFormatConvertor";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "~/context/PlayerContext";
import categoryApi from "~/services/categoryApi";
import { getArtistTopTrack } from "~/services/artistApi";
import {SubTitleArtists} from "../SubTitle";
import {episodeApi} from "~/services/episodeApi";
import {showApi} from "~/services/showApi";

const cx = classNames.bind(styles);

const SectionItem: React.FC<SectionItemI> = ({
  title,
  name,
  imageUrl,
  id,
  dataType,
  author,
  artists,
  desc,
  isLoading,
  publisher,
  dateAdd,
  type,
}) => {
  const {
    setCurrentTrack,
    setCurrentTrackIndex,
    setQueue,
    calNextTrackIndex,
    setPlayingType,
    handlePause,
    currentTrack,
    isPlaying
  }=useContext(PlayerContext);  
  
  //const [isPlayBtn, setIsPlayBtn]=useState<boolean>(false);
  const [data, setData]=useState<any>();


  const navigate=useNavigate()

  useEffect(() => {
    if(id) {
      const fetchData = async () => {
        if(dataType==='album') {
          const data=await categoryApi({
            type: 'albums',
            id,
          })
          if (data?.error) {
            navigate("/not-found");
          } else {
            setData({...data});
          }
              
        } else if(dataType==='playlist') {
          const data=await categoryApi({
            type: `playlists`,
            id,
          })
          if (data?.error) {
            navigate("/not-found");
          } else {
            setData({...data});
          }
            
        } else if(dataType==='artist') {
          const data=await getArtistTopTrack(id)
          
          if (data?.error) {
            navigate("/not-found");
          } else {
            setData({...data})
          }
              
        } else if(dataType==='show') {
          const data=await showApi({id})
          if (data?.error) {
            navigate("/not-found");
          } else {
            setData({...data})
          }
              
        } else if(dataType==='episode') {
          const data=await episodeApi({id})
          if (data?.error) {
            navigate("/not-found");
          } else {
            setData({...data})
          }
            
        }
      }
      fetchData();
    }
    
  }, [])
  
  
  const handleClickPlayBtn = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if(isPlayBtn && isCurrent) {
      handlePause();
    } else if (!isCurrent) {
        if(dataType==='album') {
            const queueList = data?.tracks?.items?.map((item: any) => {
              return {
                ...item,
                album: {
                  album_type: data?.album_type,
                  id: data?.name,
                  name: data?.name,
                  images: data?.images,
                },
              }
            })
            setQueue([...queueList])
            setCurrentTrack({ ...queueList?.[0] })
            setCurrentTrackIndex(0)
            setPlayingType('track')
            calNextTrackIndex()
            
        } else if (dataType === 'playlist') {
            const queueList = data?.tracks?.items?.map((item: any) => item?.track) || []
            setQueue([...queueList])
            setCurrentTrack({ ...queueList?.[0] })
            setCurrentTrackIndex(0)
            setPlayingType('track')
            calNextTrackIndex()
          
        } else if (dataType === 'artist') {
            setQueue([...data.tracks])
            setCurrentTrack({ ...data?.tracks?.[0] })
            setCurrentTrackIndex(0)
            calNextTrackIndex()
            setPlayingType('track')
            
            
        } else if (dataType === 'show') {
            const queueList =
              data?.episodes?.items?.map((item: any) => {
                return {
                  ...item,
                  show: { name: data?.name, id: data?.id, publisher: data?.publisher },
                }
              }) || []
            setQueue([...queueList])
            setCurrentTrack({ ...queueList?.[0] })
            setCurrentTrackIndex(0)
            calNextTrackIndex()
            setPlayingType('show')
            
        } else if (dataType === 'episode') {
            setQueue([{ ...data }])
            setCurrentTrack({ ...data })
            setCurrentTrackIndex(0)
            setPlayingType('show')
            calNextTrackIndex()
          
        }
    }
  }

  const isCurrent=useMemo(() => {
    if(dataType==='album') {
      return !!data?.tracks?.items?.some((item: any) => item?.id===currentTrack?.id);
    } else if(dataType==='playlist') {
      return  !!data?.tracks?.items?.some((item: any) => item?.track?.id === currentTrack?.id);
    } else if(dataType==='artist') {
      return !!data?.tracks?.some((item: any) => item?.id===currentTrack?.id);
    } else if(dataType==='show') {
      return !!data?.episodes?.items?.some((item: any) => item?.id===currentTrack?.id);
    }
    else if(dataType==='episode') {
      return Boolean(data?.id === currentTrack?.id);
    }
  }, [data, currentTrack]);
  
  const isPlayBtn=isCurrent && isPlaying;  
  

  return (
    <div onClick={() => navigate(`/${dataType}/${id}`)} className={cx('wrapper')}>
      <div className={cx({ img: true, isArtist: dataType === 'artist' })}>
        {!isLoading ? (
          dataType === 'artist' ? (
            imageUrl ? (
              <ImageLazy src={imageUrl} alt={title || name} />
            ) : (
              <div className={cx('user-img-default')}>
                <UserImgDefault />
              </div>
            )
          ) : (
            <ImageLazy src={imageUrl} alt={title || name} />
          )
        ) : (
          <Skeleton height={'100%'} />
        )}
      </div>
      <div className={cx('btn-pivot')}>
        {!isLoading && (
          <div
            className={cx({
              'play-btn': true,
            })}
            onClick={handleClickPlayBtn}
          >
            <PlayButton
              size={50}
              fontSize={24}
              scaleHovering={1.05}
              transitionDuration={33}
              isPlay={isPlayBtn}
            />
          </div>
        )}
      </div>
      <div className={cx('body')}>
        {!isLoading ? (
          <h3 className={cx('heading')}>{title || name}</h3>
        ) : (
          <Skeleton height={30} borderRadius={50} />
        )}
        <div className={cx('desc')}>
          {!isLoading ? (
            <p
              dangerouslySetInnerHTML={{
                __html:
                  (type === 'show' && publisher) ||
                  (dataType === 'episode' && dateFormatConvertor(dateAdd)) ||
                  desc ||
                  (author && `By ${author}`) ||
                  (dataType === 'artist' && 'Artist') ||
                  (artists && <SubTitleArtists data={artists} />) ||
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
              }}
            ></p>
          ) : (
            <Skeleton width={'60%'} height={22.5} borderRadius={50} />
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(SectionItem)
