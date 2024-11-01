import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Sign_up from './signup'
import Login_page from './login'
import { useState } from 'react'
import Home_page from './home'
import Landing_page from './landingpage'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Landing_page/>}/>
      <Route path='/signup' element={<Sign_up/>}/>
      <Route path='/login' element={<Login_page/>}/>
      <Route path='/home' element={<Home_page/>}/>
    </Routes>
    </BrowserRouter> 
  )
}

export default App
