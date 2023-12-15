import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MainLayout from './layouts/MainLayout'
import Search from './pages/Search'

const App = () => {
  return (
    <>
      {/*<Suspense>*/}
        <Routes>
          <Route path='/' element={<MainLayout  />}>
            <Route index element={<Home  />} />
            <Route path='/search' element={<Search  />} />
          </Route>
        </Routes>
      {/*</Suspense>*/}
    </>
  )
}

export default App
