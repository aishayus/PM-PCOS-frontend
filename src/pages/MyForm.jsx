import React, { useContext, useEffect, useState } from 'react'
import Form from '../components/Form'
import Prediction from '../components/Prediction'
import { AppContext } from './../context/AppContext'
import axios from 'axios'

const MyForm = () => {
    const { user, url, token } = useContext(AppContext)
    const [view, setView]         = useState('form')
    const [prediction, setPrediction] = useState(null)
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState('')

    const predKey = () => user?._id && `prediction_${user._id}`

    useEffect(() => {
        if (!user?._id) return
            const stored = localStorage.getItem(predKey())
        if (stored) {
            const { view: savedView, data: savedData } = JSON.parse(stored)
            setView(savedView)
            setPrediction(savedData)
        }
    }, [user])

    const fetchPrediction = async () => {
        setLoading(true)
        setError('')

        try {
            const res = await axios.get(`${url}/api/predict/result`, {
                headers: { token }
            })

        if (res.data) {
            setPrediction(res.data)
            setView('prediction')
            localStorage.setItem( predKey(), JSON.stringify({ view: 'prediction', data: res.data }))
        } else {
            throw new Error('No data returned')
        }
        } catch (err) {
            console.error(err)
            setError('Could not fetch prediction')
        } finally {
            setLoading(false)
        }
    }

    const handleRetake = () => {
        setView('form')
        setPrediction(null)
        setError('')

        if (user?._id) {
            localStorage.removeItem(predKey())
            localStorage.removeItem(`formData_${user._id}`)
            localStorage.removeItem(`formStatus_${user._id}`)
        }
    }

    return (
        <>
            {view === 'form' && (
                <>
                    <Form onSymptomsSuccess={fetchPrediction} />
                        {loading && ( <div className='text-center bold-24 py-10 text-[#9E182B]'> Loading prediction... </div>)}
                        {error && ( <div className='flex justify-center py-4'> <p className='text-[#9E182B] bold-14'>{error}</p></div>)}
                </>
            )}

            {view === 'prediction' && (
                <Prediction prediction={prediction} handleRetake={handleRetake}/>
            )}
        </>
    )
}

export default MyForm