  import React from 'react'
  import { BrowserRouter,Routes,Route } from 'react-router-dom'
  import { useState } from 'react'
  import Sign_up from './signup'
  import Login_page from './login'
  import InitForm from './initForm'
  import Home_page from './home'
  import Landing_page from './landingpage'
  import ProtectedRoute from './ProtectedRoute'
  import InventoryManagement from './inventoryManagement';
  import InventoryOptimisation from './inventoryOptimisation';
  import Navbar from './navbar'
  import Profile from './profile'
  import Layout from './Layout'
  import Forecast from './forecast'
  import Trends from './trends'
  import ForgotPassword from './forgotPassword'
  import ResetPassword from './resetPassword'
  const App = () => {
    const [auth, setAuth] = useState(false);

    return (
      <BrowserRouter>
      <Layout setAuth={setAuth} auth={auth}>
        <Routes>
          <Route path='/' element={<Landing_page/>}/>
          <Route path='/signup' element={<Sign_up setAuth={setAuth}/>}/>
          <Route path='/login' element={<Login_page setAuth={setAuth}/>}/>
          <Route path='/forgotPassword' element={<ForgotPassword />}/>
          <Route path='/resetPassword' element={<ResetPassword />}/>
          {/* <Route path='/initForm' element={<InitForm />}/> */}
          <Route path='/initForm' element={<ProtectedRoute auth={auth}><InitForm /></ProtectedRoute>}/>
          {/* <Route path='/home' element={<Home_page />}/> */}
          <Route path='/home' element={<ProtectedRoute auth={auth}><Home_page /></ProtectedRoute>}/>
          {/* <Route path='/inventory' element={<InventoryManagement />}/> */}
          <Route path='/inventory' element={<ProtectedRoute auth={auth}><InventoryManagement /></ProtectedRoute>} />
          {/* <Route path='/forecast' element={<Forecast />}/> */}
          <Route path='/forecast' element={<ProtectedRoute auth={auth}><Forecast /></ProtectedRoute>} />
          {/* <Route path='/profile' element={<Profile />}/> */}
          <Route path='/profile' element={<ProtectedRoute auth={auth}><Profile /></ProtectedRoute>} />
          {/* <Route path='/trends' element={<Trends />}/> */}
          <Route path='/trends' element={<ProtectedRoute auth={auth}><Trends /></ProtectedRoute>} />
          <Route path='/inventoryOptimisation' element={<ProtectedRoute auth={auth}><InventoryOptimisation /></ProtectedRoute>} />
          {/* /inventoryOptimisation
          /forecast
          /resetPassword
          /forgotPassword
          /trends */}
          
          {/* <Route path='/forgotPassword' element={<ForgotPassword />}/>
          <Route path='/resetPassword' element={<ResetPassword />}/> */}
          {/* <Route path='/navbar' element={<Navbar setAuth={setAuth}/>}/> */}
        </Routes>
      </Layout>
      </BrowserRouter> 
    )
  }

  export default App
