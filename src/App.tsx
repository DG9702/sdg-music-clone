import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import Search from "./pages/Search";
import LoadingLayout from "./layouts/LoadingLayout";
import SectionContainer from "./pages/SectionContainer";
import GenreContainer from "./pages/GenreContainer";

const App = () => {
  return (
    <Suspense fallback={<LoadingLayout />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/section/:id" element={<SectionContainer />} />
          <Route path="/genre/:id" element={<GenreContainer />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
