import React, { useContext, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MyForm from './pages/MyForm'
import MyHealth from './pages/MyHealth'
import MyProfile from './pages/MyProfile'
import LoginPopUp from './components/LoginPopUp'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppContext } from './context/AppContext'

const clientId = '729583018245-b2gip9gms88f7e2aieatijt10i1acge3.apps.googleusercontent.com'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const { token } = useContext(AppContext)

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className='font-bold bg-[#F2AFBC] min-h-screen'>
        <ToastContainer />
        {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
        <Header setShowLogin={setShowLogin} />
        <Routes>
          {!token ? (
            <Route path='/' element={<Home />} />
          ) : (
            <>
              <Route path='/myhealth' element={<MyHealth />} />
              <Route path='/myform' element={<MyForm />} />
              <Route path='/myprofile' element={<MyProfile />} />
            </>
          )}
        </Routes>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
