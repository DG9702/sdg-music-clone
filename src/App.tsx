import React, { createContext, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Search from "./pages/Search";
import LoadingLayout from "./layouts/LoadingLayout";
import SectionContainer from "./pages/SectionContainer";
import GenreContainer from "./pages/GenreContainer";
import Playlist from "./pages/Playlist";
import Album from "./pages/Album";
import Artist from "./pages/Artist";
import deleteAllCookies from "./utils/deleteAllCookies";
import SectionPage from "./pages/SectionPage";
import Show from "./pages/Show";
import Episode from "./pages/Episode";
import PlaylistSaveTrack from "./pages/PlaylistSaveTrack";
//import PlaylistLikeSong from "./pages/PlaylistLikeSong";

interface AppContext {
  isPlayingViewShowed: boolean;
  setPlayingViewShowed: React.Dispatch<React.SetStateAction<boolean>>;
  isQueueShowed: boolean;
  setQueueShowed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext({} as AppContext);

const App = () => {
  const [isPlayingViewShowed, setPlayingViewShowed] = useState<boolean>(false);
  const [isQueueShowed, setQueueShowed] = useState<boolean>(false);
  useEffect(() => {
    deleteAllCookies();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isPlayingViewShowed,
        setPlayingViewShowed,
        isQueueShowed,
        setQueueShowed,
      }}
    >
      <Suspense fallback={<LoadingLayout />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/section/:id" element={<SectionContainer />} />
            <Route path="/genre/:id" element={<GenreContainer />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/collection/track" element={<PlaylistSaveTrack />} />
            <Route path="/album/:id" element={<Album />} />
            <Route path="/show/:id" element={<Show />} />
            <Route path="/episode/:id" element={<Episode />} />
            <Route path="/artist/:id">
              <Route index element={<Artist />} />
              <Route path="/artist/:id/featuring" element={<SectionPage />} />
              <Route path="/artist/:id/related" element={<SectionPage />} />
              <Route
                path="/artist/:id/discovered-on"
                element={<SectionPage />}
              />
              <Route path="/artist/:id/appears-on" element={<SectionPage />} />
              <Route path="/artist/:id/playlists" element={<SectionPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AppContext.Provider>
  );
};

export default App;
