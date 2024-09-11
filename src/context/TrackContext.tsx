/* eslint-disable react-hooks/exhaustive-deps */

import React, {createContext, FC, useEffect, useState} from "react";
import {getUserSaveTrack} from "~/services/trackApi";

interface TrackProviderProps {
    children: React.ReactNode
}

interface TrackContext {
    savingTracks: any
    isTrackSaved: any 
}

export const TrackContext = createContext({} as TrackContext)

export const TrackProvider: FC<TrackProviderProps> = ({ children }) => {  
    const [savingTracks, setSavingTracks]=useState([]);
    
    useEffect(() => {
    const fetchLikeSong = async () => {
      const result = await getUserSaveTrack({
        market: "VN",
        limit: 20,
      });
      const savedTracks = result.items.map((item: any) => ({
        id: item.track.id, // Extract track ID
      }));

      setSavingTracks(savedTracks);
    };
    fetchLikeSong();
  }, []);

    const isTrackSaved = (trackId: string) => {
        return savingTracks?.some((track: any) => track.id === trackId);
    };
    
  return (
    <TrackContext.Provider
      value={{
        savingTracks,
        isTrackSaved,
      }}
    >
      {children}
    </TrackContext.Provider>
  )
}
