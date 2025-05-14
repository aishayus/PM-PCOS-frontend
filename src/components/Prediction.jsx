import React from 'react'
import { Link } from 'react-router-dom';

const Prediction = ({ prediction, handleRetake }) => {
    return (
        <div className="min-h-screen flexCenter p-6">
            {prediction?.confidence && (
                <div className="bg-[#F9CBD6] p-8 rounded-2xl shadow-xl border border-[#F2E0D2] flex flex-col items-center">
                    <ul className="text-[#9E182B] bold-20 mb-6 text-center">
                        <li>No PCOS: {prediction.confidence['No PCOS']}%</li>
                        <li>PCOS: {prediction.confidence['PCOS']}%</li>
                    </ul>

                    <p className="text-[#9E182B] bold-32 text-center">
                        Prediction: <span className='border-b-4 border-[#9E182B] pb-0.5'>{prediction.prediction === 1 ? 'PCOS' : 'No PCOS'}</span>
                    </p>
                    <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-3 w-full">
                        <button onClick={handleRetake} className="w-full md:w-auto bg-[#9E182B] text-white py-2 px-6 rounded-full hover:bg-[#8c1527] transition">
                            Retake Form
                        </button>

                        <Link to="/myhealth" className="w-full text-center md:w-auto bg-[#9E182B] text-white py-2 px-6 rounded-full hover:bg-[#8c1527] transition">
                            See Data
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Prediction