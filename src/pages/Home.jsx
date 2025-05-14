import React, { useState } from 'react'
import HeroPic1 from '../assets/HeroPic1.jpg'
import { motion } from 'framer-motion'
import { FaStethoscope, FaChartBar, FaHandsHelping, FaGlobe, FaCloud } from 'react-icons/fa'
import { TbCrystalBall } from "react-icons/tb"
import Owners from '../assets/Owners.jpg'
import { IoMdWatch } from 'react-icons/io'
import Footer from './../components/Footer';


const Home = () => {

    const features = [
        {
            icon: <TbCrystalBall className="w-11 h-11 text-[#9E182B] mx-auto mb-4" />, 
            title: 'PCOS Prediction', 
            description: 'Provides ML-driven predictions of PCOS risk based on your health data provided.'
        },
        {
            icon: <FaStethoscope className="w-11 h-11 text-[#9E182B] mx-auto mb-4" />, 
            title: 'PCOS Monitoring', 
            description: 'Allows user to track and monitor your symptoms continuously with real-time updates.'
        },
        {
            icon: <FaChartBar className="w-11 h-11 text-[#9E182B] mx-auto mb-4" />, 
            title: 'Data Visualization', 
            description: 'Allows user to view clear graphs and charts of wearable device metrics for deeper insights.'
        },
        {
            icon: <FaHandsHelping className="w-11 h-11 text-[#9E182B] mx-auto mb-4" />, 
            title: 'Support Space', 
            description: 'Allows user to connect with a community and access resources dedicated to women’s health.'
        }
    ]

    const [selected, setSelected] = useState('website')
    const steps = {
        website: {
            title: 'Website Interface',
            description: `The website serves as the user interface where individuals can enter their health information through the "MyForms" page. This data is then sent to the cloud for processing. Once a prediction is made, the website fetches and displays the results. It also syncs with the wearable device to visualize real-time physiological data.`,
        },
        wearable: {
            title: 'Wearable Device',
            description: `The wearable device continuously collects physiological metrics such as stress levels, body temperature, heart rate, and cortisol levels. This non-invasive data is securely transmitted to the cloud for analysis.`,
        },
        cloud: {
            title: 'Cloud & ML Models',
            description: `The cloud infrastructure hosts machine learning models trained to predict PCOS. It processes the data received from both the website and wearable device, generates predictions, and sends the results back to the website for the user to view.`,
        }
    }

    return (
        <>
            {/* Hero */}
            <motion.section 
                id='#'
                className='flex flex-col md:flex-row items-center justify-between text-[#9E182B] md:my-20 px-5 md:px-16 py-8 gap-x-10 h-full md:h-[500px]'
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2 }}>

                {/* Left Side */}
                <div className='w-full md:w-1/2'>
                    <h1 className='bold-28 md:bold-48 text-center md:text-left mb-4'>Welcome to PM-PCOS</h1>
                    <p className='text-[#9E182B] regular-16 text-justify leading-7'>
                        PM-PCOS stands for Predictive Monitoring of Polycystic Ovaries Syndrome, also known as PCOS. PCOS is a hormonal dysfunction
                        that stems from Hormonal Imbalance. PCOS is a dysfunction that is detected through frequent visitation to the hospital
                        and using invasive methods. PM-PCOS is a non-invasive method of predicting PCOS using information inputted by the user and data from a wearable device.
                    </p>
                </div>

                {/* Right Side */}
                <div className='w-full md:w-1/2 flex justify-center mt-10 md:mt-0'>
                    <img 
                        src={HeroPic1} 
                        alt='PM-PCOS Illustration' 
                        className='rounded-full h-[300px] w-[300px] md:h-[500px] md:w-[500px]'
                    />
                </div>
            </motion.section>


            {/* Features */}
            <section id='features' className="bg-[#F2E0D2] py-16 px-6 md:px-20">
                <h2 className="text-center bold-36 text-[#9E182B] mb-12">Key Features of PM-PCOS</h2>
                
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feat, idx) => (
                    <div key={idx}  className="bg-[#F9CBD6] border border-[#9E182B] rounded-2xl px-6 py-10 text-center shadow-lg hover:scale-105" >
                        {feat.icon}
                            <h3 className="bold-28 text-[#9E182B] mb-2">{feat.title}</h3>
                            <p className="regular-16 text-[#9E182B]">{feat.description}</p>
                    </div>
                ))}
                </div>
            </section>


            {/*How it works*/}
            <section id='howitworks' className="py-12 px-6 md:px-20 flex flex-col md:flex-row gap-x-8 items-center h-[650px]">
                {/* Description Panel */}
                <div className="w-full md:w-1/2 mb-10 md:mb-0">
                    <h2 className="text-[#9E182B] bold-28 md:bold-44 mb-3">How PM-PCOS Works</h2>
                    <h3 className="bold-20 md:bold-24 text-[#9E182B] mb-2">{steps[selected].title}</h3>
                    <p className="regular-14 md:regular-18 text-[#9E182B]">
                        {steps[selected].description}
                    </p>
                </div>
            
                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative w-64 h-64 md:w-[400px] md:h-[400px] md:my-4">
                        {/* Ring */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                        >
                            {/* Circle background */}
                            <div className="absolute inset-0 border-4 border-[#9E182B] rounded-full"></div>
                            
                            {/* Top */}
                            <button onClick={() => setSelected('website')} className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="relative">
                                    <FaGlobe className="w-14 h-14 md:w-16 md:h-16 border-2 border-[#9E182B] rounded-full p-3 bg-[#F2E0D2] text-[#9E182B]" />
                                </div>
                            </button>
                            
                            {/* Right */}
                            <button onClick={() => setSelected('wearable')} className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                                <div className="relative">
                                    <IoMdWatch className="w-14 h-14 md:w-16 md:h-16 border-2 border-[#9E182B] rounded-full p-3 bg-[#F2E0D2] text-[#9E182B]" />
                                </div>
                            </button>
                            
                            {/* Left */}
                            <button onClick={() => setSelected('cloud')} className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="relative">
                                    <FaCloud className="w-14 h-14 md:w-16 md:h-16 border-2 border-[#9E182B] rounded-full p-3 bg-[#F2E0D2] text-[#9E182B]" />
                                </div>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* About */}
            <section id='about' className='bg-[#9E182B] flex flex-col md:flex-row gap-x-5 p-8 md:px-10 md:py-14'>
                <div className='md:w-2/3'>
                    <h1 className='text-[#F2E0D2] bold-24 md:bold-28'>About PM-PCOS</h1>
                    <p className='text-[#F2E0D2] regular-14 md:regular-18 pt-2 md:pt-4 leading-5 md:leading-8'>
                        More than thirty years after the first PCOS diagnostic criteria were published, 
                        women's health stll depends on periodic check-ups that often miss early warning signs. 
                        Real-time, non-invasive solutions for detecting and managing hormonal imbalances remain scarce—traditional methods are invasive, 
                        costly, and slow, leading to delayed treatment and misdiagnoses.
                        PM-PCOS was created by three final-year computer engineering students to change this. 
                        Their goal was to build a continuous health-monitoring platform that empowers women with timely feedback, 
                        reduces reliance on hospital visits, and puts control back in the user's hands.
                        By focusing on accessibility, security, and ease of use, PM-PCOS offers a proactive approach to women's healthcare. 
                        Rather than waiting for symptoms to worsen, users gain ongoing insights into their well-being—encouraging informed lifestyle choices and fostering early detection of hormonal issues.
                        With the potential to transform how PCOS is monitored and managed, PM-PCOS stands to revolutionize women's health care by delivering personalized, 
                        around-the-clock support—no invasive tests required.
                    </p>
                </div>

                <div className='md:w-1/3 relative md:px-10 py-5 flex flexCenter'>
                    <img src={Owners} alt='' className='h-[350px] w-[300px] md:h-[450px] md:w-[400px] rounded-full border-4 border-[#F2E0D2]'/>
                </div>
            </section>


            {/*Contact Us*/}
            <section id='contact' className='bg-[#F2E0D2] md:h-[500px] flex flexCenter flex-col md:px-10 py-5'>
                <h2 className='text-center bold-36 text-[#9E182B] mb-8'>Contact Us</h2>
                <div className='flex flexCenter flex-col md:flex-row bg-[#F9CBD6] rounded-2xl text-center mx-5'>
                    <div className='md:w-1/2 px-4 md:px-8 py-10'>
                        <h1 className='text-[#9E182B] regular-14 md:regular-20'>Have questions, feedback, or need help? We're here to listen. PM-PCOS is built for women's health — your voice helps us improve and support more lives.</h1>
                    </div>

                    <form className='bg-[#F2AFBC] md:w-1/2 w-full px-5 py-10 h-full rounded-t rounded-2xl md:rounded-l md:rounded-2xl'>
                        <div className='flex flex-col gap-4'>
                            <input name='email' type='email' placeholder='Email' required className='bg-white text-[#9E182B] placeholder:text-[#D97483] border border-[#F2AFBC] p-2 pl-4 w-full rounded-md outline-none focus:ring-2 focus:ring-[#F2AFBC]'/>
                            <textarea placeholder='Send us a mesaage' className='rounded-md h-24 outline-none px-4 py-1.5 text-[#9E182B] placeholder:text-[#D97483] focus:ring-2 focus:ring-[#F2AFBC]'></textarea>
                        </div>
                        <button type='submit' className='bg-[#9E182B] text-[#F2E0D2] mt-5 p-2 rounded-full w-full hover:bg-[#F9CBD6] hover:text-[#9E182B] transition'>
                            Send Email
                        </button>
                    </form>
                </div>
            </section>
            
            {/* Footer */}
            <Footer />
        </>
    )
}

export default Home
