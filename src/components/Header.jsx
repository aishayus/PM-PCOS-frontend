import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CgMenuRight, CgProfile } from "react-icons/cg";
import NavBeforeLogin from './NavBeforeLogin';
import Navbar from './Navbar';
import { AppContext } from '../context/AppContext';
import defaultImg from '../assets/default.jpeg'


const Header = ({containerStyles, setShowLogin}) => {

    const [menuOpen, setMenuOpen] = useState(false)
    const {token} = useContext(AppContext)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768){
                setMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return() => window.removeEventListener('resize', handleResize)

    }, [])

    return (
        <header className=''>
            <div className='max-padd-container w-full bg-[#F2E0D2]'>
                <div className='flexBetween py-4'>
                    {/* Logo */}
                    {!token ? 
                        (<a href='#' className='bold-24 md:bold-32 text-[#9E182B]'>PM-PCOS</a>)
                        :
                        (<Link to={'/myhealth'} className='bold-24 md:bold-32 text-[#9E182B]'>PM-PCOS</Link>)}

                    <div className='flexBetween gap-x-8'>
                        {/* Navbar */}
                        <div className='text-[#9E182B]'>
                            {!token ? 
                                (<NavBeforeLogin menuOpen={menuOpen} toggleMenu={toggleMenu} containerStyles={`${menuOpen ? 'flex flex-col gap-y-6 h-auto w-[222px] absolute right-3 top-20 bg-[#F2E0D2] z-50 px-10 pt-1 pb-8 shadow-xl rounded-2xl' : 'md:flexBetween gap-x-8 hidden cursor-pointer'}`} />) 
                                : 
                                (<Navbar menuOpen={menuOpen} toggleMenu={toggleMenu} containerStyles={`${menuOpen ? 'flex flex-col gap-y-6 h-auto w-[222px] absolute right-3 top-20 bg-[#F2E0D2] z-50 px-10 pt-1 pb-8 shadow-xl rounded-2xl' : 'md:flexBetween gap-x-8 hidden cursor-pointer'}`} />)}
                        </div>

                        {/* Menu */}
                        <CgMenuRight onClick={toggleMenu} className='md:hidden text-2xl text-[#9E182B]' />

                        {/* Buttons */}
                        {!token ? 
                        (<button onClick={() => setShowLogin(true)} className='bold-16 px-4 py-1 text-[#F2E0D2] bg-[#9E182B] hover:scale-105 rounded-full'>Login</button>) 
                            :
                        (<div className='relative group'>
                            <Link to={'/myprofile'}>
                                <img src={defaultImg} alt={<CgProfile/>} className='w-10 h-10 rounded-full'/>
                            </Link>
                            <span className='absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bold-12 text-[#F2E0D2] bg-[#9E182B] rounded opacity-0 group-hover:opacity-100 transition-all duration-200'>
                                Profile
                            </span>
                        </div>)}
                    </div>
                    
                </div>
            </div>
        </header>
    )
}

export default Header