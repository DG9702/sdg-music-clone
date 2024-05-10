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

interface AppContext {
  isPlayingViewShowed: boolean;
  setPlayingViewShowed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext({} as AppContext);

const App = () => {
  const [isPlayingViewShowed, setPlayingViewShowed] = useState<boolean>(false);
  useEffect(() => {
    deleteAllCookies();
  }, []);

  return (
    <AppContext.Provider value={{ isPlayingViewShowed, setPlayingViewShowed }}>
      <Suspense fallback={<LoadingLayout />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/section/:id" element={<SectionContainer />} />
            <Route path="/genre/:id" element={<GenreContainer />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/album/:id" element={<Album />} />
            <Route path="/artist/:id" element={<Artist />} />
          </Route>
        </Routes>
      </Suspense>
    </AppContext.Provider>
  );
};

export default App;
