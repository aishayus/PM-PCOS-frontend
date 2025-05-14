import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'


export const AppContext = createContext()

const AppContextProvider = ({ children }) => {

    // const navigate = useNavigate()
    const url = 'https://pm-pcosbackend.onrender.com'
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [user, setUser] = useState(null)

    useEffect(() => {
        if(!token) return setUser(null)
            axios. get(`${url}/api/get`, { headers: {token} }).then(res => {
                if(res.data.success){
                    setUser(res.data.user)
                }else{
                    setToken('')
                    localStorage.removeItem('token')
                }
            })
    }, [token])

    const contextValue = {token, setToken, url, user, setUser}

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
