import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MainLayout from './layouts/MainLayout'

const App = () => {
  return (
    <>
      {/*<Suspense>*/}
        <Routes>
          <Route path='/' element={<MainLayout  />}>
            <Route index element={<Home  />} />
          </Route>
        </Routes>
      {/*</Suspense>*/}
    </>
  )
}

export default App
